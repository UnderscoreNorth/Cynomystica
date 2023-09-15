import { writable } from 'svelte/store';
const scheduleObj: Schedule = [];
interface ScheduleItem {
	id: string;
	title: string;
	url: string;
	username: string;
	duration: string;
	playTimeUTC: Date;
}
export type Schedule = Array<ScheduleItem>;
export const schedule = writable(scheduleObj);
