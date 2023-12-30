<script lang="ts">
	import { io } from '$lib/realtime';
	import type { ScheduleItem } from '$lib/stores/schedule';
	export let changeSelectedID: Function;
	export let selectedID: ScheduleItem|null;
	import moment from 'moment';
	let url: String;
	let title: String;
	let playtime: String | null = null;
	let visible = true;
	let finishtime: String | null = null;
	let minutes = 5;
	let selection = 'Random';
	let playlist = '';
	let id: string;
	let loading = false;
	let newEntry = false;
	if (selectedID?.id) {
		newEntry = false;
		url = selectedID.url;
		title = selectedID.title;
		finishtime = moment.utc(selectedID.finishTimeUTC).local().format('YYYY-MM-DD HH:mm:ss');
		playtime = moment.utc(selectedID.playTimeUTC).local().format('YYYY-MM-DD HH:mm:ss');
		id = selectedID.id;
		selection = selectedID.selection;
		playlist = selectedID.playlist;
		minutes = selectedID.minutes
	} else {
		newEntry = true;
		loading = false;
	}
	const upsert = () => {
		let sendObj = {
			id,
			url,
			title,
			playtime,
			visible,
			selectedID,
			minutes,
			playlist,
			selection
		};
		io.emit('upsert-schedule', sendObj);
		changeSelectedID(undefined);
	};
	const deleteItem = ()=>{
		io.emit('delete-schedule',{id})
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="modalbg"
	on:click={() => {
		changeSelectedID(undefined);
	}}
>
	<table
		id="scheduleModal"
		class='modal'
		on:click={(e) => {
			e.stopPropagation();
		}}
	>
		<tr>
			<th>URL</th><td><input bind:value={url} disabled={loading} /></td>
		</tr>
		<tr>
			<th>Title</th><td><input bind:value={title} disabled={loading} /></td>
		</tr>
		<tr>
			<th>Playtime</th>
			<td><input type="datetime-local" bind:value={playtime} disabled={loading} /></td>
		</tr>
		<tr>
			<th>Finish time</th><td><input type="datetime-local" disabled bind:value={finishtime} /></td>
		</tr>		
		<tr>
			<th>Visible</th><td><input type="checkbox" bind:checked={visible} disabled=true /></td>
		</tr>
		<tr>
			<td colspan=2>
				<hr>Filler - Queues items from a playlist to fill
				<br>the gap between scheduled items if the gap
				<br>to the previous item is below the minutes
				<br>threshold<hr></td>
		</tr>		
		<tr>
			<th>Playlist</th>
			<td><select bind:value={playlist}>
				<option value=''>None</option>
			</select></td>
		</tr>
		<tr>
			<th>Minutes</th>
			<td><input type='number' step=1 bind:value={minutes} disabled={playlist == ''}></td>
		</tr>
		<tr>
			<th>Selection</th>
			<td><select bind:value={selection} disabled={playlist == ''}>
				<option>Random</option>
				<option>Weighted</option>
			</select></td>
		</tr>
		<tr>
			<td colspan="2">
				<button on:click={upsert}>{newEntry ? 'Add' : 'Edit'}</button>
				{#if !newEntry}
				<button on:click={deleteItem}>Delete</button>
				{/if}
			</td>
		</tr>
	</table>
</div>

<style>
	#scheduleModal {
		max-width: 80vw;
		opacity: 0.9;
		margin-top: calc(50svh - 12rem);
		border: solid 1px var(--color-bg-dark-1);
		padding: 1rem;
		height:fit-content
		
	}
	input {
		width: fit-content;
	}

</style>
