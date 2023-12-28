<script lang="ts">
	export let title = '';
	let isHovered = false;
	let x: number;
	let y: number;
	let faceRight = 1;

	function mouseOver(event: MouseEvent) {
		isHovered = true;
		if(event.pageX + 200 > window.innerWidth){
			faceRight = -1;
			x = window.innerWidth - event.pageX + 5 * faceRight;
		} else {
			faceRight = 1;
			x = event.pageX + 5 * faceRight;		
		}
		y = event.pageY + 5;	
	}
	function mouseMove(event: MouseEvent) {
		if(event.pageX + 200 > window.innerWidth){
			faceRight = -1;
			x = window.innerWidth - event.pageX + 5 * faceRight;
		} else {
			faceRight = 1;
			x = event.pageX + 5 * faceRight;
		}
		y = event.pageY + 5;	
		
	}
	function mouseLeave() {
		isHovered = false;
	}
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div on:mouseover={mouseOver} on:mouseleave={mouseLeave} on:mousemove={mouseMove}>
	<slot />
</div>
{#if isHovered}
	<div style="top: {y}px;" 
		style:left={faceRight == 1 ? `${(x + 10)}px` : ''}
		style:right={faceRight == -1 ? `${(x - 10)}px` : ''}
	class="tooltip">{@html title}</div>
{/if}

<style>
	.tooltip {
		box-shadow: 2px 2px 2px black;
		background: var(--color-bg-4);
		opacity: 0.85;
		padding: 4px;
		position: absolute;
		z-index: 10;
		color: var(--color-fg-4);
		line-height: 1rem;
		font-size: 1rem;
	}
</style>
