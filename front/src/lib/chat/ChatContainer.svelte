<script lang="ts">
	import { userSettings } from '$lib/stores/userSettings';
	import { io } from '$lib/realtime';
	import { onMount } from 'svelte';
	import { users } from '$lib/stores/users';
	import { chat } from '$lib/stores/chat';
	import type { usersType } from '$lib/stores/users';
	import ChatBar from './ChatBar.svelte';
	import ChatMessage from './ChatMessage.svelte';
	import MdGroup from 'svelte-icons/md/MdGroup.svelte';
	import { user } from '$lib/stores/user';
	
	let settingsObj: any;
	let usersObj: usersType;
	$: userListOpen = false;
	userSettings.subscribe((value) => {
		settingsObj = value;
	});
	users.subscribe((value) => {
		usersObj = value;
	});
	let width: string;
	$: {
		getCSS(settingsObj);
	}
	let messages: any[] = [];

	onMount(() => {
		chat.subscribe((value) => {
			console.log(value);
			messages = value;
			let chatMessages = document.getElementById('chatMessages');
			chatMessages.scrollTop = chatMessages?.scrollHeight
		});
	});
	const getCSS = (settingsObj: any) => {
		if (['Chatbar-left', 'Chatbar-right'].includes(settingsObj.chat.display)) {
			width = `calc(100vw - ${settingsObj.video.width} - 2rem)`;
		} else {
			width = '100vw';
		}
	};
	const toggleUserList = () => {
		userListOpen = !userListOpen;
		console.log(userListOpen);
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
					Userlist Last Active
					<hr />
					{#each $users.users as userItem}
						{#if userItem.accessLevel >= 0}
							<div>{userItem.username}</div>
						{/if}
					{/each}
				</div>
			{/if}
			<table id="chatTable">
				{#each messages as message}
					<ChatMessage {message} />
				{/each}
			</table>
		</div>
		<ChatBar />
	</div>
</div>

<style>
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
		background: rgba(0, 0, 0, 0.25);
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
		overflow-y: scroll;
		position: relative;
	}
	#userList {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		background: var(--color-bg-dark-3);
		height: calc(100% - 1em);
		padding: 0.5em;
		box-shadow: 4px 0px 4px black, inset 0px 0.5em var(--color-bg-dark-1);
	}
</style>
