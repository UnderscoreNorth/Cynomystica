<script lang="ts">
	export let currentVideo: any;
	export let currentSettings: any;
	const initSyncTime = (e: any) => {
		syncTime(e.target);
		setInterval(function () {
			syncTime(e.target);
		}, currentSettings.sync.threshold);
	};
	const syncTime = (e: any) => {
		let clientTime = e.currentTime;
		let serverTime = currentVideo.seekTime;
		if (Math.abs(clientTime - serverTime) > currentSettings.sync.threshold / 1000) {
			e.currentTime = serverTime;
		}
	};
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video src={`${currentVideo.url}`} on:loadedmetadata={initSyncTime} autoplay controls />

<style>
	video {
		height: 100%;
		width: 100%;
	}
</style>
