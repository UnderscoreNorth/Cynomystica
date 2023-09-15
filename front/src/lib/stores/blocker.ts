import { writable } from 'svelte/store';
export interface blockerType {
	login: boolean;
}
const blockerObj: blockerType = {
	login: false
};
export const blocker = writable(blockerObj);
