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
	uuid: string;
}
export const user = writable({
	username: '',
	accessLevel: -1,
	icon: '',
	accessToken: undefined,
	refreshToken: undefined
} as userType);
