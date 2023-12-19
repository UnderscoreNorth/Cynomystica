import { writable } from 'svelte/store';
export interface Poll {
	username: string;
	dateCreate: string;
	duration: number;
	title: string;
	options: Array<string>;
	votes: Record<string, number>;
	dateClose?: string;
}
export const polls = writable({} as Record<string, Poll>);
