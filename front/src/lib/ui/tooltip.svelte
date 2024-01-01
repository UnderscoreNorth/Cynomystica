<script lang="ts">
	export let title = '';
	let isHovered = false;
	let x: number;
	let y: number;
	let faceRight = 1;

	function mouseOver(event: MouseEvent) {
		isHovered = true;
		getCoord(event);
	}
	function mouseMove(event: MouseEvent) {
		getCoord(event);	
		
	}
	function mouseLeave() {
		isHovered = false;
	}
	function getCoord(event:MouseEvent){
		if(event.pageX + 200 > window.innerWidth){
			faceRight = -1;
			x = window.innerWidth - event.pageX;
		} else {
			faceRight = 1;
			x = event.pageX + 15;		
		}
		if(event.pageY + 50 > window.innerHeight){
			y = event.pageY - 35;
		} else {
			y = event.pageY + 15;
		}
	}
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<span on:mouseover={mouseOver} on:mouseleave={mouseLeave} on:mousemove={mouseMove}>
	<slot />
</span>
{#if isHovered}
	<div 
		style:left={faceRight == 1 ? `${x}px` : ''}
		style:right={faceRight == -1 ? `${x}px` : ''}
		style:top={`${y}px`}
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
