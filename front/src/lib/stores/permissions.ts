import { writable } from 'svelte/store';
export interface Permissions {
	userMod: number;
	queueNext: number;
	queueLast: number;
	queueRaw: number;
	managePlaylist: number;
	manageSchedule: number;
	managePolls: number;
	manageIcons: number;
	manageEmotes: number;
	managePermissions: number;
	manageUsers: number;
	manageSettings: number;
	chat: number;
	bypassQueueLimit: number;
	postImage: number;
}
export const permissionGrouping = {
	userMod: 'Moderation',
	queueNext: 'Playlist',
	queueLast: 'Playlist',
	queueRaw: 'Playlist',
	managePlaylist: 'Playlist',
	manageSchedule: 'Playlist',
	managePolls: 'General',
	manageEmotes: 'General',
	manageIcons: 'General',
	managePermissions: 'General',
	manageUsers: 'General',
	manageSettings: 'General',
	chat: 'Chat',
	bypassQueueLimit: 'Playlist',
	postImage: 'Chat'
};
const permissionsObj: Permissions = {
	userMod: 10,
	queueNext: 10,
	queueLast: 10,
	queueRaw: 10,
	managePlaylist: 10,
	manageSchedule: 10,
	managePolls: 10,
	manageEmotes: 10,
	manageIcons: 10,
	managePermissions: 10,
	manageUsers: 10,
	manageSettings: 10,
	chat: 10,
	bypassQueueLimit: 10,
	postImage: 10
};
export const permissions = writable(permissionsObj);
