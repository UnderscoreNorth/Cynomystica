<script lang="ts">
	import { video } from '$lib/stores/video';
	import { userSettings } from '$lib/stores/userSettings';
	import youTubePlayer from 'youtube-player';
	import { onDestroy, onMount } from 'svelte';
	import type { YouTubePlayer } from 'youtube-player/dist/types';
	import { user } from '$lib/stores/user';
	import { io } from '$lib/realtime';
	import { leader } from '$lib/stores/video';
	let player: YouTubePlayer | null;
	const debounceDuration = 100;
	let debounced = false;
	let lastSeek = 0;
	let videoURL = '';
	onMount(() => {
		player = youTubePlayer('player', {
			videoId: $video.url
		});
		player
			// Play video is a Promise.
			// 'playVideo' is queued and will execute as soon as player is ready.
			.playVideo()
			.then(function () {
				const syncTime = async () => {
					let clientTime = await player.getCurrentTime();
					let serverTime = $video.seekTime;
					const isLeader = ($user.username == $leader && $leader !== '');
					if 
						(Math.abs(clientTime - serverTime) > $userSettings.sync.threshold / 1000 
						&& $video.type == 'yt'
						&& !isLeader
						) {
						player.seekTo(serverTime, true);
					}
					if (isLeader){			
						io.emit('leader-sync',clientTime);
					}
					if(player){
						setTimeout(()=>{
							syncTime();
						}, isLeader ? 1000 : $userSettings.sync.threshold)
					}
				};
				syncTime();
				player.on('stateChange', async (e) => {
					if (!debounced && $user.accessLevel > -1) {
						debounced = true;
						let currentSeek = await player.getCurrentTime();
						if (Math.abs(currentSeek - lastSeek) > 1000) {
							io.emit('leaderSeek', currentSeek);
							lastSeek = currentSeek;
						}
						setTimeout(() => {
							debounced = false;
						}, debounceDuration);
					}
				});
			});
		video.subscribe((newVideo) => {
			if (newVideo.url !== videoURL && newVideo.type == 'yt' && player) {
				player.loadVideoById(newVideo.url);
				videoURL = newVideo.url;
			}
		});
	});
	onDestroy(() => {
		player = null;
		let playerEl = document.getElementById('player');
		while (playerEl?.firstChild) {
			playerEl.removeChild(playerEl.firstChild);
		}
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
