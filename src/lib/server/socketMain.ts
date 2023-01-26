import { Server } from 'socket.io';
import type { ViteDevServer } from 'vite';
import * as Playlist from './socketPlaylist';
import * as Chat from './socketChat';
import * as ChatLogger from './chatLogging';

//SQL imports
import { db } from './sqliteDB';
import * as userTable from './sqliteTables/users';

//import type { Socket } from 'socket.io-client';
const errorDelay = 100;

const init = async (server: ViteDevServer) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	const io = new Server(server.httpServer);
	const interval = 1000;
	const playlistObj: Playlist.playlistObjType = [];
	const playlistOrder: Playlist.playlistOrderType = [];
	//const users: any = {};
	const sockets: Array<unknown> = [];

	//SQL init
	checkTables();

	let playlistIndex = 0;
	let currentSeekTime = 0;
	let currentVideoDuration = 0;
	let startTime = new Date();
	const recentMessages: Chat.MessagesType = await ChatLogger.getChatFromLog();
	const unloggedMessages: Chat.MessagesType = [];
	let lastPlaylist = '';
	let inCycle = false;

	io.on('connection', async (socket) => {
		console.log('new connection');
		let username: string;
		let socketID: number;
		let socketIDAttempts = 0;
		do {
			socketID = Math.random();
			socketIDAttempts++;
		} while (sockets[socketID] !== undefined && socketIDAttempts < 10);
		if (socketIDAttempts >= 10) {
			socket.emit('disconnect-socket');
			socket.disconnect();
		}
		sockets[socketID] = socket;
		sendUserList(io);
		Chat.sendLatestMessage(socket, recentMessages);
		//Init
		socket.on('disconnect', async () => {
			console.log('disconnected');
			delete sockets[socketID];
			sendUserList(io);
		});

		socket.on('get-playlist', () => {
			Playlist.sendPlaylist(socket, playlistOrder, playlistObj, playlistIndex, currentSeekTime);
		});
		socket.on('login-guest', (message) => {
			if (userTable.existsUser(message)) {
				socket.emit('alert', { type: 'login', message: 'Username already taken' });
				return;
			}
			const usernameCheckResults = userTable.usernameCheck(message);
			if (usernameCheckResults.length) {
				socket.emit('alert', { type: 'login', message: usernameCheckResults.join('\n') });
				return;
			}
			username = message;
			socket.username = username;
			socket.accessLevel = 0;
			sendUserList(io);
			socket.emit('login', {
				username: username,
				accessLevel: 0
			});
		});

		socket.on('queue-next', async (mediaURL: string) => {
			await Playlist.queueVideo(mediaURL, playlistObj, playlistOrder, playlistIndex)
				.then(() => {
					Playlist.sendPlaylist(io, playlistOrder, playlistObj, playlistIndex, currentSeekTime);
				})
				.catch((err) => {
					console.log('queuevideo', err);
				});
		});

		// Receive incoming recentMessages and broadcast them
		socket.on('message', (message) => {
			const messageObj = {
				from: username,
				message: message,
				time: new Date()
			};
			recentMessages.push(messageObj);
			unloggedMessages.push(messageObj);
			Chat.sendMessage(io, messageObj);
		});

		socket.on('delete-item', (playlistItem) => {
			const itemId = playlistItem.id;
			const itemIndex = playlistOrder.indexOf(itemId);
			delete playlistObj[itemId];
			playlistOrder.splice(itemIndex, 1);
			if (itemIndex == playlistIndex) {
				currentSeekTime = 0;
				currentVideoDuration = 0;
				startTime = new Date();
			}
			cycle();
		});

		socket.on('sign-up', async (signUp) => {
			const result = await userTable.createUser(signUp.username, signUp.password);
			if (result.pass) {
				username = signUp.username;
				socket.username = signUp.username;
				socket.accessLevel = signUp.accessLevel;
				sendUserList(io);
				socket.emit('login', { username: signUp.username, accessLevel: signUp.accessLevel });
			} else {
				setTimeout(() => {
					socket.emit('alert', { type: 'login', message: result.message });
				}, errorDelay);
			}
		});
		socket.on('sign-in', async (signIn) => {
			const result = await userTable.authenticateUser(signIn.username, signIn.password);
			if (result.pass) {
				username = result.username;
				socket.username = result.username;
				socket.accessLevel = result.accessLevel;
				sendUserList(io);
				socket.emit('login', { username: result.username, accessLevel: result.accessLevel });
			} else {
				setTimeout(() => {
					socket.emit('alert', { type: 'login', message: result.message });
				}, errorDelay);
			}
		});
	});
	const cycle = () => {
		if (!inCycle) {
			inCycle = true;
			try {
				currentSeekTime = Math.abs(new Date().getTime() - startTime.getTime()) / 1000;
				let currentPlaylist = JSON.stringify([playlistOrder, playlistObj]);
				if (playlistOrder.length && Object.values(playlistOrder).length) {
					if (currentSeekTime > currentVideoDuration) {
						if (currentVideoDuration > 0) {
							const id = playlistOrder[playlistIndex];
							delete playlistObj[id];
							playlistOrder.splice(playlistIndex, 1);
						}
						if (playlistOrder.length && Object.values(playlistOrder).length) {
							const playlistItem = playlistObj[playlistOrder[playlistIndex]];
							currentVideoDuration = playlistItem.duration;
						} else {
							currentVideoDuration = 0;
						}
						currentSeekTime = 0;
						startTime = new Date();
						Playlist.sendPlaylist(io, playlistOrder, playlistObj, playlistIndex, currentSeekTime);
					} else {
						io.emit('seek-update', {
							status: 'success',
							seekTime: currentSeekTime
						});
					}
					currentPlaylist = JSON.stringify([playlistOrder, playlistObj]);
				} else {
					currentSeekTime = 0;
					startTime = new Date();
					playlistIndex = 0;
					currentVideoDuration = 0;
				}
				if (currentPlaylist !== lastPlaylist) {
					Playlist.sendPlaylist(io, playlistOrder, playlistObj, playlistIndex, currentSeekTime);
				}
				lastPlaylist = currentPlaylist;
			} catch (err) {
				console.log('cycle', err);
			} finally {
				inCycle = false;
			}
		}
		ChatLogger.writeChatToLog(unloggedMessages);
	};
	setInterval(function () {
		cycle();
	}, interval);
	console.log('SocketIO injected');
};

const checkTables = () => {
	const tableList = [userTable];
	for (const table of tableList) {
		const result = db
			.prepare(`SELECT COUNT(*) as 'count' FROM sqlite_master WHERE name='${table.name}'`)
			.get();
		if (result.count == 0) {
			db.prepare(table.create).run();
		}
	}
};

const sendUserList = async (io: Server) => {
	const userList = {};
	for (let socket of Object.values(await io.sockets.fetchSockets())) {
		userList[socket.id] = {
			username: socket.username ?? socket.id,
			accessLevel: socket.accessLevel ?? 0
		};
	}
	io.emit('connected-users', userList);
};

export default init;
