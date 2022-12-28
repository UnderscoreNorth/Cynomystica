<script lang="ts">
	import { page } from '$app/stores';
	import Login from './Login.svelte';
	import UserSettingsContainer from '$lib/userSettings/UserSettingsContainer.svelte';
	import MdPoll from 'svelte-icons/md/MdPoll.svelte';
	import MdSettings from 'svelte-icons/md/MdSettings.svelte';
	import MdViewList from 'svelte-icons/md/MdViewList.svelte';
	import PlaylistContainer from '$lib/playlist/PlaylistContainer.svelte';

	let userSettingsModalOpen: boolean = false;
	let playListModalOpen: boolean = false;
	const toggleSettings = () => {
		userSettingsModalOpen = !userSettingsModalOpen;
	};
	const togglePlaylist = () => {
		playListModalOpen = !playListModalOpen;
	};
</script>

<header>
	<nav>
		<div id="siteName">Cynomystica |</div>
		<div class="svgIcon" on:click={toggleSettings}><MdSettings /></div>
		<div class="svgIcon" on:click={toggleSettings}><MdPoll /></div>
		<div class="svgIcon" on:click={togglePlaylist}><MdViewList /></div>
		<div id="loginLi"><Login /></div>
	</nav>
	{#if userSettingsModalOpen}
		<UserSettingsContainer closeModal={toggleSettings} />
	{/if}
	{#if playListModalOpen}
		<PlaylistContainer closeModal={togglePlaylist} />
	{/if}
</header>

<style>
	#loginLi {
		flex-grow: 1;
		text-align: right;
	}
	header {
		display: flex;
		justify-content: space-between;
		border-bottom: solid 1px black;
	}
	nav {
		display: flex;
		justify-content: left;
		width: calc(100vw - 4rem);
		background: var(--color-bg-dark-1);
		color: var(--color-text-dark);
		padding: 0 2rem;
		flex-flow: row wrap;
		align-items: stretch;
		line-height: 2rem;
	}
</style>
