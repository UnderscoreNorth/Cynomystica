import { writable } from 'svelte/store';
export interface Emote {
	text: string;
	url: string;
	preset: string;
}
export const emotes = writable({} as Record<string, Emote>);
