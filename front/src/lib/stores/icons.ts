import { writable } from 'svelte/store';
const iconsObj: iconList = {};
export interface Icon {
	display: string;
	color: string;
	url: string;
	preset: string;
}
export type iconList = Record<string, Icon>;
export const icons = writable(iconsObj);
