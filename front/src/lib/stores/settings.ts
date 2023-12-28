import { writable } from 'svelte/store';
export const placeholderText = {
	userCountText: '|n| connected user|s|'
};
export const settings = writable({
	joinMessage: '',
	chatBG: '',
	videoBG: '',
	tabName: '',
	tabIcon: '',
	userCountText: ''
} as Record<string, string>);
