<script lang="ts">
	export let closeModal: any;
	import { user } from '$lib/stores/user';
	interface viewType {
		name: string;
		minLevel: number;
		function: string;
	}
	let views = [
		{
			name: 'Ignored Users',
			minLevel: 1,
			function: ''
		},
		{
			name: 'Muted Users',
			minLevel: 2,
			function: ''
		},
		{
			name: 'Shadowmuted Users',
			minLevel: 2,
			function: ''
		}
	];
	let allowedViews: Array<viewType> = [];
	let selectedView = 'Ignored Users';
	user.subscribe((currentUser) => {
		allowedViews = [];
		for (let view of views) {
			if (currentUser.accessLevel >= view.minLevel) allowedViews.push(view);
		}
	});
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
			{#if $user.accessLevel < 1}
				<h3>A registered account is required</h3>
			{:else}
				<h3>
					{#each allowedViews as view}
						<span
							on:click={() => {
								selectedView = view.name;
							}}
							class="viewButton {view.name == selectedView && 'selected'}">{view.name}</span
						>
					{/each}
				</h3>
				<hr />
				<button>Clear All</button>
			{/if}
		</span>
	</div>
</div>

<style>
	#moderationContainer {
		width: 80vw;
		max-width: 80em;
		margin-top: 2rem;
	}
	.viewButton {
		cursor: pointer;
	}
	.selected {
		text-decoration: underline;
	}
</style>
