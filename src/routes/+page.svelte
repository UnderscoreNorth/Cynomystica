<script>
	import ChatContainer from '$lib/chat/ChatContainer.svelte';
	import VideoContainer from '$lib/video/VideoContainer.svelte';
	import PlaylistContainer from '$lib/playlist/PlaylistContainer.svelte';
	import { userSettings } from '$lib/stores/userSettings';
	import init from '$lib/stores/socket';
	import { onMount } from 'svelte';

	let settingsJson;
	userSettings.subscribe((value) => {
		settingsJson = value;
	});
	onMount(() => {
		init();
	});
</script>

<svelte:head>
	<title>Cynomystica</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<ChatContainer />
	<VideoContainer />
</section>

<style>
	section {
		position: relative;
	}
</style>
