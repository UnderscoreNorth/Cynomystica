import { writable } from 'svelte/store';
const videoObj: videoType = {
	id: '',
	url: '',
	seekTime: 0,
	type: ''
};
export interface videoType {
	id: string;
	url: string;
	seekTime: number;
	type: string;
}
export const video = writable(videoObj);
