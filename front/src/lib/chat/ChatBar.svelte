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
	import {emotes} from '$lib/stores/emotes';
	import { chatInput,chatEl } from '$lib/stores/chat';
	import { presets } from '$lib/stores/presets';
	import IconSelector from './IconSelector.svelte';
	import EmoteSelector from './EmoteSelector.svelte';
	let lastInput = '';
	let lastKey = '';
	let tabIndex = 0;
	let tabRegex = /([^ ]+)$/g;
	let sent: Array<string> = [];
	let sentIndex = -1;
	let selectionStart = 0;
	let selectionEnd = 0;
	let spoilerMode = false;
	let beforeInput:string;

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
		if($chatInput.length >= 500){
			$chatEl.style.outline = 'solid 2px red';
			$chatInput = $chatInput.substring(0,500);
		} else {
			$chatEl.style.outline = ''
		}
		if(beforeInput !== $chatInput)
			$chatEl.focus();
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
				let matchedEmotes = Object.values($emotes).filter((e)=>$presets.emotes[e.preset] == true).map((e)=>e.text).filter((e)=> e.toLowerCase().indexOf(tabWord)==0)
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
				io.emit('message', { icon: $userSettings.icon ?? '', msg: $chatInput.trim() });
			}
			$chatInput = '';
		}
		lastKey = e.key;
	};
	onMount(()=>{
		/*setInterval(()=>{
			if($user.username.includes('bot'))
				io.emit('message', { icon: $userSettings.icon ?? '', msg: Math.random().toString() });
		},1000);*/
	})
	
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
	
	const handleFocus = () => {
		$tabText = '';
	};
	
</script>

<IconSelector />
<input
	id="inputBar"
	placeholder={$user.username ? '' : 'Enter a username (Guest)'}
	disabled={$blocker.login}
	bind:value={$chatInput}
	bind:this={$chatEl}
	on:keydown={handleKeyDown}
	on:keyup={handleKeyUp}
	on:focus={handleFocus}
	autocomplete="off"
/>
<EmoteSelector />
<style>	
	#inputBar {
		padding: 2px 2.8rem;
		border: 0;
		height: calc(100% - 4px);		
		margin: 0;
		flex-grow: 1;
		flex-shrink: 1;
	}
</style>
