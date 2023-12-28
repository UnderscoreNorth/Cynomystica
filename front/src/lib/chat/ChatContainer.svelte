<script lang="ts">
	import { userSettings } from '$lib/stores/userSettings';	
	import { tempSettings } from '$lib/stores/tempSettings';
	import { settings } from '$lib/stores/settings';
	import { users } from '$lib/stores/users';
	import { user } from '$lib/stores/user';
	import type { usersType, otherUser } from '$lib/stores/users';
	import ChatBar from './ChatBar.svelte';
	import OtherUserModal from './OtherUserModal.svelte';
	//@ts-ignore
	import MdGroup from 'svelte-icons/md/MdGroup.svelte';
	//@ts-ignore
	import MdLockOutline from 'svelte-icons/md/MdLockOutline.svelte'
	//@ts-ignore
	import MdLockOpen from 'svelte-icons/md/MdLockOpen.svelte'
	
	import { permissions } from '$lib/stores/permissions';
	import ChatTable from './ChatTable.svelte';
	import Tooltip from '$lib/ui/tooltip.svelte';
	let settingsObj: any;
	let usersObj: usersType;
	let selectedOtherUser: otherUser | null;
	
	$: userListOpen = false;
	userSettings.subscribe((value) => {
		settingsObj = value;
	});
	users.subscribe((value) => {
		usersObj = value;
	});

	const selectOtherUser = (user: otherUser | null) => {
		if ($user.accessLevel >= $permissions.userMod) selectedOtherUser = user;
	};
	const toggleUserList = () => {
		userListOpen = !userListOpen;
	};
	const getUserCountText = (count:number,countText:string) =>{
		countText = countText || '|n| connected user|s|';
		if(count == 1){
			countText = countText.replace(/\|s\|/g,'')
		} else {
			countText = countText.replace(/\|s\|/g,'s')
		}
		countText = countText.replace(/\|n\|/g,count.toString());
		return countText;
	}
</script>

<div class="chatContainer" style="width:100%">
	{#if $tempSettings.minimize.toggle}
		<ChatTable />
	{:else}
		<div id="chatGrid">
			<div id="chatHeader">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="svgIcon" on:click={() => toggleUserList()}><MdGroup /></div>
				<span style:flex-grow=1>
					{getUserCountText($users.connectedUsers,$settings.userCountText)}
				</span>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<Tooltip title='Toggle autoscroll'>
					<div class="svgIcon"
						on:click={()=>$tempSettings.scrollLock = !$tempSettings.scrollLock}>
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
					<div id="userList">
						Userlist
						<hr />
						{#each $users.users as userItem}
							{#if userItem.accessLevel >= 0}
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div
									class={"userListItem accessLevel" + userItem.accessLevel}									
									on:click={() => {
										selectOtherUser(userItem);
									}}
								>
									{userItem.username}
								</div>
							{/if}
						{/each}
					</div>
				{/if}
				<ChatTable />
			</div>
			<div id="chatBarContainer">
				<ChatBar />
			</div>
			{#if selectedOtherUser}
				<OtherUserModal otherUser={selectedOtherUser} closeModal={selectOtherUser} />
			{/if}
		</div>
	{/if}	
</div>

<style>
	.userListItem.accessLevel0 {
		font-style: italic;
	}
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
		order: 3;
		display:flex;
		overflow: visible;
	}
	@media (orientation: portrait) {
		#chatHeader {
			order: 3;
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
		height:100%;
	}	
	#userList {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
		background: var(--color-bg-3);
		color:var(--color-fg-3);
		height: calc(100% - 1em);
		padding: 0.5em;
		box-shadow: 4px 0px 4px black;
		overflow-y: auto;
		opacity:0.9;
	}	
</style>
