import { writable } from 'svelte/store';
export const placeholderText = {
	userCountText: '|n| connected user|s|',
	maxTotalQueueLength: 'Minutes, 0 for unlimited'
};
export const numberTypes = ['maxTotalQueueLength', 'maxImageHeight', 'maxEmoteHeight'];
export const settings = writable({
	joinMessage: '',
	chatBG: '',
	videoBG: '',
	tabName: '',
	tabIcon: '',
	userCountText: '',
	maxTotalQueueLength: 0,
	maxImageHeight: 100,
	maxEmoteHeight: 50
} as Record<string, string | number>);
