<script lang="ts">
	import ViewSchedule from './ViewSchedule.svelte';
	import { permissions } from '$lib/stores/permissions';
	import { user } from '$lib/stores/user';
	import ScheduleModal from './ScheduleModal.svelte';
	import type {ScheduleItem} from '$lib/stores/schedule';
	let selectedID: ScheduleItem | null;
	const changeSelectedID = (newID: ScheduleItem | null) => {
		selectedID = newID;
	};
	import { tempSettings } from '$lib/stores/tempSettings';
</script>

{#if $user.accessLevel >= $permissions.manageSchedule}
	<button on:click={() => changeSelectedID(null)}>Add item</button>
{/if}
<button on:click={()=>$tempSettings.scheduleView = ($tempSettings.scheduleView == 'calendar' ? 'list' : 'calendar')}>
	Switch to {$tempSettings.scheduleView == 'calendar' ? 'list' : 'calendar'} view
</button>
<ViewSchedule {changeSelectedID} />
{#if $user.accessLevel >= $permissions.manageSchedule && selectedID !== undefined}
	<ScheduleModal {changeSelectedID} {selectedID} />
{/if}
