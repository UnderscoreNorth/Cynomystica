import { writable } from 'svelte/store';
const playlistObj: playlistType = [];
interface playlistItem {
	id: string;
	name: string;
	url: string;
	username: string;
	duration: string;
}
export type playlistType = Array<playlistItem>;
export const playlist = writable(playlistObj);
