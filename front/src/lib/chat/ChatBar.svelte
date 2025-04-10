<script lang="ts">
	import { io } from '$lib/realtime';
	import { user } from '$lib/stores/user';
	import { blocker } from '$lib/stores/blocker';
	import { onMount } from 'svelte';
	import { login } from '$lib/utilities/login';
	import { users } from '$lib/stores/users';
	import { userSettings } from '$lib/stores/userSettings';
	import { tabText } from '$lib/stores/tabText';
	import { afterUpdate, beforeUpdate } from 'svelte';
	import { emotes } from '$lib/stores/emotes';
	import { chatInput, chatEl } from '$lib/stores/chat';
	import { presets } from '$lib/stores/presets';
	import IconSelector from './IconSelector.svelte';
	import EmoteSelector from './EmoteSelector.svelte';
	import { permissions } from '$lib/stores/permissions';
	import { icons } from '$lib/stores/icons';
	import { effectStore } from '$lib/special/EffectStore';
	let lastInput = '';
	let lastKey = '';
	let tabIndex = 0;
	let tabRegex = /([^ ]+)$/g;
	let sent: Array<string> = [];
	let sentIndex = -1;
	let selectionStart = 0;
	let selectionEnd = 0;
	let spoilerMode = false;
	let beforeInput: string;
	let tabComplete = 0;

	beforeUpdate(() => {
		if ($chatEl) {
			//@ts-ignore
			({ selectionStart, selectionEnd } = $chatEl);
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
			$chatEl.setSelectionRange(selectionStart, selectionStart);
		}
		if (tabComplete) {
			$chatEl.setSelectionRange(tabComplete, tabComplete);
			tabComplete = 0;
			$chatEl.focus();
		}
		if ($chatInput.length >= 500) {
			$chatEl.style.outline = 'solid 2px red';
			$chatInput = $chatInput.substring(0, 500);
		} else {
			$chatEl.style.outline = '';
		}
		if (beforeInput !== $chatInput) $chatEl.focus();
	});
	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key == 's' && e.ctrlKey == true) {
			e.preventDefault();
		}
		if (e.key == 'Tab') {
			e.preventDefault();
			let selStart = $chatEl.selectionStart ?? 0;
			if (selStart > 0) {
				while (![undefined, ' '].includes(lastInput[selStart]) && selStart < lastInput.length) {
					selStart++;
				}
				let beforeSelTxt = lastInput.substring(0, selStart);
				let afterSelTxt = lastInput.substring(selStart);
				let beforeSelArr = beforeSelTxt.split(' ');
				let tabWordOriginal = beforeSelArr.splice(beforeSelArr.length - 1, 1)[0];
				let tabWord = tabWordOriginal.toLowerCase();
				if (tabWord?.length) {
					let matchedUsers = $users.users
						.filter((otherUser) => {
							return otherUser.username.toLowerCase().indexOf(tabWord) == 0;
						})
						.map((otherUser) => otherUser.username);
					let matchedEmotes = Object.values($emotes)
						.filter((e) => $presets.emotes[e.preset] == true)
						.map((e) => e.text)
						.filter((e) => e.toLowerCase().indexOf(tabWord) == 0);
					let matchedFilters = [];
					if ($user.accessLevel >= $permissions.postMedia) {
						let filterMatch = tabWord.match(/\S+\.\S+/);
						if (filterMatch) {
							matchedFilters.push(tabWordOriginal + ':pic');
							matchedFilters.push(tabWordOriginal + ':vid');
						}
					}
					let matched = matchedUsers.concat(matchedEmotes, matchedFilters);
					if (matched.length) {
						beforeSelTxt = beforeSelArr.join(' ') + ' ' + matched[tabIndex] + ' ';
						tabComplete = beforeSelTxt.length;
						$chatInput = beforeSelTxt + afterSelTxt;
						tabIndex++;
						if (tabIndex >= matched.length) tabIndex = 0;
					}
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
				let isCommand = false;
				let text = $chatInput.trim();
				/*for (let effect in $effectStore) {
					if (text.indexOf($effectStore[effect].command) == 0 && $user.accessLevel > 3) {
						isCommand = true;
						let arg = text.replace($effectStore[effect].command, '').trim();
						io.emit('effect', { command: 'toggle', value: effect, arg });
						break;
					}
				}
				if (!isCommand) {*/
				io.emit('message', { icon: $userSettings.icon ?? '', msg: text });
				//}
			}
			$chatInput = '';
		}
		lastKey = e.key;
	};
	onMount(() => {
		/*setInterval(()=>{
			if($user.username.includes('bot'))
				io.emit('message', { icon: $userSettings.icon ?? '', msg: Math.random().toString() });
		},1000);*/
	});

	const handleKeyUp = (e: KeyboardEvent) => {
		//console.log(e);
		if (e.key == 's' && e.ctrlKey == true) {
			spoilerMode = true;
			const { selectionStart: start, selectionEnd: end } = $chatEl;
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
	user.subscribe((e) => {
		if ($user.muted) $chatInput = '';
	});

	const handleFocus = () => {
		$tabText = '';
	};
</script>

{#if Object.keys($icons).length}
	<IconSelector />
{/if}
<input
	id="inputBar"
	placeholder={!$user.username
		? 'Enter a username (Guest)'
		: $user.muted
			? 'You are server muted'
			: ''}
	disabled={$blocker.login ||
		($user.accessLevel < $permissions.chat && $user.accessLevel >= 0) ||
		$user.muted ||
		io.disconnected}
	style:padding-right={Object.keys($emotes).length ? '2.8rem' : '10px'}
	style:padding-left={Object.keys($icons).length ? '2.8rem' : '10px'}
	bind:value={$chatInput}
	bind:this={$chatEl}
	on:keydown={handleKeyDown}
	on:keyup={handleKeyUp}
	on:focus={handleFocus}
	autocomplete="off"
/>
{#if Object.keys($emotes).length}
	<EmoteSelector />
{/if}

<style>
	#inputBar {
		padding-top: 2px;
		padding-bottom: 2px;
		border: 0;
		height: calc(100% - 4px);
		margin: 0;
		flex-grow: 1;
		flex-shrink: 1;
	}
	#inputBar:disabled {
		background: grey;
	}
</style>
