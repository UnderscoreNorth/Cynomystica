import { writable } from 'svelte/store';

export const userSettings = writable({
	sync: { threshold: 2500 },
	display: {
		danmaku: 'none',
		chat: 'left',
		video: true,
		snow: 0
	},
	chat: {
		chatWidth: 21,
		anonymous: false
	},
	icon: '',
	users: [],
	blockSave: false
});
