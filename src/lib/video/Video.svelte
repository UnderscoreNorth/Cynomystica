<script lang="ts">
	import { video } from '$lib/stores/video';
	import RawVideoPlayer from '../videoProviders/raw/RawVideoPlayer.svelte';
	import YoutubePlayer from '$lib/videoProviders/youtube/YoutubePlayer.svelte';
</script>

{#if $video?.type == 'raw' && $video.id}
	<RawVideoPlayer />
{:else if $video?.type == 'yt' && $video.id}
	<YoutubePlayer />
{/if}
