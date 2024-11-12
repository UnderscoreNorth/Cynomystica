import { writable } from 'svelte/store';
import type { Moment } from 'moment';
const scheduleObj: Schedule = [];
export interface ScheduleItem {
	conflict?: boolean;
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
	startingSplit?: number;
	endingSplit?: number;
	diff?: number;
}
export type Schedule = Array<ScheduleItem>;
export const schedule = writable(scheduleObj);
