<script lang="ts">
	//@ts-ignore
	import MdPlayCircleOutline from 'svelte-icons/md/MdPlayCircleOutline.svelte';
	import { secondsToTime } from '$lib/utilities/timeUtilities';
	//@ts-ignore
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	import { permissions } from '$lib/stores/permissions';
	import { user } from '$lib/stores/user';

	export let item: any;
	export let deleteItem: Function;
	let innerWidth = 0;
</script>

<svelte:window bind:innerWidth />
{#if innerWidth < 768}
	<td>
		{#if $user.accessLevel >= $permissions.managePlaylist || $user.username == item.username}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="svgIcon" on:click={deleteItem(item)}>
				<MdDelete />
			</div>
		{/if}
	</td>
	<td colspan="4">
		<a
			href={(item.type == 'yt' ? `https://youtube.com/watch?v=` : ``) + item.url}
			target="_blank"
			rel="noreferrer">{item.name}</a
		>
		<br />
		{secondsToTime(item.duration)} - {item.username}
	</td>
{:else}
	<td>
		{#if $user.accessLevel >= $permissions.managePlaylist || $user.username == item.username}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="svgIcon" on:click={deleteItem(item)}>
				<MdDelete />
			</div>
		{/if}
	</td>
	<td
		><a
			href={(item.type == 'yt' ? `https://youtube.com/watch?v=` : ``) + item.url}
			target="_blank"
			rel="noreferrer">{item.name}</a
		></td
	>
	<td class="t-right">{new Date(item.startDate).toLocaleTimeString()}</td>
	<td class="t-right">{new Date(item.endDate).toLocaleTimeString()}</td>
	<td class="t-right">{secondsToTime(item.duration)}</td>
	<td class="t-right">{item.username}</td>
{/if}

<style>
	td {
		line-height: 2rem;
		color: var(--color-text-dark-1);
	}
	.t-right {
		text-align: right;
	}
</style>
