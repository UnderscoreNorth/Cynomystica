<script lang="ts">
	import Presents from './presents/Presents.svelte';
	import MegaSnow from './megasnow/MegaSnow.svelte';
	import Wonderland from './wonderland/Wonderland.svelte';
	import { effectStore } from './EffectStore';
	import { io } from '$lib/realtime';
	io.on('effects', (e) => {
		for (let effect in e) {
			$effectStore[effect].is_on = e[effect].is_on;
			$effectStore[effect].arg_1 = e[effect].arg_1;
		}
	});
</script>

{#if $effectStore['Presents']?.is_on}
	<Presents />
{/if}
{#if $effectStore['Snow']?.is_on}
	<MegaSnow />
{/if}
{#if $effectStore['Wonderland']?.is_on}
	<Wonderland />
{/if}
