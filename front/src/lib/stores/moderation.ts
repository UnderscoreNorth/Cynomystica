import { writable } from 'svelte/store';
export interface ModerationItem {
	action: string;
	byUser: string;
	dateCreated: string;
	username: string;
}
export interface Moderation {
	ignored: Array<ModerationItem>;
	public: Array<ModerationItem>;
}
export const moderation = writable({
	ignored: [],
	public: []
} as Moderation);
