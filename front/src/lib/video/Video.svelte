<script lang="ts">
	import { video } from '$lib/stores/video';
	import RawVideoPlayer from '../videoProviders/raw/RawVideoPlayer.svelte';
	import YoutubePlayer from '$lib/videoProviders/youtube/YoutubePlayer.svelte';
	import TwitchPlayer from '$lib/videoProviders/twitch/TwitchPlayer.svelte';
	import IFrame from '$lib/videoProviders/iframe/IFrame.svelte';
</script>
{#key $video.id}
	{#if $video?.type == 'raw' && $video.id !== ''}
		<RawVideoPlayer />
	{:else if ($video?.type == 'yt' || $video?.type == 'ytlive') && $video.id !== ''}
		<YoutubePlayer />
	{:else if ($video?.type == 'tw_live')}
		<TwitchPlayer type={'live'} />
	{:else if ($video?.type == 'iframe')}
		<IFrame />
	{/if}
{/key}

