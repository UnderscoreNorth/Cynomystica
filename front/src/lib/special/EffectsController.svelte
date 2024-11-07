<script lang="ts">
	import { effectStore } from './EffectStore';
	import { io } from '$lib/realtime';
	import IconButton from '$lib/ui/iconButton.svelte';
	//@ts-ignore
	import IoMdSnow from 'svelte-icons/io/IoMdSnow.svelte';
	//@ts-ignore
	import GiPresent from 'svelte-icons/gi/GiPresent.svelte';
	//@ts-ignore
	import GiPineTree from 'svelte-icons/gi/GiPineTree.svelte';
	function toggle(effect: string) {
		io.emit('effect', { command: 'toggle', value: effect });
	}
	const icons: Record<string, any> = {
		Presents: GiPresent,
		Snow: IoMdSnow,
		Wonderland: GiPineTree
	};
</script>

<div>
	{#each Object.keys($effectStore) as effectName}
		<IconButton
			Icon={icons[effectName]}
			onClick={() => {
				toggle(effectName);
			}}
			state={$effectStore[effectName].is_on}
			tooltip={effectName + ' ' + ($effectStore[effectName].is_on ? 'Off' : 'On')}
		/>
	{/each}
</div>

<style>
	div {
		display: flex;
	}
</style>
