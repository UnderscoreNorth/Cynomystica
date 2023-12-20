<script lang="ts">
	import { io } from '$lib/realtime';
	export let changeSelectedID: Function;
	export let selectedID: any;
	import moment from 'moment';
	let url: String;
	let title: String;
	let playtime: String | null = null;
	let leewayBefore: Number;
	let leewayAfter: Number;
	let visible: boolean;
	let finishtime: String | null = null;
	let id: string;
	let loading = false;
	let newEntry = false;
	if (selectedID.id) {
		newEntry = false;
		url = selectedID.url;
		title = selectedID.title;
		finishtime = moment.utc(selectedID.finishtime).local().format('YYYY-MM-DD HH:mm:ss');
		playtime = moment.utc(selectedID.playtime).local().format('YYYY-MM-DD HH:mm:ss');
		id = selectedID.id;
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
			leewayBefore,
			leewayAfter,
			visible,
			selectedID
		};
		io.emit('upsert-schedule', sendObj);
		changeSelectedID(null);
	};
	const deleteItem = ()=>{
		io.emit('delete-schedule',{id})
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="modalbg"
	on:click={() => {
		changeSelectedID(null);
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
			<th>Playtime</th><td
				><input type="datetime-local" bind:value={playtime} disabled={loading} /></td
			>
		</tr>
		<tr>
			<th>Finish time</th><td><input type="datetime-local" disabled bind:value={finishtime} /></td>
		</tr>
		<tr>
			<th>Leeway Before (s)</th><td
				><input type="number" bind:value={leewayBefore} disabled={loading} /></td
			>
		</tr>
		<tr>
			<th>Leeway After (s)</th><td
				><input type="number" bind:value={leewayAfter} disabled={loading} /></td
			>
		</tr>
		<tr>
			<th>Visible</th><td><input type="checkbox" bind:checked={visible} disabled={loading} /></td>
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
		max-width: 50rem;
		opacity: 0.9;
		margin-top: calc(50svh - 12rem);
		border: solid 1px var(--color-bg-dark-1);
		padding: 1rem;
		height:fit-content
	}
	input {
		width: 25rem;
	}

</style>
