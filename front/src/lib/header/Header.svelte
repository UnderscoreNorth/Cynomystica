<script lang="ts">
	import { page } from '$app/stores';
	import Login from './Login.svelte';
	import UserSettingsContainer from '$lib/settings/UserSettingsContainer.svelte';
	import ModerationContainer from '$lib/moderation/ModerationContainer.svelte';
	import PlaylistContainer from '$lib/playlist/PlaylistContainer.svelte';
	import ScheduleContainer from '$lib/schedule/ScheduleContainer.svelte';
	import Alert from './Alert.svelte';
	import { bulletMode } from '$lib/stores/bulletmode';
	import Modal from '$lib/ui/modal.svelte';

	import IconButton from '$lib/ui/iconButton.svelte';
	import MdPoll from 'svelte-icons/md/MdPoll.svelte';
	import MdSettings from 'svelte-icons/md/MdSettings.svelte';
	import MdViewList from 'svelte-icons/md/MdViewList.svelte';
	import MdSentimentVeryDissatisfied from 'svelte-icons/md/MdSentimentVeryDissatisfied.svelte';
	import MdDateRange from 'svelte-icons/md/MdDateRange.svelte';
	import MdClearAll from 'svelte-icons/md/MdClearAll.svelte';
	import MdInfoOutline from 'svelte-icons/md/MdInfoOutline.svelte';
	import InfoContainer from '$lib/information/infoContainer.svelte';
	import PollModal from '$lib/polls/PollModal.svelte';

	let userSettingsModalOpen: boolean = false;
	let playListModalOpen: boolean = false;
	let moderationModalOpen: boolean = false;
	let scheduleModalOpen: boolean = false;
	let infoModalOpen: boolean = false;
	let pollModalOpen: boolean = false;
	const toggleSettings = () => {
		userSettingsModalOpen = !userSettingsModalOpen;
	};
	const togglePlaylist = () => {
		playListModalOpen = !playListModalOpen;
	};
	const toggleModeration = () => {
		moderationModalOpen = !moderationModalOpen;
	};
	const toggleSchedule = () => {
		scheduleModalOpen = !scheduleModalOpen;
	};
	const toggleInfo = () => {
		infoModalOpen = !infoModalOpen;
	};
	const togglePoll = ()=>{
		pollModalOpen = !pollModalOpen;
	}
	const dummy = () => {};
	/*
	
	<IconButton
			Icon={MdSentimentVeryDissatisfied}
			onClick={toggleModeration}
			tooltip={'User Management'}
		/>
		<IconButton Icon={MdClearAll} onClick={toggleBulletMode} tooltip={'Fullscreen Bullet Mode'} />
	*/
</script>

<header>
	<nav>
		<div id="siteName">Cynomystica |</div>
		<IconButton Icon={MdSettings} onClick={toggleSettings} tooltip={'Settings'} />

		<IconButton Icon={MdViewList} onClick={togglePlaylist} tooltip={'Playlist'} />

		<IconButton Icon={MdDateRange} onClick={toggleSchedule} tooltip={'Schedule'} />
		<IconButton Icon={MdInfoOutline} onClick={toggleInfo} tooltip={'Info/Updates'} />
		<IconButton Icon={MdPoll} onClick={togglePoll} tooltip={'Polls/Pinned Messages'} />
		<div id="loginLi"><Login /></div>
		<Alert />
	</nav>
	{#if userSettingsModalOpen}
		<Modal closeModal={toggleSettings}>
			<UserSettingsContainer />
		</Modal>
	{/if}
	{#if playListModalOpen}
		<Modal closeModal={togglePlaylist}>
			<PlaylistContainer />
		</Modal>
	{/if}
	{#if moderationModalOpen}
		<ModerationContainer closeModal={toggleModeration} />
	{/if}
	{#if scheduleModalOpen}
		<Modal closeModal={toggleSchedule}>
			<ScheduleContainer />
		</Modal>
	{/if}
	{#if infoModalOpen}
		<Modal closeModal={toggleInfo}>
			<InfoContainer />
		</Modal>
	{/if}
	{#if pollModalOpen}
		<Modal closeModal={togglePoll}>
			<PollModal />
		</Modal>
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
		background: var(--color-bg-2);
		color: var(--color-fg-2);
		padding: 0 2rem;
		flex-flow: row wrap;
		align-items: stretch;
		line-height: 2rem;
	}
	@media (orientation:portrait){
		#siteName{
			display:none;
		}
	}
</style>
