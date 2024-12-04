<script lang="ts">
	import { scheduleDebug } from '$lib/stores/scheduleDebug';
</script>

<table>
	{#each $scheduleDebug as item}
		<tr>
			<td rowspan={item.status['ID'] !== 'ID Already included' ? 4 : 1}>{item.item.title}</td>
			<td>{item.status['ID']}</td>
		</tr>
		{#if item.status['ID'] !== 'ID Already included'}
			<tr>
				<td
					>{item.status['Time Til'].diff} - {item.item.leeway} * 60 = {item.status['Time Til']
						.diff -
						item.item.leeway * 60} > 0
				</td>
			</tr>
			<tr>
				<td>
					{item.status['Time Til'].duration} == -1 &&
					{item.status['Time Til'].timeToNow}
					{'<'} 1
				</td>
			</tr>
			<tr>
				<td>
					15 + {item.item.leeway} * 60 =
					{15 + item.item.leeway * 60}
					{'<='}
					{item.status['Time Til'].diff}
				</td>
			</tr>
		{/if}
	{/each}
</table>

<style>
	td {
		padding: 5px;
	}
</style>
