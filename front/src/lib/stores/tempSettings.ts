import { writable } from 'svelte/store';

export const tempSettings = writable({
	snow: 0,
	anonymous: false,
	minimize: false,
	audio: false
});
