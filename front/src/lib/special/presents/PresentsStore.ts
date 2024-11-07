import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const presentsStore = writable<{
	command: string;
	label: string;
	padoru_img: string;
	present_img: string;
	presents_url: string;
	presents_duration_s: number;
	present_animations: string[];
	spawn_rate: number;
	spawn_limit: number;
	img_bank: string[];
	state: {
		curr_img: number;
		curr_cache_img: number;
		max_img: number;
		is_on: boolean;
		enabled: boolean;
		timeout: null | NodeJS.Timeout;
	};
	container: HTMLDivElement | undefined;
}>({
	command: '/presents',
	padoru_img: 'https://isthisliv.com/icons/cups/91.png',
	present_img: 'https://isthisliv.com/icons/cups/88.png',
	presents_url: 'https://yue.toradora-xmas-stream.com/present_pic_urls.js',
	presents_duration_s: 30,
	present_animations: ['type1', 'type2', 'type3', 'type4', 'type5', 'type6'],
	spawn_rate: 500,
	spawn_limit: 6,
	img_bank: [
		'https://isthisliv.com/icons/cups/1.png',
		'https://isthisliv.com/icons/cups/85.png',
		'https://isthisliv.com/icons/cups/84.png'
	],
	label: 'None',
	state: {
		is_on: false,
		enabled: true,
		timeout: null,
		curr_img: 0,
		curr_cache_img: 0,
		max_img: 0
	},
	container: browser ? document.createElement('div') : undefined
});
