import { writable } from 'svelte/store';
import { type ScheduleItem } from './schedule';
export const scheduleDebug = writable<
	Array<{
		item: ScheduleItem;
		status: Record<string, string | object>;
	}>
>([]);
