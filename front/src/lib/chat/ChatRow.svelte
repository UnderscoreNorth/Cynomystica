<script lang="ts">
	export let message: messageType;
	import { icons } from '$lib/stores/icons';
	import { bulletMode } from '$lib/stores/bulletmode';
	import { user } from '$lib/stores/user';
	//import { parseThreeGuys } from '$lib/special/theThreeGuys/parseThreeGuys';
	import { chatInput, chatEl, type messageType } from '$lib/stores/chat';
	import { tempSettings } from '$lib/stores/tempSettings';
	import { moderation } from '$lib/stores/moderation';
	import { settings } from '$lib/stores/settings';
	import { time } from '$lib/utilities/timeUtilities';
	import { permissions } from '$lib/stores/permissions';
	const getRowClasses = (msg: string) => {
		let array = [];
		array.push($bulletMode ? 'chatRow bulletMode' : 'chatRow');
		if (msg.includes($user.username) && $user.username) {
			array.push('userHighlighted');
		}
		return array.join(' ');
	};
	const getUserStyle = (icons, message) => {
		let style = '';
		if (icons[message.icon]?.color) {
			style = `color:${$icons[message.icon]?.color}`;
		}
		return style;
	};
	const parseUser = (message: any) => {
		let username = message.username;
		//username = parseThreeGuys(username);
		if ($tempSettings.anonymous) username = '';
		return username;
	};
	function clickMessage(e: MouseEvent) {
		if (e.target?.classList?.contains('emote')) {
			$chatInput += e.target?.title;
			$chatEl.focus();
		}
	}
</script>

{#if message?.username && !$moderation.ignored.map((x) => x.username).includes(message?.username)}
	<tr class={getRowClasses(message.message)}>
		<td class="chatTime">
			[{time(message.time)}]
		</td>
		<td style="width:99%;overflow-wrap:anywhere">
			{#if message.type == 'system'}
				<div class={'systemMsg ' + message.message}>
					{@html message.message}
				</div>
			{:else}
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
					{#if !$tempSettings.anonymous && $permissions.viewUsers <= $user.accessLevel}
						<span class="chatUser" style={getUserStyle($icons, message)}>
							{parseUser(message)}:
						</span>
					{/if}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span
						class="chatMsg"
						on:click={clickMessage}
						style={`--max-height:${$settings.maxImageHeight}px;--max-emote-height:${$settings.maxEmoteHeight}px`}
					>
						{@html message.message}
					</span>
				{/if}
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
		max-height: 1.25rem;
		max-width: 1.25rem;
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
	:global(.chatMsg img, .chatMsg video) {
		max-width: 100%;
		max-height: var(--max-height);
		vertical-align: middle;
	}
	.systemMsg {
		color: white;
		height: 1.5rem;
		line-height: 1.5rem;
		text-align: center;
	}
	.systemMsg.Connected {
		background: green;
	}
	.systemMsg.Disconnected {
		background: rgb(145, 0, 0);
	}
	.systemMsg.Reconnecting {
		background: rgba(156, 94, 1, 0.795);
	}
</style>
