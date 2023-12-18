<script lang="ts">
	export let closeModal: Function;
	
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modalbg" on:click={closeModal()}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        class="modal"
        on:click={(e) => {
            e.stopPropagation();
        }}
    >
        <button id='closeModal' on:click={closeModal()}>X</button>
        <slot />
    </div>
</div>
<style>
    .modal {
		width: fit-content;
		max-width: 90vw;
		margin-top: 2em;
        color:white;
        max-height:calc(90vh - 2em);
        overflow-y:auto;
        overflow-x:hidden;
        position:relative;
        height:fit-content;

	}
    #closeModal{
        position:absolute;
        top:0.5rem;
        right:0.5rem;
    }
    @media (orientation:portrait) {
		.modal{
			font-size: 0.7rem;
			width:calc(100vw - 6em);
		}
	}
</style>
