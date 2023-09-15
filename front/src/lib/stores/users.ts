import { writable } from 'svelte/store';
const usersObj: usersType = {
	connectedUsers: 0,
	users: []
};
export interface usersType {
	connectedUsers: number;
	users: Array<object>;
}
export const users = writable(usersObj);
