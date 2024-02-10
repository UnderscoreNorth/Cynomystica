import { writable } from 'svelte/store';
import type { Moment } from 'moment';
const scheduleObj: Schedule = [];
export interface ScheduleItem {
	id: string;
	title: string;
	url: string;
	username: string;
	duration: number;
	playTimeUTC: Moment;
	finishTimeUTC: Moment;
	gridArea?: string;
	minutes: number;
	selection: string;
	playlist: string;
	visible: boolean;
}
export type Schedule = Array<ScheduleItem>;
export const schedule = writable(scheduleObj);
