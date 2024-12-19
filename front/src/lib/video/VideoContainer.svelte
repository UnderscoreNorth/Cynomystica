<script lang="ts">
	import { userSettings } from '$lib/stores/userSettings';
	import Video from './Video.svelte';
	import { browser } from '$app/environment';
	import { chat } from '$lib/stores/chat';
	import { settings } from '$lib/stores/settings';
	import { permissions } from '$lib/stores/permissions';
	import { video } from '$lib/stores/video';
	import { leader } from '$lib/stores/video';
	import { user } from '$lib/stores/user';
	import { io } from '$lib/realtime';
	import MdStar from 'svelte-icons/md/MdStar.svelte';
	import MdStarBorder from 'svelte-icons/md/MdStarBorder.svelte';
	import MdRefresh from 'svelte-icons/md/MdRefresh.svelte';
	import Tooltip from '$lib/ui/tooltip.svelte';
	import { onMount } from 'svelte';
	let chatMessageElem: HTMLElement | null;
	let videoHeight: number;
	let bulletHeight = 40;
	let reset = 0;
	let cursorTime = 0;
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
					if (bulletHeight > videoHeight - 200) {
						bulletHeight = 40;
					}
					setTimeout(() => {
						bulletMessage.remove();
					}, 10000);
				}
			}
		}
	});
	function resetCursor() {
		cursorTime = 3;
	}
	onMount(() => {
		setInterval(() => {
			cursorTime--;
			if (cursorTime <= 0) {
				cursorTime = 0;
			}
		}, 1000);
	});
	const changeLeader = () => {
		if ($user.accessLevel >= $permissions.leader) {
			io.emit('set-leader');
		}
	};
	const changeSrc = (url: string) => {
		$video.src = url;
	};
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
	id="videoContainer"
	style="width:100%"
	bind:clientHeight={videoHeight}
	on:mousemove={() => resetCursor()}
	style:cursor={cursorTime > 1 ? 'auto' : 'none'}
	style:background-image={$settings.videoBG ? `url(${$settings.videoBG})` : ''}
>
	{#key reset}<Video />{/key}
	{#if $video.id}
		<div
			id="videoControls"
			style={($userSettings.display.chat == 'left' ? 'right' : 'left') + ':4rem;'}
			style:display={cursorTime > 1 ? 'block' : 'none'}
		>
			{#if $video.type == 'raw'}
				{#if $video.url.split('????').length > 1}
					{#each $video.url.split('????') as url, index}
						<Tooltip title={$video.url.split('????')[index]}>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div class="svgIcon" on:click={() => changeSrc($video.url.split('????')[index])}>
								{index + 1}
							</div>
						</Tooltip>
					{/each}
				{/if}
			{/if}
			<Tooltip title="Reset video player">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div id="refreshIcon" class="svgIcon" on:click={() => reset++}>
					<MdRefresh />
				</div>
			</Tooltip>

			<Tooltip title={$leader ? `Leader: ${$leader}` : 'No Leader'}>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="svgIcon"
					on:click={changeLeader}
					style:cursor={$user.accessLevel >= $permissions.leader ? '' : 'default'}
				>
					{#if $leader !== ''}
						<MdStar />
					{:else}
						<MdStarBorder />
					{/if}
				</div>
			</Tooltip>
		</div>
	{/if}
</div>

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
	#videoControls {
		position: absolute;
		top: 4rem;
		opacity: 0;
		display: flex;
		flex-direction: column;
	}
	.svgIcon {
		background: var(--color-bg-3);
		border-radius: 5px;
		vertical-align: middle;
		line-height: 1.5rem;
		text-align: center;
	}
	:global(*:has(#refreshIcon):hover > #videoControls) {
		opacity: 0.75;
	}
	:global(.bulletText) {
		animation: textScrollAnim 30s linear 1;
		animation-fill-mode: forwards;
		font-size: 2rem;
		font-weight: bold;
		position: absolute;
		z-index: 0;
		color: white;
		text-shadow:
			-1px -1px 0 black,
			1px -1px 0 black,
			-1px 1px 0 black,
			1px 1px 0 black;
		height: 2rem;
		width: 100%;
		text-align: left;
		white-space: nowrap;
		pointer-events: none;
	}
	:global(.bulletText img, .bulletText video) {
		max-height: 50svh;
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
