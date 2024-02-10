import { writable } from 'svelte/store';
interface queueItem {
	id: string;
	name: string;
	url: string;
	username: string;
	duration: string;
	permanent: boolean;
}
export type queueType = Array<queueItem>;
export const queue = writable([] as queueType);
