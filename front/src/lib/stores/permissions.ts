import { writable } from 'svelte/store';
export interface Permissions {
	userMod: number;
	queueNext: number;
	queueLast: number;
	queueRaw: number;
	queueLive: number;
	manageQueue: number;
	manageSchedule: number;
	managePolls: number;
	manageIcons: number;
	manageEmotes: number;
	managePermissions: number;
	manageUsers: number;
	manageSettings: number;
	manageInfoModal: number;
	chat: number;
	bypassQueueLimit: number;
	postMedia: number;
	clearChat: number;
	leader: number;
	createPlaylists: number;
	viewUsers: number;
}
export const permissionGrouping = {
	userMod: 'Moderation',
	queueNext: 'Queue/Playlists',
	queueLast: 'Queue/Playlists',
	queueRaw: 'Queue/Playlists',
	queueLive: 'Queue/Playlists',
	manageQueue: 'Queue/Playlists',
	manageSchedule: 'Queue/Playlists',
	managePolls: 'General',
	manageEmotes: 'General',
	manageIcons: 'General',
	managePermissions: 'General',
	manageUsers: 'General',
	manageSettings: 'General',
	manageInfoModal: 'General',
	chat: 'Chat',
	bypassQueueLimit: 'Queue/Playlists',
	postMedia: 'Chat',
	clearChat: 'Moderation',
	leader: 'Queue/Playlists',
	createPlaylists: 'Queue/Playlists',
	viewUsers: 'Chat'
};
const permissionsObj: Permissions = {
	chat: 10,
	postMedia: 10,
	userMod: 10,
	queueNext: 10,
	queueLast: 10,
	queueRaw: 10,
	queueLive: 10,
	manageQueue: 10,
	manageSchedule: 10,
	managePolls: 10,
	manageEmotes: 10,
	manageIcons: 10,
	managePermissions: 10,
	manageUsers: 10,
	manageSettings: 10,
	bypassQueueLimit: 10,
	createPlaylists: 10,
	manageInfoModal: 10,
	clearChat: 10,
	leader: 10,
	viewUsers: 10
};
export const permissions = writable(permissionsObj);
