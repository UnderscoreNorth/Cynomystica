<script lang="ts">
	export let closeModal: Function;
	export let title:string;
	export let zIndex = 1;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modalbg" style={`z-index:${zIndex}`} on:click={closeModal()}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="modal"
		on:click={(e) => {
			e.stopPropagation();
		}}
	>
		<div class='modalHeader'>
			<h3>
				{title}
			</h3>
			<button id="closeModal" on:click={closeModal()}>X</button>
		</div>
		<hr>
		<div class='modalContents'>
			<slot />
		</div>
	</div>
</div>

<style>
	.modal {
		width: fit-content;
		max-width: 90vw;
		margin-top: 2em;
		color: white;
		position: relative;
		height: fit-content;
		padding-top:0;
	}
	.modalHeader{
		display:flex;		
		align-items: center;
	}
	.modalHeader h3{
		flex-grow: 1;
	}
	#closeModal{
		flex-grow: 0;
		height: fit-content;
	}
	.modalContents{
		max-height: calc(90svh - 4rem);
		overflow-y: auto;
		overflow-x: hidden;
	}
	@media (orientation: portrait) {
		.modal {
			font-size: 0.7rem;
			width: calc(100vw - 6em);
		}
	}
</style>
