<script lang="ts">
	import { video } from '$lib/stores/video';
	import { userSettings } from '$lib/stores/userSettings';
	import { io } from '$lib/realtime';
	import { leader } from '$lib/stores/video';
	import { user } from '$lib/stores/user';
	let el: HTMLVideoElement;
	const syncTime = () => {
		let clientTime = el.currentTime;
		let serverTime = $video.seekTime;
		const isLeader = $user.username == $leader && $leader !== '';
		if (
			Math.abs(clientTime - serverTime) > $userSettings.sync.threshold / 1000 &&
			el.paused == false &&
			$video.duration > 0 &&
			!isLeader &&
			!io.disconnected
		) {
			el.currentTime = serverTime;
		}
		if (isLeader) {
			io.emit('leader-sync', el.currentTime);
		}
		if (el) {
			setTimeout(
				() => {
					syncTime();
				},
				isLeader ? 1000 : $userSettings.sync.threshold
			);
		}
	};
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video
	bind:volume={$userSettings.videoVolume}
	bind:muted={$userSettings.muted}
	bind:this={el}
	on:loadedmetadata={syncTime}
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
