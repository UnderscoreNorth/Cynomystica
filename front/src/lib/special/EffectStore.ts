import { writable } from 'svelte/store';

export const effectStore = writable<
	Record<
		string,
		{
			command: string;
			is_on: boolean;
			arg_1: string;
			arg_2: string;
		}
	>
>({
	Presents: {
		command: '/presents',
		is_on: false,
		arg_1: '',
		arg_2: ''
	},
	Snow: {
		command: '/snow',
		is_on: false,
		arg_1: 'medium',
		arg_2: ''
	},
	Wonderland: {
		command: '/wonderland',
		is_on: false,
		arg_1: '',
		arg_2: ''
	}
});
