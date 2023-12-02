<script lang="ts">
	import { permissions } from '$lib/stores/permissions';
	import PlaylistItem from './PlaylistItem.svelte';
	import { playlist } from '$lib/stores/playlist';
	import { io } from '$lib/realtime';
	import { user } from '$lib/stores/user';
	import SortableItems from '$lib/utilities/SortableItems.svelte';
	export let closeModal: Function;
	let mediaURL: string;
	let queueNextDisabled = false;
	let hoverIndex:number;
	const queueNext = async () => {
		if(mediaURL){
			let duration: number = 0;
		io.emit('queue-next', mediaURL);
		//queueNextDisabled = true;
		mediaURL = '';
		}
	};
	const deleteItem = async (playlistItem: PlaylistItem) => {
		io.emit('delete-item', playlistItem);
	};
	let innerWidth = 0;	
	const updatePlaylist = ()=>{
		console.log(25);
	if( $user.accessLevel >= 3)
		io.emit('update-playlist',$playlist);
	}
</script>
<svelte:window bind:innerWidth />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modalbg" on:click={closeModal()}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id="playlistContainer">
		<span
			class="modal"
			on:click={(e) => {
				e.stopPropagation();
			}}
		>
			<h3>
				Playlist 
				<input bind:value={mediaURL} 
				placeholder={
					$user.accessLevel == -1 && $permissions.queuePlaylist > -1 ? 'Login required' : (
					$user.accessLevel < $permissions.queuePlaylist ? 'Insufficient Permission': '')}
				/>
				<button on:click={queueNext} disabled={queueNextDisabled || $user.accessLevel < $permissions.queuePlaylist} >Queue Next</button>
			</h3>
			<hr />
			<div id='tableContainer'>
				<table>
					{#if innerWidth > 768}
					<tr>
						<th style='width:5rem'>Controls</th>
						<th>Item</th>
						<th style='width:7rem'>Start</th>
						<th style='width:7rem'>Finish</th>
						<th style='width:5rem'>Duration</th>
						<th style='width:5rem'>Added By</th>
					</tr>
					{/if}
					{#each $playlist as item,i}
						{#if $user.accessLevel >= 3}
							<SortableItems class={`dragRows ${hoverIndex === i ? 'classHovered' : ''}`}
								propItemNumber={i}
								bind:propData={$playlist}
								bind:propHoveredItemNumber={hoverIndex}
								dropCallback={()=>{updatePlaylist()}}
							>
							<PlaylistItem {item} {deleteItem} />
							</SortableItems>
						{:else}
							<tr><PlaylistItem {item} {deleteItem} /></tr>
						{/if}
					{/each}
				</table>
			</div>
		</span>
	</div>
</div>

<style>
	#playlistContainer {
		width: 80vw;
		max-width: 80em;
		margin-top: 2em;
	}
	:global(.dragRows){
		display:table-row;
	}
	:global(.classHovered){
		background:var(--color-bg-dark-1);
	}
	table th {
		color: var(--color-text-dark);
		position:sticky;
		top:0;
	}
	table{
		width:100%;
	}
	#tableContainer{
		max-height:60vh;
		width:100%;
		overflow-y: scroll;
	}
	@media only screen and (max-width: 768px) {
		#playlistContainer{
			font-size: 0.7rem;
			width:calc(100vw - 6em);
		}
	}
</style>
