<script lang="ts">
	import { video } from '$lib/stores/video';
	import { userSettings } from '$lib/stores/userSettings';
	const initSyncTime = (e: any) => {
		syncTime(e.target);
		setInterval(function () {
			syncTime(e.target);
		}, $userSettings.sync.threshold);
	};
	const syncTime = (e: any) => {
		let clientTime = e.currentTime;
		let serverTime = $video.seekTime;
		if (Math.abs(clientTime - serverTime) > $userSettings.sync.threshold / 1000) {
			console.log('Syncing');
			e.currentTime = serverTime;
		}
	};
	const seekLeader = (e: Event) => {
		console.log(e);
	};
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
	src={`${$video.url}`}
	on:loadedmetadata={initSyncTime}
	on:seeked={seekLeader}
	autoplay
	controls
/>

<style>
	video {
		height: 100%;
		width: 100%;
	}
</style>
