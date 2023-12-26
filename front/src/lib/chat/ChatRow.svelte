<script lang="ts">
	export let message: any;
	import { icons } from '$lib/stores/icons';
	import { bulletMode } from '$lib/stores/bulletmode';
	import { user } from '$lib/stores/user';
	import { parseThreeGuys } from '$lib/special/theThreeGuys/parseThreeGuys';
	import {chatInput } from '$lib/stores/chat';
	import { tempSettings } from '$lib/stores/tempSettings';
	const getRowClasses = (msg: string) => {
		let array = [];
		array.push($bulletMode ? 'chatRow bulletMode' : 'chatRow');
		if (msg.includes($user.username) && $user.username) {
			array.push('userHighlighted');
		}
		return array.join(' ');
	};
	const getUserStyle = (icons,message) => {
		let style = '';
		if (icons[message.icon]?.color) {
			style = `color:${$icons[message.icon]?.color}`;
		}
		return style;
	};
	const parseUser = (message:any) => {
		let username = message.username;
		username = parseThreeGuys(username);
		if ($tempSettings.anonymous) username = '';
		return username;
	};
	function clickMessage(e:PointerEvent){
		if(e.target?.classList?.contains('emote')){
			$chatInput += e.target?.title;
		}
	}
</script>
{#if message?.username}
	<tr class={getRowClasses(message.message)}>
		<td class="chatTime">
			[{new Date(message.time).toLocaleTimeString('en-UK', { hour12: false })}]
		</td>
		<td style="width:99%;overflow-wrap:anywhere">
			<span class="chatIcon">
				{#if message.icon && $icons[message.icon]?.url}
					<img src={$icons[message.icon].url} alt="icon" title={$icons[message.icon].display} />
				{/if}
			</span>
			{#if message.message.indexOf('/me ') == 0}
				<span class="actiontext">
					{parseUser(message)}
					{@html message.message.substring(4)}
				</span>
			{:else}
				{#if !$tempSettings.anonymous}
					<span class="chatUser" style={getUserStyle($icons,message)}>
						{parseUser(message)}: 
					</span>
				{/if}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<span class="chatMsg" on:click={clickMessage}>
					{@html message.message}
				</span>
			{/if}
		</td>
	</tr>
{/if}

<style>
	.chatUser {
		text-align: right;
		font-weight: bold;
	}
	.chatMsg {
		width: 100%;
	}
	.chatIcon {
		padding-left: 2px;
	}
	.chatIcon img {
		height: 1.25rem;
		width: 1.25rem;
		margin-bottom: -0.125rem;
	}
	.chatTime {
		font-size: 0.6em;
		padding-left: 5px;
		padding-right: 5px;
		border-right: 1px solid var(--color-bg-2);
	}
	.userHighlighted {
		color: white;
	}
	:global(.chatMsg img) {
		max-width: 100%;
		max-height: 30svh;
		vertical-align: middle;
	}
</style>
