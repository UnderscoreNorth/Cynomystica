import { writable } from 'svelte/store';
//Settings that persist upon refresh
export const userSettings = writable({
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
	ready: false
});
