import { writable } from 'svelte/store';

export const userSettings = writable({
	video: { width: '70vw', height: '' },
	chat: { display: 'Chatbar-left' },
	polls: { display: 'Overlay' },
	images: { display: true },
	sync: { threshold: 2500 },
	users: []
});
