import { writable } from 'svelte/store';
export const placeholderText = {
	userCountText: '|n| connected user|s|',
	maxTotalQueueLength: 'Minutes, 0 for unlimited'
};
export const numberTypes = ['maxTotalQueueLength'];
export const settings = writable({
	joinMessage: '',
	chatBG: '',
	videoBG: '',
	tabName: '',
	tabIcon: '',
	userCountText: '',
	maxTotalQueueLength: 0
} as Record<string, string | number>);
