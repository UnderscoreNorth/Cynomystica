import { writable } from 'svelte/store';
const videoObj: videoType = {
	id: '',
	url: '',
	seekTime: 0,
	type: '',
	duration: 0
};
export interface videoType {
	id: string;
	url: string;
	seekTime: number;
	type: string;
	duration: number;
}
export const video = writable(videoObj);
