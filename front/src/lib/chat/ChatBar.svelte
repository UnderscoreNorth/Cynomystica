<script lang="ts">
	import { io } from '$lib/realtime';
	import { user } from '$lib/stores/user';
	import { blocker } from '$lib/stores/blocker';
	import type { Icon } from '$lib/stores/icons';
	import { icons } from '$lib/stores/icons';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { login } from '$lib/utilities/login';
	import { users } from '$lib/stores/users';
	import { userSettings } from '$lib/stores/userSettings';
	import { tabText } from '$lib/stores/tabText';
	import { afterUpdate, beforeUpdate } from 'svelte';
	import {emotes} from '$lib/stores/emotes';
	import { chatInput } from '$lib/stores/chat';
	let lastInput = '';
	let iconListOpen = false;
	let input: HTMLInputElement;
	let lastKey = '';
	let tabIndex = 0;
	let tabRegex = /([^ ]+)$/g;
	let sent: Array<string> = [];
	let sentIndex = -1;
	let selectionStart = 0;
	let selectionEnd = 0;
	let spoilerMode = false;
	let iconListEl;
	let beforeInput:string;

	beforeUpdate(() => {
		if (input) {
			//@ts-ignore
			({ selectionStart, selectionEnd } = input);
		}
		beforeInput = $chatInput;
	});

	afterUpdate(() => {
		if (spoilerMode) {
			if (selectionStart == selectionEnd) {
				selectionStart += 3;
			} else {
				selectionStart = selectionEnd;
				selectionStart += 7;
			}
			input.setSelectionRange(selectionStart, selectionStart);			
		}
		if(beforeInput !== $chatInput)
			input.focus();
	});
	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key == 's' && e.ctrlKey == true) {
			e.preventDefault();
		}
		if (e.key == 'Tab') {
			e.preventDefault();
			let tabWord = lastInput.match(tabRegex)?.[0].toLowerCase() ?? '';
			if (tabWord?.length) {
				let matchedUsers = $users.users
					.filter((otherUser) => {
						return otherUser.username.toLowerCase().indexOf(tabWord) == 0;
					})
					.map((otherUser) => otherUser.username);
				let matchedEmotes = Object.keys($emotes).filter((emote)=> emote.toLowerCase().indexOf(tabWord)==0)
				let matched = matchedUsers.concat(matchedEmotes);
				if (matched.length) {
					$chatInput = lastInput.replace(tabRegex, matched[tabIndex]);
					tabIndex++;
					if (tabIndex >= matched.length) tabIndex = 0;
				}
			}
		} else {
			tabIndex = 0;
		}
		if (e.key == 'Enter' && $chatInput.trim().length > 0) {
			if (!$user.username.length) {
				login($chatInput.trim(), '', 'guest');
			} else {
				sent.unshift($chatInput);
				if ($user.accessLevel < 4) {
					$chatInput = $chatInput.replace(/(http[^\s]+):pic/gim, '$1');
				}
				io.emit('message', { icon: $userSettings.icon ?? '', msg: $chatInput.trim() });
			}
			$chatInput = '';
		}
		lastKey = e.key;
	};
	const handleKeyUp = (e: KeyboardEvent) => {
		//console.log(e);
		if (e.key == 's' && e.ctrlKey == true) {
			spoilerMode = true;
			const { selectionStart: start, selectionEnd: end } = input;
			//@ts-ignore
			let spoileredText = `[s]${$chatInput.slice(start, end)}[/s]`;
			//@ts-ignore
			$chatInput = `${$chatInput.slice(0, start)}${spoileredText}${$chatInput.slice(end)}`;
		} else {
			spoilerMode = false;
		}
		if (e.key !== 'Tab') lastInput = $chatInput;
		if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
			if (sent.length) {
				if (e.key == 'ArrowUp') {
					sentIndex++;
				} else {
					sentIndex--;
				}
				if (sentIndex >= sent.length) {
					sentIndex = 0;
				} else if (sentIndex < 0) {
					sentIndex = sent.length - 1;
				}
				$chatInput = sent[sentIndex];
			}
		} else {
			sentIndex = -1;
		}
	};
	const toggleIconList = (e: MouseEvent) => {
		iconListOpen = !iconListOpen;
		e.stopPropagation();
	};
	const selectIcon = (icon: any) => {
		$userSettings.icon = icon;
	};
	const handleFocus = () => {
		$tabText = '';
	};
	onMount(() => {
		if (browser) {
			window.addEventListener('click', function (event) {
				iconListOpen = false;
			});
		}
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="iconSelect" on:click={toggleIconList} bind:this={iconListEl}>
	{#if $userSettings.icon && $icons[$userSettings.icon]?.url}
		<img src={$icons[$userSettings.icon].url} alt="icon" />
	{/if}
</div>
{#if iconListOpen}
	<div
		id="iconList"
		style={iconListEl?.getBoundingClientRect()?.top < 250 ? 'top:2rem;' : 'bottom:2rem'}
	>
		{#each Array.from(new Set(Object.values($icons).map((x) => x.preset))) as preset}
			<div class="presetContainer">
				<div>
					<b>{preset}</b>
				</div>
				{#each Object.entries($icons) as [id, icon]}
					{#if icon.preset == preset}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							on:click={() => {
								selectIcon(id);
							}}
							class="iconListItem"
						>
							{#if icon.url}
								<img src={icon.url} alt="icon" />
							{/if}
							<span>
								{icon.display}
							</span>
						</div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
{/if}
<input
	id="inputBar"
	placeholder={$user.username ? '' : 'Enter a username (Guest)'}
	disabled={$blocker.login}
	bind:value={$chatInput}
	bind:this={input}
	on:keydown={handleKeyDown}
	on:keyup={handleKeyUp}
	on:focus={handleFocus}
	autocomplete="off"
/>

<style>	
	#iconList {
		position: absolute;
		left: 0.5rem;
		max-height: 70svh;
		overflow-y: scroll;
		background: var(--color-bg-4);
		z-index: 2;
		color: var(--color-fg-4);
		box-shadow: 1px 1px 5px 0px black;
		border: solid 1px black;
	}
	.presetContainer {
		display: inline-block;
		vertical-align: top;
	}
	.iconListItem {
		display: flex;
		align-items: center;
		height: 1.8rem;
	}
	.iconListItem img{
		padding-right:2px;
	}
	.iconListItem:hover {
		background-color: var(--color-bg-2);
		color:var(--color-fg-2);
	}	
	.iconListItem img,
	#iconSelect img {
		height: 1.8rem;
		width: 1.8rem;
	}
	#iconSelect {
		position: absolute;
		float: left;
		left: 0.5rem;
		width: 2rem;
		height: calc(100% - 4px);
		top: 2px;
		z-index: 0;
		border-right: solid 1px black;
		display:flex;
		justify-content: center;
		align-items: center;
	}
	#iconSelect:hover {
		background-color: #1e90ff;
	}
	#inputBar {
		padding: 2px;
		border: 0;
		height: calc(100% - 4px);
		padding-left: 2.8rem;
		margin: 0;
		flex-grow: 1;
		flex-shrink: 1;
	}
</style>
