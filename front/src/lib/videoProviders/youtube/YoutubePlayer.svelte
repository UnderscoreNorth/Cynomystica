<script lang="ts">
	import { video } from '$lib/stores/video';
	import { userSettings } from '$lib/stores/userSettings';
	import youTubePlayer from 'youtube-player';
	import { onMount } from 'svelte';
	import type { YouTubePlayer } from 'youtube-player/dist/types';
	import {user} from '$lib/stores/user';
	import { io } from '$lib/realtime';
	let player: YouTubePlayer;
	const debounceDuration = 100;
	let debounced = false;
	let lastSeek = 0;
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
					if (Math.abs(clientTime - serverTime) > $userSettings.sync.threshold / 1000) {
						console.log('Syncing');
						player.seekTo(serverTime,true);
					}
				};
				const initSyncTime = () => {
					syncTime();
					setInterval(function () {
						syncTime();
					}, $userSettings.sync.threshold);
				};
				initSyncTime();
				player.on('stateChange',(async(e)=>{
					console.log(e);
					if(!debounced && $user.accessLevel > -1){
						debounced = true;
						let currentSeek = await player.getCurrentTime();
						if(Math.abs(currentSeek - lastSeek) > 1000){
							io.emit('leaderSeek',currentSeek);
							lastSeek = currentSeek;
						}
					setTimeout(()=>{debounced = false},debounceDuration);
					}
				}))
			});
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
