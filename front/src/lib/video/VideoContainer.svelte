<script lang="ts">
	import { userSettings } from '$lib/stores/userSettings';
	import Video from './Video.svelte';
	import { browser } from '$app/environment';
	import { chat } from '$lib/stores/chat';
	import { settings } from '$lib/stores/settings';
	let chatMessageElem: HTMLElement | null;
	let videoHeight:number;
	let bulletHeight = 40;
	if (browser) chatMessageElem = document.getElementById('cVideo');
	chat.subscribe((value) => {
		for (let message of value) {
			if (!message.played) {
				message.played = true;
				if ($userSettings.display.danmaku !== 'none') {
					let bulletMessage = document.createElement('div');
					bulletMessage.classList.add('bulletText');
					if ($userSettings.display.danmaku == 'half') bulletMessage.classList.add('transparent');
					let bulletText = message.message;
					if (message.message.indexOf('/me ') == 0) {
						bulletMessage.classList.add('actiontext');
						bulletText = message.username + ' ' + message.message.substring(4);
					}
					bulletMessage.innerHTML = bulletText;
					chatMessageElem?.appendChild(bulletMessage);
					bulletMessage.style.top = `${bulletHeight}px`;
					bulletHeight += 20;
					if (bulletHeight > videoHeight - 80) {
						bulletHeight = 40;
					}
					setTimeout(() => {
						bulletMessage.remove();
					}, 10000);
				}
			}
		}
	});
</script>

<div 
	id="videoContainer" style="width:100%" 
	bind:clientHeight={videoHeight} 	
	style:background-image={$settings.videoBG ? `url(${$settings.videoBG})` : ''}
><Video /></div>

<style>
	#videoContainer {
		background: black;
		background-position: center;
		background-size: cover;
		height: 100%;
		vertical-align: top;
		float: left;
		position: relative;
	}

	:global(.bulletText) {
		animation: textScrollAnim 30s linear 1;
		animation-fill-mode: forwards;
		font-size: 2rem;
		font-weight: bold;
		position: absolute;
		z-index: 0;
		color: white;
		text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black;
		height: 2rem;
		width: 100%;
		text-align: left;
		white-space: nowrap;
	}
	:global(.bulletText img){
		max-height:50svh;
	}
	@keyframes textScrollAnim {
		0% {
			transform: translateX(100%);
		}
		99% {
			transform: translateX(-500%);
		}
		100% {
			transform: translateX(-500%);
			display: none !important;
		}
	}
	@media (orientation: portrait) {
		:global(.bulletText) {
			animation-duration: 10s;
			font-size: 1.5rem;
		}
	}
</style>
