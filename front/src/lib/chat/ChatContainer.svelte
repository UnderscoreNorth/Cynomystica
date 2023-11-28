<script lang="ts">
	import { userSettings } from '$lib/stores/userSettings';
	import { io } from '$lib/realtime';
	import { onMount } from 'svelte';
	import { users } from '$lib/stores/users';
	import { chat } from '$lib/stores/chat';
	import type { usersType,otherUser } from '$lib/stores/users';
	import ChatBar from './ChatBar.svelte';
	import ChatMessage from './ChatMessage.svelte';
	import MdGroup from 'svelte-icons/md/MdGroup.svelte';
	import { user } from '$lib/stores/user';
	import OtherUserModal from './OtherUserModal.svelte';
	
	let settingsObj: any;
	let usersObj: usersType;
	let selectedOtherUser:otherUser;	
	$: userListOpen = false;
	userSettings.subscribe((value) => {
		settingsObj = value;
	});
	users.subscribe((value) => {
		usersObj = value;
	});
	let width: string;
	
	let messages: any[] = [];
	const selectOtherUser = (user:otherUser|null)=>{
		selectedOtherUser = user;
	}
	onMount(() => {
		chat.subscribe((value) => {
			messages = value;
			setTimeout(()=>{
				let chatMessages = document.getElementById('chatScroller');
				let parent = document.getElementById('chatMessages');
				if(chatMessages?.scrollTop + parent?.offsetHeight  + 100> chatMessages?.scrollHeight)	
					chatMessages.scrollTop = chatMessages?.scrollHeight;
			},50);
		});
	});
	
	const toggleUserList = () => {
		userListOpen = !userListOpen;
	};
</script>

<div id="chatContainer" style='width:100%'>
	<div id="grid">
		<div id="chatHeader">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="svgIcon" on:click={() => toggleUserList()}><MdGroup /></div>
			{$users.connectedUsers} connected user{$users.connectedUsers > 1 ? 's' : ''}
		</div>
		<div id="chatMessages" >
			{#if userListOpen}
				<div id="userList">
					Userlist
					<hr />
					{#each $users.users as userItem}
						{#if userItem.accessLevel >= 0}
							{#if userItem.username == $user.username || 1==1}
							<div class='userListItemYou'>{userItem.username}</div>
							{:else}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div class='userListItem' on:click={()=>{selectOtherUser(userItem)}}>{userItem.username}</div>
							{/if}
							
							
						{/if}
					{/each}
				</div>
			{/if}
			<div id='chatScroller'>
				<table id="chatTable">
					{#each messages as message}
						<ChatMessage {message} />
					{/each}
				</table>
			</div>
		</div>
		<ChatBar />
		{#if selectedOtherUser}
		<OtherUserModal otherUser={selectedOtherUser} closeModal={selectOtherUser} />
		{/if}
		
	</div>
</div>

<style>
	.userListItem:hover{
		cursor: pointer;
		text-decoration: underline;
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
	#chatContainer {
		background: var(--color-bg-dark-3);
		height: 100%;
		display: inline-block;
		vertical-align: top;
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
	}
	#chatScroller{
		height:calc(100% - 0.5rem);
		overflow-y: scroll;
		padding-bottom:0.5rem;
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
</style>
