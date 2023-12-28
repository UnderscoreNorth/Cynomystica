import { writable } from 'svelte/store';
export const presets = writable({ icons: {}, emotes: {} } as Record<
	string,
	Record<string, boolean>
>);
