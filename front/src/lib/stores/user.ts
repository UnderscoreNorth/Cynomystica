import { writable } from 'svelte/store';
export interface Token {
	token: string;
	username: string;
	expires: string;
}
export interface userType {
	username: string;
	accessLevel: number;
	icon: string;
	accessToken: Token | undefined;
	refreshToken: Token | undefined;
}
const userObj: userType = {
	username: '',
	accessLevel: -1,
	icon: '',
	accessToken: undefined,
	refreshToken: undefined
};
export const user = writable(userObj);
