<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import ChatContainer from '$lib/chat/ChatContainer.svelte';
	import VideoContainer from '$lib/video/VideoContainer.svelte';
	import init from '$lib/stores/socket';
	import { onMount } from 'svelte';
	import { defaultSettings, userSettings } from '$lib/stores/userSettings';
	import './styles.css';
	import { io } from '$lib/realtime';
	import { user } from '$lib/stores/user';
	import { tabText } from '$lib/stores/tabText';
	import Snow from '$lib/special/snow/Snow.svelte';
	import { tempSettings } from '$lib/stores/tempSettings';
	import { settings } from '$lib/stores/settings';
	import { page } from '$app/stores';
	let tabName = $settings.tabName;

	onMount(() => {
		if (!$page.url.search.includes('debug')) window.console.log = () => {};
		init();
		setInterval(() => {
			if ($tabText && tabName !== $tabText) {
				tabName = $tabText;
			} else {
				tabName = $settings.tabName;
			}
		}, 1000);
		const local = JSON.parse(localStorage.getItem('userSettings') ?? '{}');
		if (Object.keys(local).length > 0) {
			local.ready = true;
			for (let k in defaultSettings) {
				const key = k as keyof typeof defaultSettings;
				if (local[key] == undefined) {
					local[key] = defaultSettings[key];
				} else {
					if (typeof defaultSettings[key] == 'object') {
						for (let j in defaultSettings[key]) {
							const subKey = j as keyof (typeof defaultSettings)[typeof key];
							console.log(key, subKey);
							if (local[key][subKey] == undefined) {
								local[key][subKey] = defaultSettings[key][subKey];
							}
						}
					}
				}
			}
			$userSettings = local;
		} else {
			$userSettings.ready = true;
		}
		userSettings.subscribe((e) => {
			if (e.ready) localStorage.setItem('userSettings', JSON.stringify($userSettings));
		});
	});
</script>

<svelte:head>
	<title>{tabName}</title>
	<meta name="description" content="Prairie Dog Streaming" />
	<link rel="icon" href={$settings.tabIcon.toString() ?? ''} />
</svelte:head>

<section
	id="app"
	style:--color-bg-2={`hsl(${$userSettings.color},56%,41%)`}
	style:--color-fg-3={`hsl(${$userSettings.color},32%,74%)`}
>
	<c id="cHeader"><Header /></c>
	{#if $tempSettings.snow > 0}
		<Snow />
	{/if}
	<main>
		{#if $userSettings.display.video}<c
				id="cVideo"
				style:width={`calc(100% - ${$userSettings.chat.chatWidth}rem)`}
				style:--max-emote-height={$settings.maxEmoteHeight + 'px'}
			>
				<VideoContainer /></c
			>{/if}
		{#if $userSettings.display.chat !== 'none'}
			<c
				id="cChat"
				class={$tempSettings.minimize.toggle ? 'minimal' : ''}
				style:width={`${$userSettings.chat.chatWidth}rem`}
				style:order={$userSettings.display.chat == 'left' ? 1 : 3}
				style:left={$userSettings.display.chat == 'left' && $tempSettings.minimize.toggle ? 0 : ''}
				style:right={$userSettings.display.chat == 'right' && $tempSettings.minimize.toggle
					? 0
					: ''}><ChatContainer /></c
			>
		{/if}
	</main>
</section>

<style>
	#app {
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	main {
		display: flex;
		flex-grow: 1;
		width: 100vw;
		overflow-y: hidden;
	}
	#cChat {
		flex-grow: 1;
		order: 1;
	}
	#cChat.minimal {
		position: fixed;
		z-index: 1;
		pointer-events: none;
	}
	#cVideo {
		flex-shrink: 1;
		flex-grow: 1;
		order: 2;
		overflow: hidden;
		position: relative;
	}
	@media (orientation: portrait) {
		main {
			flex-direction: column;
		}
		#cChat {
			display: block;
			height: calc(100svh - 2rem - 100vw * 9 / 16);
			flex-grow: 1;
		}
		#cVideo {
			order: 1;
			display: block;
			aspect-ratio: 16/9;
			height: auto;
			flex-grow: 0;
		}
		#cChat,
		#cVideo {
			width: 100vw !important;
		}
	}
	@media (pointer: none), (pointer: coarse) {
		#app {
			height: 100svh;
		}
	}
</style>
