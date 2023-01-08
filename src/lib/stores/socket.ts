import { user } from './user';
import { userSettings } from './userSettings';
import { video } from './video';
import type { videoType } from './video';
import { playlist } from './playlist';
import { chat } from './chat';
import { io } from '$lib/realtime';
import { users } from './users';
import { blocker } from './blocker';

const init = () => {
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
		}
	});
	io.on('message', (e) => {
		chat.update((oldChat) => {
			oldChat.push(e);
			if (oldChat.length > 100) oldChat.splice(0, oldChat.length - 100);
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
			n.connectedUsers = e;
			return n;
		});
	});
	io.on('login', (e) => {
		blocker.update((n) => {
			n.login = false;
			return n;
		});
		console.log(e);
		user.set({
			username: e.username,
			accessLevel: e.accessLevel,
			icon: '',
			accessToken: '',
			refreshToken: ''
		});
	});
};
export default init;
