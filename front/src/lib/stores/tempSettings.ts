import { writable } from 'svelte/store';
//Settings that do reset upon refresh
export const tempSettings = writable({
	snow: 0,
	anonymous: false,
	minimize: {
		toggle: false,
		opacity: 50
	},
	audio: false,
	scrollLock: true,
	videoVolume: 1,
	hiddenPolls: new Set(),
	scheduleView: 'calendar'
});
