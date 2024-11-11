<script lang="ts">
	import { fade } from 'svelte/transition';
	export let closeModal: Function;
	export let title: string;
	export let zIndex = 2;
	export let align = 'baseline';
	export let width = 'fit-content';
	export let height = 'fit-content';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="modalbg"
	style:z-index={zIndex}
	style:align-items={align}
	transition:fade={{ duration: 50 }}
	on:click={closeModal()}
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="modal"
		on:click={(e) => {
			e.stopPropagation();
		}}
		style:height
		style:width
	>
		<div class="modalHeader">
			<h3>
				{title}
			</h3>
			<button id="closeModal" on:click={closeModal()}>X</button>
		</div>
		<hr />
		<div class="modalContents">
			<slot />
		</div>
	</div>
</div>

<style>
	.modalbg {
		padding: 2em;
		width: calc(100vw - 4em);
	}
	.modal {
		max-width: 90vw;
		color: white;
		position: relative;
		padding-top: 0;
		min-width: 20rem;
	}
	.modalHeader {
		display: flex;
		align-items: center;
	}
	.modalHeader h3 {
		flex-grow: 1;
	}
	#closeModal {
		flex-grow: 0;
		height: fit-content;
	}
	.modalContents {
		max-height: calc(90svh - 8rem);
		overflow-y: auto;
		overflow-x: hidden;
	}
	@media (orientation: portrait) {
		.modal {
			font-size: 0.7rem;
			width: calc(100vw - 6em);
			min-width: auto;
		}
		.modalbg {
			padding: 0.5rem;
			width: calc(100vw - 1em);
		}
	}
</style>
