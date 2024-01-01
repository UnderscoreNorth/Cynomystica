<script lang="ts">
	import { permissions } from '$lib/stores/permissions';
	import PlaylistItem from './PlaylistItem.svelte';
	import { playlist } from '$lib/stores/playlist';
	import { io } from '$lib/realtime';
	import { user } from '$lib/stores/user';
	import SortableItems from '$lib/utilities/SortableItems.svelte';
	let mediaURL: string;
	let title:string;
	let permanent= false;
	let queueNextDisabled = false;
	let hoverIndex: number;
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
		if ($user.accessLevel >= $permissions.managePlaylist) io.emit('update-playlist', $playlist);
	};
</script>

<svelte:window bind:innerWidth />
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
			{#each $playlist as item, i}
				{#if $user.accessLevel >= $permissions.managePlaylist}
					<SortableItems
						class={`dragRows ${(hoverIndex === i ? 'classHovered' : '') + ' ' + (item.permanent ? 'permanent' : 'temporary')}`}
						propItemNumber={i}
						bind:propData={$playlist}
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
</style>
