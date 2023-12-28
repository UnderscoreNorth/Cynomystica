import { writable } from 'svelte/store';
export const moderation = writable({
	ignored: [],
	muted: [],
	shadowMuted: [],
	banned: [],
	ipbanned: []
});
