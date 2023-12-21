import { writable } from 'svelte/store';

export const userSettings = writable({
	sync: { threshold: 2500 },
	display: {
		danmaku: 'none',
		chat: 'left',
		video: true
	},
	chat: {
		chatWidth: 21,
		chatArray: 500
	},
	icon: '',
	users: [],
	blockSave: false
});
