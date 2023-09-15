<script lang="ts">
	export let closeModal: any;
    import Manage from "./Manage.svelte";
	import ViewSchedule from "./ViewSchedule.svelte";
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
			<h3>Schedule/Manage</h3>
			<hr />
			<ViewSchedule />
            <Manage />
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
