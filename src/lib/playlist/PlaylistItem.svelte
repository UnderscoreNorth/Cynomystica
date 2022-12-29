<script lang="ts">
	import MdPlayCircleOutline from 'svelte-icons/md/MdPlayCircleOutline.svelte';
	import { secondsToTime } from '$lib/utilities/timeUtilities';
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	export let item: any;
	export let deleteItem: Function;
</script>

<tr>
	<td>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="svgIcon" on:click={deleteItem(item)}>
			<MdDelete />
		</div>
	</td>
	<td><a href={item.url} target="_blank" rel="noreferrer">{item.name}</a></td>
	<td>{item.endDate}</td>
	<td>{item.user}</td>
	<td>{secondsToTime(item.duration)}</td>
</tr>

<style>
	td {
		line-height: 2rem;
		color: var(--color-text-dark);
	}
</style>
