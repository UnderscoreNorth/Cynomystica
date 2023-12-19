import { writable } from 'svelte/store';
export const emotes = writable({} as Record<string,string>);
