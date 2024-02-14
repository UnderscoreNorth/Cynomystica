<script lang="ts">
	import { io } from '$lib/realtime';
	import type { ScheduleItem } from '$lib/stores/schedule';
	export let changeSelectedID: Function;
	export let selectedID: ScheduleItem|null;
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
	let duration:number;
	let leeway:number;
	let freq=1440;
	let playlists:Record<string, playlistType> = {};
	io.emit('get-playlists');
    io.on('playlists',(e)=>{
        playlists = e;
    })
	if (selectedID?.id) {
		console.log(selectedID)
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
		leeway = selectedID.leeway
	} else {
		newEntry = true;
		loading = false;
	}
	const upsert = () => {
		let sendObj = {
			id,
			url,
			title,
			playtime:moment(playtime).utc().format(),
			visible,
			selectedID,
			prequeueMinutes,
			playlist,
			selection,
			snap,
			duration,
			leeway
		};
		if(bulkMode){
			sendObj.freq = freq >= 1 ? freq : 1;
			sendObj.dow = daysOfWeek
		}
		io.emit('upsert-schedule', sendObj);
		changeSelectedID(undefined);
	};
	const deleteItem = ()=>{
		io.emit('delete-schedule',{id})
		changeSelectedID(undefined);
	}
	let daysOfWeek = {
		0:['Sun',true],
		1:['Mon',true],
		2:['Tue',true],
		3:['Wed',true],
		4:['Thu',true],
		5:['Fri',true],
		6:['Sat',true],
	}
	const checkDays = (daysOfWeek)=>{
		return Object.values(daysOfWeek).every((x)=>x[1] == false)
	}
	$: disabled = ()=>{
		if(!playtime) return true;
		if (checkDays(daysOfWeek) && bulkMode) return true;
		console.log({url,playlist,duration,title},(!url && playlist && duration && title));
		if (!url && !(playlist && duration && title)) return true;
		return false;
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
		{#if !selectedID?.id}
		<tr>
			<th>Bulk Mode</th>
			<td><input type='checkbox' bind:checked={bulkMode} /></td>
		</tr>
		{/if}
		<tr>
			<th>Title</th><td>
				<input bind:value={title} disabled={loading} 
				placeholder={bulkMode ? 'use |n| for episode #' : 'Override title'}
				/></td>
		</tr>
		<tr>
			{#if bulkMode}
				<th>URLs (Seperate by<br>line and/or comma) </th>
				<td><textarea bind:value={url} disabled={loading} /></td>
			{:else}
				<th>URL</th>
				<td><input bind:value={url} disabled={loading} /></td>
			{/if}
		</tr>
		<tr>
			<th>Duration (Sec)</th>
			<td><input type="number" min=1 placeholder='Override the item length' bind:value={duration} /></td>
		</tr>
		<tr>
			<th>{bulkMode ? 'First Ep': 'Playtime'}</th>
			<td><input type="datetime-local" bind:value={playtime} disabled={loading} /></td>
		</tr>
		<tr>
			<th>Leeway (Min)</th>
			<td><input type="number" min=0 placeholder='Allow for late start' bind:value={leeway} /></td>
		</tr>
		{#if !bulkMode}
		<tr>
			<th>Finish time</th><td><input type="datetime-local" disabled bind:value={finishtime} /></td>
		</tr>
		{:else}	
		<tr>
			<th>Ep Frequency (Min)<br>1440 Min = 1 Day</th>
			<td><input type="number" min=1 bind:value={freq} placeholder={'1440 = 1 day'}/></td>
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
							<td><input type='checkbox' bind:checked={daysOfWeek[day][1]} /></td>
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
			<td colspan=2>
				<hr><small>
				Snapping - Snap item to closest item within 15 min so they start after each
				<br>other. Does not automatically resnap if the adjacent item is moved after.
				<br>Snapping after an item that has leeway can cause this item to be skipped.</small>
				<hr>
			</td>
		</tr>
		<tr>
			<th>Snap</th>
			<td>
				<input type='radio' bind:group={snap} value='none'> None
				<br><input type='radio' bind:group={snap} value='before'> Before the next item
				<br><input type='radio' bind:group={snap} value='after'> After the previous item
			</td>
		</tr>
		<tr>
			<td colspan=2>
				<hr><small>
				Playlist - If the URL is blank and a duration and title are set, the scheduled
				<br>time will be used to play the playlist. If a pre-queue is set, it will play the
				<br>playlist in the minutes before the scheduled item if there is nothing else
				<br>scheduled.</small><hr></td>
		</tr>		
		<tr>
			<th>Playlist</th>
			<td><select bind:value={playlist}>
					<option></option>
				{#each Object.values(playlists) as item}
					<option value={item.id}>{item.name}</option>
				{/each}
			</select></td>
		</tr>
		<tr>
			<th>Pre-queue<br>Minutes</th>
			<td><input type='number' step=1 bind:value={prequeueMinutes} disabled={playlist == ''}></td>
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
		margin-top: 10rem;
		border: solid 1px var(--color-bg-dark-1);
		padding: 1rem;
		height:fit-content
		
	}
	input {
		width: fit-content;
	}

</style>
