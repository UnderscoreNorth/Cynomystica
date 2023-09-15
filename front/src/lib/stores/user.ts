import { writable } from 'svelte/store';
export interface userType {
	username: string;
	accessLevel: number;
	icon: string;
	accessToken: string;
	refreshToken: string;
}
const userObj: userType = {
	username: '',
	accessLevel: -1,
	icon: '',
	accessToken: '',
	refreshToken: ''
};
export const user = writable(userObj);
