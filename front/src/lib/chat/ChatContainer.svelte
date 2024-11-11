<script lang="ts">
	import { userSettings } from '$lib/stores/userSettings';
	import { tempSettings } from '$lib/stores/tempSettings';
	import { settings } from '$lib/stores/settings';
	import { user } from '$lib/stores/user';
	import { users } from '$lib/stores/users';
	import type { usersType } from '$lib/stores/users';
	import ChatBar from './ChatBar.svelte';
	//@ts-ignore
	import MdGroup from 'svelte-icons/md/MdGroup.svelte';
	//@ts-ignore
	import MdLockOutline from 'svelte-icons/md/MdLockOutline.svelte';
	//@ts-ignore
	import MdLockOpen from 'svelte-icons/md/MdLockOpen.svelte';
	import ChatTable from './ChatTable.svelte';
	import Tooltip from '$lib/ui/tooltip.svelte';
	import UserList from './UserList.svelte';
	import { permissions } from '$lib/stores/permissions';
	//import EffectsController from '$lib/special/EffectsController.svelte';
	let settingsObj: any;
	let usersObj: usersType;
	$: userListOpen = false;
	userSettings.subscribe((value) => {
		settingsObj = value;
	});
	users.subscribe((value) => {
		usersObj = value;
	});

	const toggleUserList = () => {
		userListOpen = !userListOpen;
	};
	const getUserCountText = (count: number, countText: string) => {
		countText = countText || '|n| connected user|s|';
		if (count == 1) {
			countText = countText.replace(/\|s\|/g, '');
		} else {
			countText = countText.replace(/\|s\|/g, 's');
		}
		countText = countText.replace(/\|n\|/g, count.toString());
		return countText;
	};
	/*
	<div id="effectsControl">
		{#if $user.accessLevel > 3}
			<EffectsController />
		{/if}
	</div>
	#effectsControl {
		order: 3;
		background: var(--color-bg-3);
		color: white;
	}
	*/
</script>

<div
	class={'chatContainer' + ($tempSettings.minimize.toggle ? ' chatMinimal' : '')}
	style="width:100%"
>
	{#if $tempSettings.minimize.toggle}
		<ChatTable />
	{:else}
		<div id="chatGrid">
			<div id="chatHeader">
				{#if $permissions.viewUsers < $user.accessLevel}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="svgIcon" on:click={() => toggleUserList()}><MdGroup /></div>
				{/if}
				<span style:flex-grow="1">
					{getUserCountText($users.connectedUsers, $settings.userCountText)}
				</span>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<Tooltip title="Toggle autoscroll">
					<div
						class="svgIcon"
						on:click={() => ($tempSettings.scrollLock = !$tempSettings.scrollLock)}
					>
						{#if $tempSettings.scrollLock}
							<MdLockOutline />
						{:else}
							<MdLockOpen />
						{/if}
					</div>
				</Tooltip>
			</div>
			<div id="chatMessages">
				{#if userListOpen}
					<UserList />
				{/if}
				<ChatTable />
			</div>

			<div id="chatBarContainer">
				<ChatBar />
			</div>
		</div>
	{/if}
</div>

<style>
	#chatHeader {
		display: flex;
		line-height: 2em;
		border-bottom: solid 1px black;
		order: 1;
		background: var(--color-bg-2);
		color: var(--color-fg-2);
	}

	#chatBarContainer {
		position: relative;
		order: 4;
		display: flex;
		overflow: visible;
	}
	@media (orientation: portrait) {
		#chatHeader {
			order: 4;
		}
		#chatBarContainer {
			order: 1;
		}
	}
	.chatContainer {
		height: 100%;
		display: inline-block;
		vertical-align: top;
	}
	.chatContainer.chatMinimal {
		display: flex;
		height: 100svh;
		align-items: center;
	}
	#chatGrid {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 2em 1fr 2em 5px;
		gap: 0px 0px;
		height: 100%;
		width: 100%;
	}
	#chatMessages {
		position: relative;
		overflow-y: hidden;
		order: 2;
		height: 100%;
		width: inherit;
	}
</style>
