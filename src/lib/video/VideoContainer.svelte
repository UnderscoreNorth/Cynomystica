<script lang="ts">
	import { userSettings } from '$lib/stores/userSettings';
	import Video from './Video.svelte';
	let settingsJson: any;
	userSettings.subscribe((value) => {
		settingsJson = value;
	});
	const getVideoCSS = (settingsJson: any) => {
		let returnValue = '';
		if (['Chatbar-left', 'Chatbar-right'].includes(settingsJson.chat.display)) {
			returnValue = settingsJson.video.width;
		} else {
			returnValue = '100vw';
		}
		return returnValue;
	};
</script>

<div id="videoContainer" style:width={getVideoCSS(settingsJson)}><Video /></div>

<style>
	#videoContainer {
		background: black;
		aspect-ratio: 16/9;
		display: inline-block;
		vertical-align: top;
	}
</style>
