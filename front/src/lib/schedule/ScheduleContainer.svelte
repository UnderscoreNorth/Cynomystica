<script lang="ts">
	import ViewSchedule from './ViewSchedule.svelte';
	import { permissions } from '$lib/stores/permissions';
	import { user } from '$lib/stores/user';
	import ScheduleModal from './ScheduleModal.svelte';
	import type { ScheduleItem } from '$lib/stores/schedule';
	import { io } from '$lib/realtime';
	let selectedID: ScheduleItem | null;
	const changeSelectedID = (newID: ScheduleItem | null) => {
		selectedID = newID;
	};
	import { tempSettings } from '$lib/stores/tempSettings';
	import { userSettings } from '$lib/stores/userSettings';
	if ($userSettings.scheduleModalStart == null || $userSettings.scheduleModalStart == undefined) {
		$userSettings.scheduleModalStart = '00:00';
	}
	function removeMinutes() {
		$userSettings.scheduleModalStart = $userSettings.scheduleModalStart.split(':')[0] + ':00';
	}
	function recheck() {
		io.emit('recheck');
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
<i style:float={'right'}>Schedules are shown in your device's timezone</i>
{#if $user.accessLevel >= $permissions.viewDebug}
	<button style:float={'right'} on:click={() => recheck()}>Recheck Schedule</button>
{/if}
{#if $tempSettings.scheduleView == 'calendar'}
	Calendar Start <input
		type="time"
		style:max-width={'8rem'}
		step="3600"
		bind:value={$userSettings.scheduleModalStart}
		on:change={() => removeMinutes()}
	/>
{/if}
<ViewSchedule {changeSelectedID} />
{#if $user.accessLevel >= $permissions.manageSchedule && selectedID !== undefined}
	<ScheduleModal {changeSelectedID} {selectedID} />
{/if}
