<script lang="ts">
	import Tooltip from '$lib/ui/tooltip.svelte';
	export let Icon: ConstructorOfATypedSvelteComponent;
	export let onClick: Function;
	export let tooltip: string;
	export let state = false;

	const dummy = () => {};
</script>

<Tooltip title={tooltip}>
	<div id="btn" class="svgIcon {state}" on:click={onClick()} on:keypress={dummy}>
		<svelte:component this={Icon} />
	</div>
</Tooltip>
