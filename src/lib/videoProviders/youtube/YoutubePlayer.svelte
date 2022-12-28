<script lang="ts">
	export let currentVideo: any;
	export let currentSettings: any;
	import YouTubePlayer from 'youtube-player';
	import { onMount } from 'svelte';
	let player;

	onMount(() => {
		player = YouTubePlayer('player', {
			videoId: currentVideo.url
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
			}, currentSettings.sync.threshold);
		};

		const syncTime = async () => {
			let clientTime = await player.getCurrentTime();
			let serverTime = currentVideo.seekTime;
			if (Math.abs(clientTime - serverTime) > currentSettings.sync.threshold / 1000) {
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
