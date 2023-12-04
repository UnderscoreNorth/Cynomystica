<script>
	import Header from '$lib/header/Header.svelte';
	import ChatContainer from '$lib/chat/ChatContainer.svelte';
	import VideoContainer from '$lib/video/VideoContainer.svelte';
	import init from '$lib/stores/socket';
	import { onMount } from 'svelte';
	import { userSettings } from '$lib/stores/userSettings';
	import './styles.css';

	onMount(() => {
		init();
	});
</script>

<svelte:head>
	<title>Cynomystica</title>
	<meta name="description" content="Prairie Dog Streaming" />
</svelte:head>

<section id='app'>
	<c id='cHeader'><Header /></c>
	<main>
		{#if $userSettings.display.video}<c id='cVideo' style:width={`calc(100% - ${$userSettings.display.chatWidth}rem)`}><VideoContainer /></c>{/if}
		{#if $userSettings.display.chat}<c id='cChat' style:width={`${$userSettings.display.chatWidth}rem`}><ChatContainer /></c>{/if}
	</main>
</section>

<style>
	#app{
		height:100vh;
		width:100vw;
		overflow:hidden;
	}
	main{
		display:flex;
		height:calc(100vh - 2rem);
		width:100vw;
		overflow-y:hidden;
	}
	#cVideo,#cChat{
		height:calc(100vh - 2rem);
	}
	#cChat{
		flex-grow:1;
		order:1;
	}
	#cVideo{
		flex-shrink: 1;
		flex-grow: 1;
		order:2;		
		overflow:hidden;
		position:relative;
	}
	@media only screen and (max-width: 768px) {
		main{
			flex-direction: column;
		}
		#cChat {
			display:block;
			height:calc(100vh - 2rem - 100vw * 9 / 16);
			flex-grow:1;
		}
		#cVideo{
			order:1;
			display:block;
			aspect-ratio: 16/9;
			height:auto;
			flex-grow:0;
		}
		#cChat,#cVideo{
			width:100vw!important;
		}
	}

</style>
