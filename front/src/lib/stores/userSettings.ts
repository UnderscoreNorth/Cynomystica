import { writable } from 'svelte/store';

export const userSettings = writable({
	sync: { threshold: 2500 },
	display: { danmaku: 'none', chat: 'left', video: true, chatWidth: 21 },
	icon: '',
	users: [],
	blockSave: false
});
