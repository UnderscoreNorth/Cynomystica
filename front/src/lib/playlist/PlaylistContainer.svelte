<script lang="ts">
	import { onMount } from 'svelte';
	import PlaylistItem from './PlaylistItem.svelte';
	import { playlist } from '$lib/stores/playlist';
	import { io } from '$lib/realtime';
	import { user } from '$lib/stores/user';
	export let closeModal: Function;
	let items: Array<object> = [];
	let currentIndex: number = 0;
	let mediaURL: string;
	let queueNextDisabled = false;

	const queueNext = async () => {
		let duration: number = 0;
		io.emit('queue-next', mediaURL);
		//queueNextDisabled = true;
	};
	const deleteItem = async (playlistItem: PlaylistItem) => {
		io.emit('delete-item', playlistItem);
	};
	onMount(async () => {
		playlist.subscribe((value) => {
			items = value;
		});
	});
</script>

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
			<h3>Playlist</h3>
			<hr />
			<input bind:value={mediaURL} />
			<button on:click={queueNext} disabled={queueNextDisabled || $user.accessLevel < 0}>Queue Next</button>
			<table>
				<tr>
					<th>Controls</th><th>Item</th><th>End Date</th><th>Added By</th><th>Duration</th>
				</tr>
				{#each items as item}
					<PlaylistItem {item} {deleteItem} />
				{/each}
			</table>
		</span>
	</div>
</div>

<style>
	#playlistContainer {
		width: 80vw;
		max-width: 80em;
		margin-top: 2em;
	}
	table th {
		color: var(--color-text-dark);
	}
	table{
		width:100%;
	}
</style>
