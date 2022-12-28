<script lang="ts">
	import { video } from '$lib/stores/video';
	import RawVideoPlayer from '../videoProviders/raw/RawVideoPlayer.svelte';
	import YoutubePlayer from '$lib/videoProviders/youtube/YoutubePlayer.svelte';
	import { onMount } from 'svelte';
	import type { videoType } from '$lib/stores/video';
	import { userSettings } from '$lib/stores/userSettings';
	let currentVideo: videoType;
	let currentSettings: any;
	userSettings.subscribe((value) => {
		currentSettings = value;
	});
	onMount(() => {
		video.subscribe((value) => {
			currentVideo = value;
		});
	});
</script>

{#if currentVideo?.type == 'raw' && currentVideo.id}
	<RawVideoPlayer {currentSettings} {currentVideo} />
{:else if currentVideo?.type == 'yt' && currentVideo.id}
	<YoutubePlayer {currentSettings} {currentVideo} />
{/if}
