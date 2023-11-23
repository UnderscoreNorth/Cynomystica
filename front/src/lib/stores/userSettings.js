import { writable } from 'svelte/store';

export const userSettings = writable({
	sync: { threshold: 2500 },
	users: []
});
