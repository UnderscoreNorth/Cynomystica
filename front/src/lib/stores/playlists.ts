import { writable } from 'svelte/store';
export type playlistItem = {
	id: string;
	title: string;
	url: string;
	username: string;
	duration: number;
	playcount: number;
	dateCreated: string;
};
export type playlistType = {
	id: string;
	name: string;
	description: string;
	owner: string;
	mode: string;
	items: Array<playlistItem>;
	durationLimit: number;
	itemLimit: number;
	allowDuplicates: boolean;
	deleteAfter: number;
	minAccessLevel: number;
};

export const playlists = writable({} as Record<string, playlistType>);
