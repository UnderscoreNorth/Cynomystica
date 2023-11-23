<script lang="ts">
	import { userSettings } from '$lib/stores/userSettings';
	import Video from './Video.svelte';
</script>

<div id="videoContainer" style='width:100%'><Video /></div>

<style>
	#videoContainer {
		background: black;
		height:100%;
		display: inline-block;
		vertical-align: top;
	}
</style>
