<script>
	import Header from '$lib/header/Header.svelte';
	import ChatContainer from '$lib/chat/ChatContainer.svelte';
	import VideoContainer from '$lib/video/VideoContainer.svelte';
	import init from '$lib/stores/socket';
	import { onMount } from 'svelte';
	import './styles.css';

	onMount(() => {
		init();
	});
</script>

<svelte:head>
	<title>Cynomystica</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section id='app'>
	<c id='cHeader'><Header /></c>
	<c id='cVideo'><VideoContainer /></c>
	<c id='cChat'><ChatContainer /></c>
</section>

<style>
	#app{
		position: relative;
		display: grid;
		grid-template-columns: 2fr 8fr;
		grid-template-rows: 2rem 1fr;
		grid-column-gap: 0px;
		grid-row-gap: 0px;
		height:100vh;
		width:100vw;
		overflow-y:hidden;
	}
	#cHeader { grid-area: 1 / 1 / 2 / 3; }
	#cChat { grid-area: 2 / 1 / 3 / 2; }
	#cVideo { grid-area: 2 / 2 / 3 / 3; }
	@media only screen and (max-width: 768px) {
		#app{
			display:flex;
			flex-direction: column;
		}
		#cChat { flex-grow: 1;}
	}

</style>
