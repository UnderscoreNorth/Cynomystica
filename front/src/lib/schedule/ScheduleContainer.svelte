<script lang="ts">
	import ViewSchedule from './ViewSchedule.svelte';
	import { permissions } from '$lib/stores/permissions';
	import { user } from '$lib/stores/user';
	import ScheduleModal from './ScheduleModal.svelte';
	import type { ScheduleItem } from '$lib/stores/schedule';
	import { io } from '$lib/realtime';
	let selectedID: ScheduleItem | null;
	let bulkEdit = false;
	let bulkIDs: Set<ScheduleItem> = new Set();
	let bulkMinuteShift = 0;
	const changeSelectedID = (newID: ScheduleItem | null) => {
		selectedID = newID;
	};
	import { tempSettings } from '$lib/stores/tempSettings';
	import { userSettings } from '$lib/stores/userSettings';
	import moment from 'moment';
	if ($userSettings.scheduleModalStart == null || $userSettings.scheduleModalStart == undefined) {
		$userSettings.scheduleModalStart = '00:00';
	}
	function removeMinutes() {
		$userSettings.scheduleModalStart = $userSettings.scheduleModalStart.split(':')[0] + ':00';
	}
	function recheck() {
		io.emit('recheck');
	}
	function toggleBulk() {
		bulkEdit = !bulkEdit;
		if (!bulkEdit) bulkIDs.clear();
		bulkIDs = bulkIDs;
	}
	function addRemoveID(item: ScheduleItem) {
		if (!bulkIDs.has(item)) {
			bulkIDs.add(item);
		} else {
			bulkIDs.delete(item);
		}
		bulkIDs = bulkIDs;
	}
	function shiftSelected() {
		io.emit(
			'upsert-schedule-bulk',
			Array.from(bulkIDs).map((item) => {
				let playtime = moment.utc(item.playTimeUTC).add(bulkMinuteShift, 'minutes').format();
				let snap = 'after';
				let hsl = item.hsl.join(',');
				return Object.assign(item, { snap, hsl, playtime });
			})
		);
	}
	function snapSelected() {
		io.emit(
			'upsert-schedule-bulk',
			Array.from(bulkIDs).map((item) => {
				let playtime = moment.utc(item.playTimeUTC).format();
				let snap = 'after';
				let hsl = item.hsl.join(',');
				return Object.assign(item, { snap, hsl, playtime });
			})
		);
	}
	function deleteSelected() {
		for (const item of Array.from(bulkIDs)) {
			io.emit('delete-schedule', { id: item.id });
		}
	}
</script>

{#if $user.accessLevel >= $permissions.manageSchedule}
	<button on:click={() => changeSelectedID(null)}>Add item</button>
{/if}
<button
	on:click={() => {
		$tempSettings.scheduleView = $tempSettings.scheduleView == 'calendar' ? 'list' : 'calendar';
		if ($tempSettings.scheduleView == 'list') io.emit('get-schedule', new Date());
	}}
>
	Switch to {$tempSettings.scheduleView == 'calendar' ? 'list' : 'calendar'} view
</button>
{#if $tempSettings.scheduleView == 'calendar'}
	Calendar Start <input
		type="time"
		style:max-width={'8rem'}
		step="3600"
		bind:value={$userSettings.scheduleModalStart}
		on:change={() => removeMinutes()}
	/>
{/if}
{#if $user.accessLevel >= $permissions.manageSchedule}
	<button on:click={() => toggleBulk()}>Bulk Edit {bulkEdit ? 'Off' : 'On'}</button>
{/if}
{#if bulkEdit}
	<input bind:value={bulkMinuteShift} style:width="5rem" />
	<button on:click={() => shiftSelected()}>Shift selected (minutes)</button>
	<button on:click={() => deleteSelected()}>Delete items</button>
	<button on:click={() => snapSelected()}>Snap items</button>
{/if}
<i style:float={'right'}>Schedules are shown in your device's timezone</i>
{#if $user.accessLevel >= $permissions.viewDebug}
	<button style:float={'right'} on:click={() => recheck()}>Recheck Schedule</button>
{/if}
<ViewSchedule {changeSelectedID} {bulkEdit} {addRemoveID} {bulkIDs} />
{#if $user.accessLevel >= $permissions.manageSchedule && selectedID !== undefined}
	<ScheduleModal {changeSelectedID} {selectedID} />
{/if}
