import { user } from './user';
import { userSettings } from './userSettings';
import { video } from './video';
import type { videoType } from './video';
import { playlist } from './playlist';
import { chat } from './chat';
import { io } from '$lib/realtime';
import { users } from './users';
import { blocker } from './blocker';
import { schedule } from './schedule';
import type { iconList } from './icons';
import { icons } from './icons';
import { login } from '$lib/utilities/login';
import { permissions } from './permissions';

const init = () => {
	io.on('connected', () => {
		if (localStorage.getItem('username')) {
			login(localStorage.getItem('username'), localStorage.getItem('refreshToken'), 'token');
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
		}
	});
	io.on('message', (e) => {
		chat.update((oldChat) => {
			const pushMsg = (msg) => {
				msg.played = false;
				oldChat.push(msg);
				if (oldChat.length > 100) oldChat.splice(0, oldChat.length - 100);
			};
			if (e?.length > 0) {
				for (let msg of e) {
					pushMsg(msg);
				}
			} else {
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
			n.connectedUsers = Object.values(e).length;
			n.users = Object.values(e);
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
};
export default init;
