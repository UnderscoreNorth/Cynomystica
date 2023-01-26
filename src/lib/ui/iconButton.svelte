<script lang="ts">
	import Tooltip from '$lib/ui/tooltip.svelte';
	export let Icon: unknown;
	export let onClick: Function;
	export let tooltip: string;

	const dummy = () => {};
</script>

<Tooltip title={tooltip}>
	<div id="btn" class="svgIcon" on:click={onClick()} on:keypress={dummy}>
		<svelte:component this={Icon} />
	</div>
	<span slot="tip">{tooltip}</span>
</Tooltip>
