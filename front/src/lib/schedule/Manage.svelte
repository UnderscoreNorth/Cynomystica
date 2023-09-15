<script lang='ts'>
    import { io } from '$lib/realtime';
    import ScheduleModal from './ScheduleModal.svelte';
    let modalOpen: boolean = false;
	const toggleModal = () => {
		modalOpen = !modalOpen;
	};

</script>
<button on:click={toggleModal}>Create New</button>
{#if modalOpen}
    <ScheduleModal playtime={null} />
{/if}