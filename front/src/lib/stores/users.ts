import { writable } from 'svelte/store';
export interface otherUser {
	username: string;
	ignored: boolean;
	accessLevel: number;
	muted: boolean;
	banned: boolean;
}
const usersObj: usersType = {
	connectedUsers: 0,
	users: []
};
export interface usersType {
	connectedUsers: number;
	users: Array<otherUser>;
}
export const users = writable(usersObj);
