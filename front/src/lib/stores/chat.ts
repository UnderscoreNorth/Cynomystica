import { writable } from 'svelte/store';
import { browser } from '$app/environment';
const chatObj: Array<object> = [];
export const chat = writable(chatObj);
export const chatInput = writable('');
const initEl = browser ? (document.createElement('input') as HTMLInputElement) : undefined;
export const chatEl = writable(initEl);
