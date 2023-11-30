<script lang="ts">
	export let closeModal: any;
	import ViewSchedule from "./ViewSchedule.svelte";
	import { permissions } from "$lib/stores/permissions";
	import { user } from "$lib/stores/user";
	import ScheduleModal from "./ScheduleModal.svelte";
	let selectedID:string|null = null;
	const changeSelectedID = (newID:string|null)=>{
		selectedID = newID;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modalbg" on:click={closeModal()}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id="scheduleContainer">
		<span
			class="modal"
			on:click={(e) => {
				e.stopPropagation();
			}}
		>
			<h3>Schedule 
				{#if $user.accessLevel >= $permissions.schedule}
					<button on:click={()=>changeSelectedID("0")} >Add item</button>
				{/if}
			</h3>
			<hr />
			<ViewSchedule {changeSelectedID}/>
			{#if $user.accessLevel >= $permissions.schedule && selectedID !== null}
				<ScheduleModal {changeSelectedID} {selectedID} />
			{/if}
		</span>
	</div>
</div>

<style>
	#scheduleContainer {
		width: 80vw;
		max-width: 80em;
		margin-top: 2rem;
	}
</style>
