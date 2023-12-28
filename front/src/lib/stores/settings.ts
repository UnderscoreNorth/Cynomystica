import { writable } from 'svelte/store';

export const settings = writable({
	joinMessage: '',
	chatBG: '',
	videoBG: '',
	tabName: '',
	tabIcon: ''
} as Record<string, string>);
