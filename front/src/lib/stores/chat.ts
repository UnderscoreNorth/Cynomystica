import { writable } from 'svelte/store';
const chatObj: Array<object> = [];
export const chat = writable(chatObj);
