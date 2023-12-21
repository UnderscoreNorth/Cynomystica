<script lang="ts">
	import ViewSchedule from './ViewSchedule.svelte';
	import { permissions } from '$lib/stores/permissions';
	import { user } from '$lib/stores/user';
	import ScheduleModal from './ScheduleModal.svelte';
	import type {ScheduleItem} from '$lib/stores/schedule';
	let selectedID: ScheduleItem | null = null;
	const changeSelectedID = (newID: ScheduleItem | null) => {
		selectedID = newID;
	};
</script>

{#if $user.accessLevel >= $permissions.schedule}
		<button on:click={() => changeSelectedID({})}>Add item</button>
	{/if}
<ViewSchedule {changeSelectedID} />
{#if $user.accessLevel >= $permissions.schedule && selectedID !== null}
	<ScheduleModal {changeSelectedID} {selectedID} />
{/if}
