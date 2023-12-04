<script lang="ts">
	import { userSettings } from '$lib/stores/userSettings';
	import { onMount } from 'svelte';
	import { users } from '$lib/stores/users';
	import { user } from '$lib/stores/user';
	import { chat } from '$lib/stores/chat';
	import type { usersType,otherUser } from '$lib/stores/users';
	import ChatBar from './ChatBar.svelte';
	import ChatRow from './ChatRow.svelte';
	import MdGroup from 'svelte-icons/md/MdGroup.svelte';
	import OtherUserModal from './OtherUserModal.svelte';
	import { bulletMode } from '$lib/stores/bulletmode';
	import { browser } from '$app/environment';
	import { permissions } from '$lib/stores/permissions';
	let settingsObj: any;
	let usersObj: usersType;
	let selectedOtherUser:otherUser|null;	
	$: userListOpen = false;
	userSettings.subscribe((value) => {
		settingsObj = value;
	});
	users.subscribe((value) => {
		usersObj = value;
	});
	
	let messages: any[] = [];
	const selectOtherUser = (user:otherUser|null)=>{
		if($user.accessLevel >= $permissions.userMod)
		selectedOtherUser = user;
	}
	let chatMessageElem:HTMLElement|null;
	let chatScroller;
	if(browser)
		chatMessageElem = document.getElementById('chatMessages');
	let initScroll = true;
	onMount(() => {
		initScroll = true;
		chatScroller.addEventListener('scroll',function(e){
			initScroll = false;
		});
		chat.subscribe((value) => {
			messages = value;
			setTimeout(()=>{
				let chatMessages = document.getElementById('chatScroller');
				let parent = document.getElementById('chatMessages');
				if(chatMessages?.scrollTop + parent?.offsetHeight  + 100> chatMessages?.scrollHeight || initScroll)	{
					chatMessages.scrollTop = chatMessages?.scrollHeight;
				}	
			},50);
		});
	});
	
	const toggleUserList = () => {
		userListOpen = !userListOpen;
	};
</script>

<div class="chatContainer" id={$bulletMode ? 'chatContainerb' : ''} style='width:100%'>
	<div id="grid">
		<div id="chatHeader">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="svgIcon" on:click={() => toggleUserList()}><MdGroup /></div>
			{$users.connectedUsers} connected user{$users.connectedUsers == 1 ? '' : 's'}
		</div>
		<div id="chatMessages" >
			{#if !$bulletMode}
				{#if userListOpen}
					<div id="userList">
						Userlist
						<hr />
						{#each $users.users as userItem}
							{#if userItem.accessLevel >= 0}
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div class='userListItem' accessLevel={userItem.accessLevel} on:click={()=>{selectOtherUser(userItem)}}>
									{userItem.username}
								</div>
							{/if}
						{/each}
					</div>
				{/if}
				<div id='chatScroller' bind:this={chatScroller}>
					<table id="chatTable">
						{#each messages as message}
							<ChatRow {message} />
						{/each}
					</table>
				</div>
			{/if}
		</div>
		<ChatBar />
		{#if selectedOtherUser}
		<OtherUserModal otherUser={selectedOtherUser} closeModal={selectOtherUser} />
		{/if}
		
	</div>
</div>

<style>
	.userListItem[accessLevel="0"]{
		font-style: italic;
	}
	#chatHeader {
		display: flex;
		line-height: 2em;
		border-bottom: solid 1px black;
	}
	
	#chatTable {
		border-collapse: collapse;
		width:100%;
	}	
	:global(#chatTable tr:nth-child(2n)) {
		background: rgba(0, 0, 0, 0.15);
	}
	:global(#chatContainerb #chatTable tr:nth-child(2n)) {
		background: none;
	}
	.chatContainer {
		background: var(--color-bg-dark-3);
		height: 100%;
		display: inline-block;
		vertical-align: top;
		color:#a6b7d1		
	}	
	#grid {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 2em 1fr 2em;
		gap: 0px 0px;
		height: 100%;
		width: 100%;
	}
	#chatMessages {
		position: relative;
		overflow-y: hidden;
		background-image: url(/CynoChatBG.png);
    background-position: bottom;
	}
	#chatScroller{
		height:calc(100% - 0.5rem);
		overflow-y: scroll;
		padding-bottom:0.5rem;
		overflow-x: hidden;
	}

	#userList {
		position:absolute;
		top: 0;
		left: 0;
		z-index: 1;
		background: var(--color-bg-dark-3);
		width:8rem;
		height: calc(100% - 1em);
		padding: 0.5em;
		box-shadow: 4px 0px 4px black, inset 0px 0.5em var(--color-bg-dark-1);
		overflow-y: scroll;
	}

	#chatContainerb{
		background:none;
	}
	#chatContainerb #chatHeader{
		border:none;
	}

	#chatContainerb #chatScroller::-webkit-scrollbar {
		display: none;
	}
	#chatContainerb #chatScroller {
		-ms-overflow-style: none;  /* IE and Edge */
		scrollbar-width: none;  /* Firefox */
	}	
</style>
