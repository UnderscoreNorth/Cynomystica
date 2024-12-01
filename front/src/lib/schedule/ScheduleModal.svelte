<script lang="ts">
	import { io } from '$lib/realtime';
	import type { ScheduleItem } from '$lib/stores/schedule';
	export let changeSelectedID: Function;
	export let selectedID: ScheduleItem | null;
	import { dateTimeSeconds } from '$lib/utilities/timeUtilities';
	import type { playlistType } from '$lib/stores/playlists';
	import moment from 'moment';
	let url: String;
	let title: String;
	let playtime: string | null = null;
	let visible = true;
	let finishtime: String | null = null;
	let prequeueMinutes = 5;
	let selection = 'Random';
	let playlist = '';
	let id: string;
	let loading = false;
	let newEntry = false;
	let bulkMode = false;
	let snap = 'none';
	let duration: number;
	let leeway = 1;
	let freq = 1;
	let playlists: Record<string, playlistType> = {};
	let hsl = '#000000';
	io.emit('get-playlists');
	io.on('playlists', (e) => {
		playlists = e;
	});
	if (selectedID?.id) {
		console.log(selectedID);
		newEntry = false;
		url = selectedID.url;
		title = selectedID.title;
		finishtime = dateTimeSeconds(selectedID.finishTimeUTC);
		playtime = dateTimeSeconds(selectedID.playTimeUTC);
		id = selectedID.id;
		selection = selectedID.selection;
		playlist = selectedID.playlist;
		prequeueMinutes = selectedID.prequeueMinutes;
		visible = selectedID.visible;
		duration = selectedID.duration;
		leeway = selectedID.leeway;
		hsl = hslToRgb(selectedID.hsl);
	} else {
		newEntry = true;
		loading = false;
	}
	function hslToRgb(arr: [number | string, string | number, number | string]) {
		let [h, s, l] = arr;

		let r, g, b;
		if (typeof h == 'string') h = parseFloat(h);
		if (typeof s == 'string') s = parseFloat(s);
		if (typeof l == 'string') l = parseFloat(l);
		l /= 100;
		const a = (s * Math.min(l, 1 - l)) / 100;
		const f = (n) => {
			const k = (n + h / 30) % 12;
			const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
			return Math.round(255 * color)
				.toString(16)
				.padStart(2, '0'); // convert to Hex and prefix "0" if needed
		};
		return `#${f(0)}${f(8)}${f(4)}`;
	}

	function hexToHSL(hex: string) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) as string[];
		let r = parseInt(result[1], 16);
		let g = parseInt(result[2], 16);
		let b = parseInt(result[3], 16);
		(r /= 255), (g /= 255), (b /= 255);
		let max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		let h,
			s,
			l = (max + min) / 2;
		if (max == min) {
			h = s = 0; // achromatic
		} else {
			let d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}
		return [Math.round(h * 360), Math.round(s * 100) + '%', Math.round(l * 100) + '%'].join(',');
	}

	const upsert = () => {
		let sendObj = {
			id,
			url,
			title,
			playtime: moment(playtime).utc().format(),
			visible,
			selectedID,
			prequeueMinutes,
			playlist,
			selection,
			snap,
			duration,
			leeway,
			hsl: hexToHSL(hsl)
		};
		if (bulkMode) {
			sendObj.freq = freq >= 1 ? freq : 1;
			sendObj.dow = daysOfWeek;
		}
		io.emit('upsert-schedule', sendObj);
		changeSelectedID(undefined);
	};
	const deleteItem = () => {
		io.emit('delete-schedule', { id });
		changeSelectedID(undefined);
	};
	let daysOfWeek = {
		0: ['Sun', true],
		1: ['Mon', true],
		2: ['Tue', true],
		3: ['Wed', true],
		4: ['Thu', true],
		5: ['Fri', true],
		6: ['Sat', true]
	};
	const checkDays = (daysOfWeek) => {
		return Object.values(daysOfWeek).every((x) => x[1] == false);
	};
	$: disabled = () => {
		if (!playtime) return true;
		if (checkDays(daysOfWeek) && bulkMode) return true;
		return false;
	};
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
		class="modal"
		on:click={(e) => {
			e.stopPropagation();
		}}
	>
		{#if !selectedID?.id}
			<tr>
				<th>Bulk Mode</th>
				<td><input type="checkbox" bind:checked={bulkMode} /></td>
			</tr>
		{/if}
		<tr>
			<th>Title</th><td>
				<input
					bind:value={title}
					disabled={loading}
					placeholder={bulkMode ? 'use |n| for episode #' : 'Override title'}
				/></td
			>
		</tr>
		<tr>
			{#if bulkMode}
				<th>URLs (Seperate by<br />line and/or comma) </th>
				<td><textarea bind:value={url} disabled={loading} /></td>
			{:else}
				<th>URL</th>
				<td><input bind:value={url} disabled={loading} /></td>
			{/if}
		</tr>
		<tr>
			<th>Duration (Sec)</th>
			<td
				><input
					type="number"
					min="1"
					placeholder="Override the item length"
					bind:value={duration}
				/></td
			>
		</tr>
		<tr>
			<th>{bulkMode ? 'First Ep' : 'Playtime'}</th>
			<td><input type="datetime-local" bind:value={playtime} disabled={loading} /></td>
		</tr>
		<tr>
			<th>Leeway (Min)</th>
			<td><input type="number" min="0" placeholder="Allow for late start" bind:value={leeway} /></td
			>
		</tr>
		{#if !bulkMode}
			<tr>
				<th>Finish time</th><td><input type="datetime-local" disabled bind:value={finishtime} /></td
				>
			</tr>
		{:else}
			<tr>
				<th>Eps/Day</th>
				<td><input type="number" min="1" bind:value={freq} /></td>
			</tr>
			<tr>
				<th>Days of week</th>
				<td>
					<table>
						<tr>
							{#each Object.keys(daysOfWeek) as day}
								<td>{daysOfWeek[day][0]}</td>
							{/each}
						</tr>
						<tr>
							{#each Object.keys(daysOfWeek) as day}
								<td><input type="checkbox" bind:checked={daysOfWeek[day][1]} /></td>
							{/each}
						</tr>
					</table>
				</td>
			</tr>
		{/if}
		<tr>
			<th>Visible</th><td><input type="checkbox" bind:checked={visible} disabled={loading} /></td>
		</tr>
		<tr>
			<th>Colour</th><td
				><input type="color" style:width={'2rem'} bind:value={hsl} disabled={loading} /></td
			>
		</tr><tr>
			<td colspan="2">
				<hr />
				<small>
					Snapping - Snap item to closest item within 15 min so they start after each
					<br />other. Does not automatically resnap if the adjacent item is moved after.
					<br />Snapping after an item that has leeway can cause this item to be skipped.</small
				>
				<hr />
			</td>
		</tr>
		<tr>
			<th>Snap</th>
			<td>
				<input type="radio" bind:group={snap} value="none" /> None
				<br /><input type="radio" bind:group={snap} value="before" /> Before the next item
				<br /><input type="radio" bind:group={snap} value="after" /> After the previous item
			</td>
		</tr>
		<tr>
			<td colspan="2">
				<hr />
				<small>
					Playlist - If a pre-queue is set, it will play the playlist in the minutes before
					<br />the scheduled item if there is nothing else scheduled.</small
				>
				<hr /></td
			>
		</tr>
		<tr>
			<th>Playlist</th>
			<td
				><select bind:value={playlist}>
					<option></option>
					{#each Object.values(playlists) as item}
						<option value={item.id}>{item.name}</option>
					{/each}
				</select></td
			>
		</tr>
		<tr>
			<th>Pre-queue<br />Minutes</th>
			<td
				><input type="number" step="1" bind:value={prequeueMinutes} disabled={playlist == ''} /></td
			>
		</tr>
		<tr>
			<td colspan="2">
				<button disabled={disabled()} on:click={upsert}>{newEntry ? 'Add' : 'Edit'}</button>
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
		margin-top: 3rem;
		border: solid 1px var(--color-bg-dark-1);
		padding: 1rem;
		max-height: calc(100vh - 6rem);
		overflow-y: auto;
	}
	input {
		width: fit-content;
	}
</style>
