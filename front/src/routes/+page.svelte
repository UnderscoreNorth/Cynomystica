<script>
	import Header from '$lib/header/Header.svelte';
	import ChatContainer from '$lib/chat/ChatContainer.svelte';
	import VideoContainer from '$lib/video/VideoContainer.svelte';
	import init from '$lib/stores/socket';
	import { onMount } from 'svelte';
	import { bulletMode } from '$lib/stores/bulletmode';
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
	<main class={$bulletMode ? 'bulletMode' : ''}>
		<c id={'cVideo' + ($bulletMode ? 'b' : '')}><VideoContainer /></c>
		<c id={'cChat' + ($bulletMode ? 'b' : '')}><ChatContainer /></c>
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
		width:23rem;
		order:1;
	}
	#cVideo{
		width:calc(100vw - 5rem);
		flex-shrink: 1;
		flex-grow: 1;
		order:2;
	}
	#cChatb{
		width:100vw;
		height:calc(100vh - 2.1rem);
		position:absolute;
	}
	#cVideob{
		width:100vw;
		height:calc(100vh - 4rem);
	}
	@media only screen and (max-width: 768px) {
		main{
			display:block
		}
		main.bulletMode{
			display:flex;
		}
		#cChat {
			display:block;
			height:calc(100vh - 2rem - 100vw * 9 / 16)}
		#cVideo{
			order:1;
			display:block;
			aspect-ratio: 16/9;
			height:auto;
		}
		#cChat,#cVideo{
			width:100vw;
		}
	}

</style>
