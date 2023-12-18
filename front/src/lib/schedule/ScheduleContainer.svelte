<script lang="ts">
	import ViewSchedule from './ViewSchedule.svelte';
	import { permissions } from '$lib/stores/permissions';
	import { user } from '$lib/stores/user';
	import ScheduleModal from './ScheduleModal.svelte';
	let selectedID: string | null = null;
	const changeSelectedID = (newID: string | null) => {
		selectedID = newID;
	};
</script>

<h3>
	Schedule
	{#if $user.accessLevel >= $permissions.schedule}
		<button on:click={() => changeSelectedID({})}>Add item</button>
	{/if}
</h3>
<hr />
<ViewSchedule {changeSelectedID} />
{#if $user.accessLevel >= $permissions.schedule && selectedID !== null}
	<ScheduleModal {changeSelectedID} {selectedID} />
{/if}
