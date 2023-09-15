<script lang="ts">
	import { video } from '$lib/stores/video';
	import { userSettings } from '$lib/stores/userSettings';
	import YouTubePlayer from 'youtube-player';
	import { onMount } from 'svelte';
	let player: YoutubePlayer;
	onMount(() => {
		player = YouTubePlayer('player', {
			videoId: $video.url
		});
		player
			// Play video is a Promise.
			// 'playVideo' is queued and will execute as soon as player is ready.
			.playVideo()
			.then(function () {
				initSyncTime();
			});
		const initSyncTime = () => {
			syncTime();
			setInterval(function () {
				syncTime();
			}, $userSettings.sync.threshold);
		};

		const syncTime = async () => {
			let clientTime = await player.getCurrentTime();
			let serverTime = $video.seekTime;
			if (Math.abs(clientTime - serverTime) > $userSettings.sync.threshold / 1000) {
				console.log('Syncing');
				player.seekTo(serverTime);
			}
		};
	});
</script>

<div>
	<div id="player" />
</div>

<style>
	div,
	#player {
		height: 100%;
		width: 100%;
	}
</style>
