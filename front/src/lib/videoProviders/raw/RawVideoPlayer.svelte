<script lang="ts">
	import { video } from '$lib/stores/video';
	import { userSettings } from '$lib/stores/userSettings';
	import { io } from '$lib/realtime';
	import { leader } from '$lib/stores/video';
	import { user } from '$lib/stores/user';
	import { onDestroy } from 'svelte';
	let el:HTMLVideoElement;
	let syncInterval:ReturnType<typeof setInterval>;
	const initSyncTime = (e: any) => {
		syncTime(e.target);
		syncInterval = setInterval(function () {
			syncTime(e.target);
		}, $userSettings.sync.threshold);
	};
	const syncTime = (e: any) => {
		let clientTime = e.currentTime;
		let serverTime = $video.seekTime;
		if (
			Math.abs(clientTime - serverTime) > $userSettings.sync.threshold / 1000
			&& el.paused == false 
			&& $video.duration > 0
			&& !($user.username == $leader  && $leader !== '')) {
			e.currentTime = serverTime;
		}
		if ($user.username == $leader && $leader !== ''){			
			io.emit('leader-sync',e.currentTime);
		}
	};
	onDestroy(()=>{
		clearInterval(syncInterval)
	})
</script>
<!-- svelte-ignore a11y-media-has-caption -->
<video
	bind:volume={$userSettings.videoVolume}
	bind:muted={$userSettings.muted}
	bind:this={el}
	on:loadedmetadata={initSyncTime}
	preload="auto"
	data-setup={`{}`}
	autoplay
	controls
	src={$video.src}
>
</video>

<style>
	video {
		height: 100%;
		width: 100%;
	}
</style>
