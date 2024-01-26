import { writable } from 'svelte/store';
const videoObj: videoType = {
	id: '',
	url: '',
	seekTime: 0,
	type: '',
	duration: 0,
	src: ''
};
export interface videoType {
	id: string;
	url: string;
	seekTime: number;
	type: string;
	duration: number;
	src?: string;
}
export const video = writable(videoObj);
export const leader = writable('');
