import { writable } from 'svelte/store';
import { browser } from '$app/environment';
export interface messageType {
	icon: string;
	message: string;
	played: boolean;
	time: string;
	username: string;
	type?: string;
}
const chatObj: Array<messageType> = [];
export const chat = writable(chatObj);
export const chatInput = writable('');
const initEl = browser ? (document.createElement('input') as HTMLInputElement) : undefined;
export const chatEl = writable(initEl);
