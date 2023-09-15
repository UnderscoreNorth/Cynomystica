<script lang="ts">
	import { page } from '$app/stores';
	import Login from './Login.svelte';
	import UserSettingsContainer from '$lib/userSettings/UserSettingsContainer.svelte';
	import ModerationContainer from '$lib/moderation/ModerationContainer.svelte';
	import PlaylistContainer from '$lib/playlist/PlaylistContainer.svelte';
	import ScheduleContainer from '$lib/schedule/ScheduleContainer.svelte';
	import Alert from './Alert.svelte';

	import IconButton from '$lib/ui/iconButton.svelte';
	import MdPoll from 'svelte-icons/md/MdPoll.svelte';
	import MdSettings from 'svelte-icons/md/MdSettings.svelte';
	import MdViewList from 'svelte-icons/md/MdViewList.svelte';
	import MdSentimentVeryDissatisfied from 'svelte-icons/md/MdSentimentVeryDissatisfied.svelte';
	import MdDateRange from 'svelte-icons/md/MdDateRange.svelte';

	let userSettingsModalOpen: boolean = false;
	let playListModalOpen: boolean = false;
	let moderationModalOpen: boolean = false;
	let scheduleModalOpen: boolean = false;
	const toggleSettings = () => {
		userSettingsModalOpen = !userSettingsModalOpen;
	};
	const togglePlaylist = () => {
		playListModalOpen = !playListModalOpen;
	};
	const toggleModeration = () => {
		moderationModalOpen = !moderationModalOpen;
	};
	const toggleSchedule = () =>{
		scheduleModalOpen = !scheduleModalOpen;
	}
	const dummy = () => {};
</script>

<header>
	<nav>
		<div id="siteName">Cynomystica |</div>
		<IconButton Icon={MdSettings} onClick={toggleSettings} tooltip={'Settings'} />
		<IconButton Icon={MdPoll} onClick={togglePlaylist} tooltip={'Polls'} />
		<IconButton Icon={MdViewList} onClick={togglePlaylist} tooltip={'Playlist'} />
		<IconButton
			Icon={MdSentimentVeryDissatisfied}
			onClick={toggleModeration}
			tooltip={'User Management'}
		/>
		<IconButton Icon={MdDateRange} onClick={toggleSchedule} tooltip={'Schedule'} />
		<div id="loginLi"><Login /></div>
		<Alert />
	</nav>
	{#if userSettingsModalOpen}
		<UserSettingsContainer closeModal={toggleSettings} />
	{/if}
	{#if playListModalOpen}
		<PlaylistContainer closeModal={togglePlaylist} />
	{/if}
	{#if moderationModalOpen}
		<ModerationContainer closeModal={toggleModeration} />
	{/if}
	{#if scheduleModalOpen}
		<ScheduleContainer closeModal={toggleSchedule} />
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
