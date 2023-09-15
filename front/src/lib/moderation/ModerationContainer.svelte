<script lang="ts">
	export let closeModal: any;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modalbg" on:click={closeModal()}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id="moderationContainer">
		<span
			class="modal"
			on:click={(e) => {
				e.stopPropagation();
			}}
		>
			<h3>Ignored Users/Muted Users/Shadow Muted Users</h3>
			<hr />
			<button>Clear All</button>
		</span>
	</div>
</div>

<style>
	#moderationContainer {
		width: 80vw;
		max-width: 80em;
		margin-top: 2rem;
	}
</style>
