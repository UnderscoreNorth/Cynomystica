<script lang="ts">
	import { permissions } from '$lib/stores/permissions';
	import PlaylistItem from './PlaylistItem.svelte';
	import { queue } from '$lib/stores/queue';
	import { io } from '$lib/realtime';
	import { user } from '$lib/stores/user';
	import SortableItems from '$lib/utilities/SortableItems.svelte';
	import Playlists from './Playlists.svelte';
	let mediaURL: string;
	let title:string;
	let permanent= false;
	let queueNextDisabled = false;
	let hoverIndex: number;
	let selectedTab = 'Live Queue';
	let tabs = ['Live Queue','Playlists'];
	const queueNext = async () => {
		if (mediaURL) {
			io.emit('queue-next', {mediaURL,title,permanent});
			mediaURL = '';
			title = '';
		}
	};
	const queueLast = async () => {
		if (mediaURL) {
			io.emit('queue-last',{mediaURL,title,permanent});
			mediaURL = '';
			title = '';
		}
	};
	const deleteItem = async (playlistItem: PlaylistItem) => {
		io.emit('delete-item', playlistItem);
	};
	let innerWidth = 0;
	const updatePlaylist = () => {
		$queue = $queue.filter((x)=>x !== null)
		if ($user.accessLevel >= $permissions.manageQueue) io.emit('update-playlist', $queue);
	};
</script>

<svelte:window bind:innerWidth />
{#each tabs as tab}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span 
        class={'tabHeader' + (tab==selectedTab ? ' selected' : '')}
        on:click={()=>selectedTab=tab}
    >{tab}</span>
{/each}
<hr>
{#if selectedTab == 'Live Queue'}
<div id='playlistControlContainer'>
	<input 
		bind:value={title}
		placeholder="Title Override"
	/>
	<div>
		<input type='checkbox' bind:checked={permanent}>
		Permanent
	</div>
	<button
		on:click={queueNext}
		disabled={queueNextDisabled || $user.accessLevel < $permissions.queueNext}
		>Queue Next</button
	>
	<input
		bind:value={mediaURL}
		placeholder={'URL/iframe'}
	/>
	<button
	on:click={queueLast}
	disabled={$user.accessLevel < $permissions.queueLast}
	>Queue Last</button>
</div>
<div id="tableContainer">
	<table>
		{#if innerWidth > 768}
			<tr>
				<th style="width:5rem">Controls</th>
				<th>Item</th>
				<th style="width:7rem">Start</th>
				<th style="width:7rem">Finish</th>
				<th style="width:5rem">Duration</th>
				<th style="width:5rem">Added By</th>
			</tr>
		{/if}
		<tbody id='playlistBody'>
			{#each $queue as item, i}
				{#if $user.accessLevel >= $permissions.manageQueue}
					<SortableItems
						class={`dragRows ${(hoverIndex === i ? 'classHovered' : '') + ' ' + (item.permanent ? 'permanent' : 'temporary')}`}
						propItemNumber={i}
						bind:propData={$queue}
						bind:propHoveredItemNumber={hoverIndex}
						dropCallback={() => {
							updatePlaylist();
						}}
					>
						<PlaylistItem {item} {deleteItem} />
					</SortableItems>
				{:else}
					<tr class={item.permanent ? 'permanent' : 'temporary'}><PlaylistItem {item} {deleteItem} /></tr>
				{/if}
			{/each}
		</tbody>
		
	</table>
</div>
{:else}
<Playlists/>
{/if}


<style>
	:global(#playlistBody>*){
		border-bottom:solid 1px white;
		border-top:solid 1px white;
	}
	:global(.dragRows) {
		display: table-row;
	}
	:global(.dragRows) {
		display: table-row;
	}
	:global(.classHovered) {
		background: var(--color-bg-2);
	}
	#playlistControlContainer{
		display:grid;
		grid-template-columns: 1fr 7rem 7rem;
		grid-template-rows: 1fr 1fr;
		grid-column-gap: 5px;
		grid-row-gap:5px
	}
	#playlistControlContainer>*:nth-child(1) { grid-area: 1 / 1 / 2 / 2; }
	#playlistControlContainer>*:nth-child(2) { grid-area: 1 / 2 / 2 / 3; }
	#playlistControlContainer>*:nth-child(3) { grid-area: 1 / 3 / 2 / 4; }
	#playlistControlContainer>*:nth-child(4) { grid-area: 2 / 1 / 3 / 3; }
	#playlistControlContainer>*:nth-child(5) { grid-area: 2 / 3 / 3 / 4; }
	table th {
		color: var(--color-fg-1);
		position: sticky;
		top: 0;
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	#tableContainer {
		max-height: 60svh;
		width: 100%;
		overflow-y: auto;
	}
	:global(#playlistBody .permanent){
		
	}
	:global(#playlistBody .temporary){
		background: repeating-linear-gradient(
			45deg,
			rgba(255, 255, 255, 0),
			rgba(255, 255, 255, 0) 10px,
			rgba(255, 255, 255, 0.1) 10px,
			rgba(255, 255, 255, 0.1) 20px
			);
	}
	.tabHeader{
        padding:0 5px;
        cursor: pointer;
    }
    .tabHeader.selected{
        cursor:default;
        font-weight: bold;
        border-radius: 2px 2px 0 0;
    }
</style>
