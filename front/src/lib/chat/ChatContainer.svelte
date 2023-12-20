<script lang="ts">
	import { userSettings } from '$lib/stores/userSettings';
	import { onMount } from 'svelte';
	import { users } from '$lib/stores/users';
	import { user } from '$lib/stores/user';
	import { chat } from '$lib/stores/chat';
	import type { usersType, otherUser } from '$lib/stores/users';
	import ChatBar from './ChatBar.svelte';
	import ChatRow from './ChatRow.svelte';
	import Poll from '$lib/polls/Poll.svelte';
	import { polls } from '$lib/stores/polls';	
	//@ts-ignore
	import MdGroup from 'svelte-icons/md/MdGroup.svelte';
	import OtherUserModal from './OtherUserModal.svelte';
	import { browser } from '$app/environment';
	import { permissions } from '$lib/stores/permissions';
	let settingsObj: any;
	let usersObj: usersType;
	let selectedOtherUser: otherUser | null;
	let hiddenPolls = new Set();
	$: userListOpen = false;
	userSettings.subscribe((value) => {
		settingsObj = value;
	});
	users.subscribe((value) => {
		usersObj = value;
	});

	let messages: any[] = [];
	const selectOtherUser = (user: otherUser | null) => {
		if ($user.accessLevel >= $permissions.userMod) selectedOtherUser = user;
	};
	let chatMessageElem: HTMLElement;
	let chatScroller:HTMLDivElement;
	if (browser) chatMessageElem = document.getElementById('chatMessages') as HTMLElement;
	let initScroll = true;
	onMount(() => {
		initScroll = true;
		chatScroller.addEventListener('scroll', function (e) {
			initScroll = false;
		});
		chat.subscribe((value) => {
			messages = value;
			setTimeout(() => {
				let chatMessages = document.getElementById('chatScroller') as HTMLElement;
				let parent = document.getElementById('chatMessages') as HTMLElement;
				if (
					chatMessages?.scrollTop + parent?.offsetHeight + 100 
					> chatMessages?.scrollHeight ||
					initScroll
				) {
					chatMessages.scrollTop = chatMessages?.scrollHeight;
				}
			}, 50);
		});
	});
	const hidePoll = (pollID:string)=>{
		hiddenPolls.add(pollID);
		hiddenPolls = hiddenPolls;
	}
	const toggleUserList = () => {
		userListOpen = !userListOpen;
	};
</script>

<div class="chatContainer" style="width:100%">
	<div id="grid">
		<div id="chatHeader">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="svgIcon" on:click={() => toggleUserList()}><MdGroup /></div>
			{$users.connectedUsers} connected user{$users.connectedUsers == 1 ? '' : 's'}
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
			<div id="chatScroller" bind:this={chatScroller}>
				<table id="chatTable">
					<thead>
						{#key hiddenPolls}
							{#each Object.entries($polls).sort((a,b)=>(a[1].options.length ? 1 : 0)-(b[1].options.length ? 1 : 0)) as poll}
								{#if hiddenPolls.has(poll[0]) == false}
								<tr>
									<td colspan=2>
										<div class='poll'>
											<Poll poll={poll[1]} pollID={poll[0]} hideFn={hidePoll}></Poll>
										</div>
									</td>
								</tr>
								{/if}	
							{/each}
						{/key}
					</thead>
					<tbody>
						{#each messages as message}
							<ChatRow {message} />
						{/each}
					</tbody>
				</table>
			</div>
		</div>
		<div id="chatBarContainer">
			<ChatBar />
		</div>
		{#if selectedOtherUser}
			<OtherUserModal otherUser={selectedOtherUser} closeModal={selectOtherUser} />
		{/if}
	</div>
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
	}

	#chatBarContainer {
		position: relative;
		order: 3;
	}
	@media (orientation: portrait) {
		#chatHeader {
			order: 3;
		}
		#chatBarContainer {
			order: 1;
		}
	}
	#chatTable {
		border-collapse: collapse;
		width: 100%;
	}
	:global(#chatTable tbody tr:nth-child(2n)) {
		background: rgba(0, 0, 0, 0.15);
	}
	:global(#chatContainerb #chatTable tbody tr:nth-child(2n)) {
		background: none;
	}
	.chatContainer {
		background: var(--color-bg-dark-3);
		height: 100%;
		display: inline-block;
		vertical-align: top;
		color: #a6b7d1;
	}
	#grid {
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
		background-image: url(/CynoChatBG.png);
		background-position: bottom;
		order: 2;
	}
	#chatScroller {
		height: calc(100% - 0.5rem);
		overflow-y: scroll;
		padding-bottom: 0.5rem;
		overflow-x: hidden;
	}

	#userList {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
		background: var(--color-bg-dark-3);
		width: 8rem;
		height: calc(100% - 1em);
		padding: 0.5em;
		box-shadow: 4px 0px 4px black, inset 0px 0.5em var(--color-bg-dark-1);
		overflow-y: scroll;
	}
	thead{
		position:sticky;
		top:0;	
		padding:1rem;
	}
	.poll{
		padding:0.5rem;
		font-size: 0.8rem;
		box-shadow: 1px 1px 5px 0px black;
		background: var(--color-bg-dark-1);
		margin:5px;
		color:white;
		opacity:0.9;
	}
</style>
