import { writable } from 'svelte/store';
export interface Permissions {
	ignore: number;
	userMod: number;
	queuePlaylist: number;
	queueRaw: number;
	managePlaylist: number;
	manageSchedule: number;
	managePolls: number;
	manageIcons: number;
	manageEmotes: number;
	managePermissions: number;
	manageUsers: number;
	manageSettings: number;
}
const permissionsObj: Permissions = {
	ignore: 10,
	userMod: 10,
	queuePlaylist: 10,
	queueRaw: 10,
	managePlaylist: 10,
	manageSchedule: 10,
	managePolls: 10,
	manageEmotes: 10,
	manageIcons: 10,
	managePermissions: 10,
	manageUsers: 10,
	manageSettings: 10
};
export const permissions = writable(permissionsObj);
