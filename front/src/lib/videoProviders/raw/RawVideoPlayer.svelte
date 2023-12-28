<script lang="ts">
	import { video } from '$lib/stores/video';
	import { userSettings } from '$lib/stores/userSettings';
	import { tempSettings } from '$lib/stores/tempSettings';
	import Tooltip from '$lib/ui/tooltip.svelte';
	//@ts-ignore
	import MdRefresh from 'svelte-icons/md/MdRefresh.svelte'
	let el:HTMLVideoElement;
	let reset = 0;
	let originalSrc = '';
	let src = '';
	video.subscribe((e)=>{
		if(e.url !== originalSrc){
			originalSrc = e.url;
			src = e.url;
		}
	})
	const initSyncTime = (e: any) => {
		syncTime(e.target);
		setInterval(function () {
			syncTime(e.target);
		}, $userSettings.sync.threshold);
	};
	const syncTime = (e: any) => {
		let clientTime = e.currentTime;
		let serverTime = $video.seekTime;
		if (Math.abs(clientTime - serverTime) > $userSettings.sync.threshold / 1000 && el.paused == false) {
			e.currentTime = serverTime;
		}
	};
	const changeSrc = (url:string)=>{
		src = url;
	}
	const seekLeader = (e: Event) => {};
</script>
{#key reset}
<div id='videoControlBar'>
	{#if $video.url.split('???streamurl???').length > 1}
		{#each $video.url.split('???streamurl???') as url,index}
			<Tooltip title='Select server {index+1}'>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class='svgIcon' on:click={()=>changeSrc(url)}>{index+1}</div>
			</Tooltip>		
		{/each}
	{/if}
	<Tooltip title='Reset video player'>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id='refreshIcon' class='svgIcon' on:click={()=>reset++}><MdRefresh /></div>
	</Tooltip>
</div>
<!-- svelte-ignore a11y-media-has-caption -->
<video
	bind:volume={$tempSettings.videoVolume}
	bind:this={el}
	on:loadedmetadata={initSyncTime}
	on:seeked={seekLeader}
	preload="auto"
	data-setup={`{}`}
	autoplay
	controls
	src={src}
>
</video>
{/key}

<style>
	#videoControlBar{
		position:absolute;
		top:0.5rem;
		right:0.5rem;
		z-index: 1;
		opacity: 0;
		display:flex;
	}
	.svgIcon{
		background:var(--color-bg-3);
		border-radius: 5px;
		vertical-align: middle;
		line-height: 1.5rem;
		text-align: center;
	}
	:global(*:has(#refreshIcon):hover > #videoControlBar){
		opacity: 0.75;
	}
	video {
		height: 100%;
		width: 100%;
	}
</style>
