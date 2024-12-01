import { writable } from 'svelte/store';
//Settings that persist upon refresh
export const defaultSettings = {
	sync: { threshold: 2500 },
	display: {
		danmaku: 'none',
		chat: 'left',
		video: true,
		hideImage: false
	},
	chat: {
		chatWidth: 21,
		chatArray: 150
	},
	icon: '',
	users: [],
	ready: false,
	muted: false,
	videoVolume: 1,
	scheduleModalStart: '00:00',
	color: 222
};
export const userSettings = writable(defaultSettings);
