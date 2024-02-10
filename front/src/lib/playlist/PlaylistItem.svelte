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
	const getURL = (type:string, url:string)=>{
		if(type =='iframe')
			return '';
		let provider = '';
		if(type == 'yt' || type=='ytlive')
			provider = 'https://youtube.com/watch?v=';
		if(type == 'tw_live')
			provider = 'https://twitch.tv/';
		return provider + url;
	}
</script>

<svelte:window bind:innerWidth />
{#if innerWidth < 768}
	<td>
		{#if $user.accessLevel >= $permissions.manageQueue || $user.username == item.username}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="svgIcon" on:click={deleteItem(item)}>
				<MdDelete />
			</div>
		{/if}
	</td>
	<td colspan="4">
		{#if getURL(item.type,item.url)}
			<a
				href={getURL(item.type,item.url)}
				target="_blank"
				rel="noreferrer">{item.name}</a
			>
		{:else}
			{item.name}
		{/if}
		<br />
		{secondsToTime(item.duration)} - {item.username}
		<span style:float='right'>{new Date(item.endDate).toLocaleTimeString()}</span>
	</td>
{:else}
	<td class='t-mid'>
		{#if $user.accessLevel >= $permissions.manageQueue || $user.username == item.username}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="svgIcon" on:click={deleteItem(item)}>
				<MdDelete />
			</div>
		{/if}
	</td>
	<td>
		{#if getURL(item.type,item.url)}
		<a href={getURL(item.type,item.url)}
			target="_blank"
			rel="noreferrer">{item.name}
		</a>
	{:else}
		{item.name}
	{/if}</td
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
	.t-mid{
		text-align: center;
	}
	.t-right {
		text-align: right;
	}
	.svgIcon{
		display:inline-block;
	}
</style>
