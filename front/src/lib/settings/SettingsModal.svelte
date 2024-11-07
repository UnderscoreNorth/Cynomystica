<script lang="ts">
	import UserSettingsContainer from './UserSettingsContainer.svelte';
	import { user } from '$lib/stores/user';
	import { permissions } from '$lib/stores/permissions';
	import EmotesContainer from './EmotesContainer.svelte';
	import IconsContainer from './IconsContainer.svelte';
	import PermissionsContainer from './PermissionsContainer.svelte';
	import UsersContainer from './UsersContainer.svelte';
	import SettingsContainer from './SettingsContainer.svelte';
	import EffectsModal from '../special/EffectsModal.svelte';

	let tabs = ['User'];
	let selectedTab = 'User';

	const getPermissions = () => {
		tabs = ['User'];
		if ($user.accessLevel >= $permissions.manageEmotes) tabs.push('Emotes');
		if ($user.accessLevel >= $permissions.manageIcons) tabs.push('Icons');
		if ($user.accessLevel >= $permissions.managePermissions) tabs.push('Permissions');
		if ($user.accessLevel >= $permissions.manageUsers) tabs.push('Users');
		if ($user.accessLevel >= $permissions.manageSettings) tabs.push('Settings');
		if ($user.accessLevel > 3) tabs.push('Effects');
		if (!tabs.includes(selectedTab)) selectedTab = 'User';
	};
	getPermissions();
	permissions.subscribe((e) => {
		getPermissions();
	});
	user.subscribe((e) => {
		getPermissions();
	});
</script>

{#each tabs as tab}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<span
		class={'tabHeader' + (tab == selectedTab ? ' selected' : '')}
		on:click={() => (selectedTab = tab)}>{tab}</span
	>
{/each}
<hr />
{#if selectedTab == 'User'}
	<UserSettingsContainer />
{:else if selectedTab == 'Emotes'}
	<EmotesContainer />
{:else if selectedTab == 'Icons'}
	<IconsContainer />
{:else if selectedTab == 'Permissions'}
	<PermissionsContainer />
{:else if selectedTab == 'Users'}
	<UsersContainer />
{:else if selectedTab == 'Settings'}
	<SettingsContainer />
{:else if selectedTab == 'Effects'}
	<EffectsModal />
{/if}

<style>
	.tabHeader {
		padding: 0 5px;
		cursor: pointer;
	}
	.tabHeader.selected {
		cursor: default;
		font-weight: bold;
		border-radius: 2px 2px 0 0;
	}
</style>
