import { writable } from 'svelte/store';
const scheduleObj: Schedule = [];
export interface ScheduleItem {
	id: string;
	title: string;
	url: string;
	username: string;
	duration: string;
	playTimeUTC: Date;
	finishTimeUTC: Date;
	gridArea?: string;
	minutes: number;
	selection: string;
	playlist: string;
}
export type Schedule = Array<ScheduleItem>;
export const schedule = writable(scheduleObj);
