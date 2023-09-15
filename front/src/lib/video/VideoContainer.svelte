<script lang="ts">
	import { userSettings } from '$lib/stores/userSettings';
	import Video from './Video.svelte';
	const getVideoCSS = () => {
		let returnValue = '';
		if (['Chatbar-left', 'Chatbar-right'].includes($userSettings.chat.display)) {
			returnValue = $userSettings.video.width;
		} else {
			returnValue = '100vw';
		}
		return returnValue;
	};
</script>

<div id="videoContainer" style:width={getVideoCSS()}><Video /></div>

<style>
	#videoContainer {
		background: black;
		aspect-ratio: 16/9;
		display: inline-block;
		vertical-align: top;
	}
</style>
