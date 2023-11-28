import { writable } from 'svelte/store';
export interface Permissions {
	ignore: number;
	userMod: number;
	queuePlaylist: number;
	managePlaylist: number;
	schedule: number;
}
const permissionsObj: Permissions = {
	ignore: 10,
	userMod: 10,
	queuePlaylist: 10,
	managePlaylist: 10,
	schedule: 10
};
export const permissions = writable(permissionsObj);
