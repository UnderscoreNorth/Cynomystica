<script lang="ts">
	import { video } from '$lib/stores/video';
	import { userSettings } from '$lib/stores/userSettings';
	import { tempSettings } from '$lib/stores/tempSettings';
	import Tooltip from '$lib/ui/tooltip.svelte';
	//@ts-ignore
	import MdRefresh from 'svelte-icons/md/MdRefresh.svelte'
	let el:HTMLVideoElement;
	let reset = 0;
	const initSyncTime = (e: any) => {
		syncTime(e.target);
		setInterval(function () {
			syncTime(e.target);
		}, $userSettings.sync.threshold);
	};
	const syncTime = (e: any) => {
		console.log('Sync r');
		console.log(el);
		let clientTime = e.currentTime;
		let serverTime = $video.seekTime;
		if (Math.abs(clientTime - serverTime) > $userSettings.sync.threshold / 1000 && el.paused == false) {
			e.currentTime = serverTime;
		}
	};
	
	const seekLeader = (e: Event) => {};
</script>
{#key reset}
<Tooltip title='Reset video player'>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id='refreshIcon' class='svgIcon' on:click={()=>reset++}><MdRefresh /></div>
</Tooltip>
<!-- svelte-ignore a11y-media-has-caption -->
<video
	src={`${$video.url}`}
	bind:volume={$tempSettings.videoVolume}
	bind:this={el}
	on:loadedmetadata={initSyncTime}
	on:seeked={seekLeader}
	autoplay
	controls
/>
{/key}

<style>
	#refreshIcon{
		position:absolute;
		top:0.5rem;
		right:0.5rem;
		z-index: 1;
		opacity: 0;
		background:var(--color-bg-3);
		border-radius: 5px;
	}
	:global(*:has(#refreshIcon):hover > div > #refreshIcon){
		opacity: 0.75;
	}
	video {
		height: 100%;
		width: 100%;
	}
</style>
