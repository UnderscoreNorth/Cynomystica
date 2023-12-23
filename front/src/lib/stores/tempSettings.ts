import { writable } from 'svelte/store';
//Settings that do reset upon refresh
export const tempSettings = writable({
	snow: 0,
	anonymous: false,
	minimize: false,
	audio: false,
	initScroll: true,
	videoVolume: 1,
	hiddenPolls: new Set()
});
