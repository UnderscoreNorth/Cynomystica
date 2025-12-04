<script lang="ts">
	import Login from './Login.svelte';
	//import { user } from '$lib/stores/user';
	import ModerationContainer from '$lib/moderation/ModerationContainer.svelte';
	import PlaylistContainer from '$lib/playlist/PlaylistContainer.svelte';
	import ScheduleContainer from '$lib/schedule/ScheduleContainer.svelte';
	import Alert from './Alert.svelte';
	import Modal from '$lib/ui/modal.svelte';

	import IconButton from '$lib/ui/iconButton.svelte';
	//@ts-ignore
	import MdPoll from 'svelte-icons/md/MdPoll.svelte';
	//@ts-ignore
	import MdSettings from 'svelte-icons/md/MdSettings.svelte';
	//@ts-ignore
	import MdViewList from 'svelte-icons/md/MdViewList.svelte';
	//@ts-ignore
	import MdSentimentVeryDissatisfied from 'svelte-icons/md/MdSentimentVeryDissatisfied.svelte';
	//@ts-ignore
	import MdDateRange from 'svelte-icons/md/MdDateRange.svelte';
	//@ts-ignore
	import MdInfoOutline from 'svelte-icons/md/MdInfoOutline.svelte';
	//@ts-ignore
	//import GiSnowflake2 from 'svelte-icons/gi/GiSnowflake2.svelte';
	import InfoContainer from '$lib/information/infoContainer.svelte';
	import PollModal from '$lib/polls/PollModal.svelte';
	import { tempSettings } from '$lib/stores/tempSettings';
	import ChatBar from '$lib/chat/ChatBar.svelte';
	import SettingsModal from '$lib/settings/SettingsModal.svelte';
	import Tooltip from '$lib/ui/tooltip.svelte';
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
	const togglePoll = () => {
		pollModalOpen = !pollModalOpen;
	};

	const dummy = () => {};
	/*
	import EffectsModal from '$lib/special/EffectsModal.svelte';
	import Effects from '$lib/special/Effects.svelte';
	let effectsOff: boolean = false;
	let effectsModalOpen: boolean = false;
	const toggleEffects = () => {
		effectsOff = !effectsOff;
	};
	const toggleEffectsModal = () => {
		effectsModalOpen = !effectsModalOpen;
	};
	<IconButton
		state={effectsOff}
		Icon={GiSnowflake2}
		onClick={toggleEffects}
		tooltip={effectsOff ? 'Turn Effects On' : 'Turn Effects Off'}
	/>
	{#if !effectsOff}
		<Effects />
	{/if}
	*/
</script>

<header>
	{#if $tempSettings.minimize.toggle}
		<div id="minimalHeader">
			<div id="minimalSettings">
				<IconButton Icon={MdSettings} onClick={toggleSettings} tooltip={'Settings'} />
			</div>
			<div id="minimalChatBar">
				<ChatBar />
			</div>
		</div>
	{:else}
		<nav>
			<div id="siteName">
				<a target="_blank" rel="noreferrer" href="https://github.com/UnderscoreNorth/Cynomystica"
					><Tooltip title="Github/Documentation">Cynomystica</Tooltip></a
				> |
			</div>
			<IconButton Icon={MdSettings} onClick={toggleSettings} tooltip={'Settings'} />
			<IconButton Icon={MdViewList} onClick={togglePlaylist} tooltip={'Queue'} />
			<IconButton Icon={MdDateRange} onClick={toggleSchedule} tooltip={'Schedule'} />
			<IconButton Icon={MdInfoOutline} onClick={toggleInfo} tooltip={'Info'} />
			<IconButton Icon={MdPoll} onClick={togglePoll} tooltip={'Polls/Pinned Messages'} />
			<IconButton
				Icon={MdSentimentVeryDissatisfied}
				onClick={toggleModeration}
				tooltip={'User Management'}
			/>
			<div id="loginLi"><Login /></div>
		</nav>
	{/if}
	<Alert />
	{#if userSettingsModalOpen}
		<Modal closeModal={toggleSettings} title={'Settings'}>
			<SettingsModal />
		</Modal>
	{/if}
	{#if playListModalOpen}
		<Modal closeModal={togglePlaylist} title={'Queue'}>
			<PlaylistContainer />
		</Modal>
	{/if}
	{#if moderationModalOpen}
		<Modal closeModal={toggleModeration} title="User Management">
			<ModerationContainer />
		</Modal>
	{/if}
	{#if scheduleModalOpen}
		<Modal closeModal={toggleSchedule} title={'Schedule'} width="90vw" height="90vh">
			<ScheduleContainer />
		</Modal>
	{/if}
	{#if infoModalOpen}
		<Modal closeModal={toggleInfo} title="Info">
			<InfoContainer />
		</Modal>
	{/if}
	{#if pollModalOpen}
		<Modal closeModal={togglePoll} title="Polls/Pinned Messages">
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
	#minimalHeader {
		color: var(--color-fg-2);
		opacity: 0.5;
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 2;
		width: calc(100% - 1rem);
		display: flex;
		pointer-events: none;
	}
	#minimalHeader > * {
		pointer-events: all;
	}
	#minimalSettings {
		float: left;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 0.5rem;
	}
	#minimalChatBar {
		max-width: 80vw;
		width: 20rem;
		display: flex;
		position: relative;
		margin: auto;
		height: max-content;
		height: 2rem;
	}
	:global(#minimalChatBar > input) {
		background: rgba(0, 0, 0, 0.1);
		border-radius: 0.5rem;
		text-shadow:
			-1px -1px 0 white,
			1px -1px 0 white,
			-1px 1px 0 white,
			1px 1px 0 white;
		outline: solid 1px rgba(255, 255, 255, 0.1);
	}
	:global(#minimalChatBar > #iconSelect) {
		border: none;
		opacity: 0.3;
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
	@media (orientation: portrait) {
		#siteName {
			display: none;
		}
	}
</style>
