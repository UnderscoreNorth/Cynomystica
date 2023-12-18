import { user } from './user';
import { userSettings } from './userSettings';
import { video } from './video';
import type { videoType } from './video';
import { playlist } from './playlist';
import { chat } from './chat';
import { io } from '$lib/realtime';
import { users, type otherUser } from './users';
import { blocker } from './blocker';
import { schedule } from './schedule';
import type { iconList } from './icons';
import { icons } from './icons';
import { login } from '$lib/utilities/login';
import { permissions } from './permissions';
import { tabText } from './tabText';
import { theThreeGuys } from './theThreeGuys';
let userObj: any = {};
user.subscribe((e) => {
	userObj = e;
});

const init = () => {
	io.on('connected', () => {
		if (localStorage.getItem('username')) {
			login(localStorage.getItem('username'), localStorage.getItem('refreshToken'), 'token');
		} else {
			let reload = false;
			if (userObj.username?.length > 0) reload = true;
			user.set({
				username: '',
				accessLevel: -1,
				icon: '',
				accessToken: undefined,
				refreshToken: undefined
			});
			if (reload) location.reload();
		}
	});

	let currentChat: Array<object>;
	chat.subscribe((value) => {
		currentChat = value;
	});
	let currentVideo: videoType;
	video.subscribe((value) => {
		currentVideo = value;
	});
	io.emit('get-playlist');
	io.on('playlist', (e) => {
		if (e.status == 'success') {
			playlist.set(e.playlist);
			if (!e.playlist.length) {
				video.set({ id: '', url: '', seekTime: 0, type: '' });
			} else {
				if (e.playlist[e.playlistIndex].id !== currentVideo.id) {
					video.set(e.playlist[e.playlistIndex]);
				}
			}
			theThreeGuys.set(e.theThreeGuys);
		}
	});
	io.on('message', (e) => {
		chat.update((oldChat) => {
			const pushMsg = (msg) => {
				msg.played = false;
				oldChat.push(msg);
				if (oldChat.length > 500) oldChat.splice(0, oldChat.length - 500);
			};
			if (e?.length > 0) {
				for (let msg of e) {
					pushMsg(msg);
				}
			} else {
				if (e.message.includes(userObj.username) && userObj.username) {
					if (document.hidden == true) tabText.set(`*Pinged by ${e.username}*`);
				}
				pushMsg(e);
			}

			return oldChat;
		});
	});
	io.on('messages', (e) => {
		chat.set(e);
	});
	io.on('seek-update', (e) => {
		if (e.status == 'success') {
			video.update((v) => {
				v.seekTime = e.seekTime;
				return v;
			});
		}
	});
	io.on('connected-users', (e) => {
		users.update((n) => {
			const usersArr: Array<otherUser> = Object.values(e);
			usersArr.sort((a, b) => {
				if (a.accessLevel < b.accessLevel) return 1;
				if (a.accessLevel > b.accessLevel) return -1;
				if (a.username > b.username) return 1;
				if (a.username < b.username) return -1;
				return 0;
			});
			n.connectedUsers = Object.values(e).length;
			n.users = usersArr;
			return n;
		});
	});
	io.on('icons', (e: iconList) => {
		icons.set(e);
	});
	io.on('login', (e) => {
		blocker.update((n) => {
			n.login = false;
			return n;
		});
		user.set({
			username: e.username,
			accessLevel: e.accessLevel,
			icon: '',
			accessToken: e.accessToken,
			refreshToken: e.refreshToken
		});
		if (e.accessLevel >= 1) {
			localStorage.setItem('accessToken', e.accessToken.token);
			localStorage.setItem('accessTokenExpires', e.accessToken.expires);
			localStorage.setItem('refreshToken', e.refreshToken.token);
			localStorage.setItem('refreshTokenExpires', e.refreshToken.expires);
			localStorage.setItem('username', e.username);
		}
	});
	io.on('schedule', (e) => {
		if (e.status == 'success') {
			schedule.set(e.schedule);
		}
	});
	io.on('permissions', (e) => {
		permissions.set(e);
	});
	io.on('usersettings', (e) => {
		if (e) {
			e.blockSave = true;
			userSettings.set(e);
			setTimeout(() => {
				e.blockSave = false;
				userSettings.set(e);
			}, 500);
		}
	});
};
export default init;
