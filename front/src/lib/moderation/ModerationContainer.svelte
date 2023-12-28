<script lang="ts">
	import { user } from '$lib/stores/user';
	import { permissions } from '$lib/stores/permissions';
	import { moderation } from '$lib/stores/moderation';
	import { io } from '$lib/realtime';	
	io.emit('get-moderation');
	let filter = '';		
</script>
{#if $user.accessLevel >= $permissions.userMod}
	Filter <select bind:value={filter}>
		<option value=''>All</option>
		<option value='ignored'>Ignored</option>
		<option value='muted'>Muted</option>
		<option value='shadowMuted'>Shadow Muted</option>
		<option value='banned'>Banned</option>
		<option value='ipBanned'>IP Banned</option>
	</select>
{/if}
<table>	
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Date</th>
		{#if $user.accessLevel >= $permissions.userMod}
			<th>By</th>
		{/if}
	</tr>
	{#each Object.keys($moderation).filter((x)=>{return filter == '' || filter == x}) as type}
		{#each $moderation[type] as item}
			<tr>
				<td>{item.username}</td>
				<td>{type}</td>
				<td>{item.dateCreated}</td>
				{#if $user.accessLevel >= $permissions.userMod}
					<td>{item.byUser}</td>
				{/if}
			</tr>
		{/each}
	{/each}
</table>
<hr>
<button>Clear All</button>
<style>
	.tabHeader{
        padding:0 5px;
        cursor: pointer;
    }
    .tabHeader.selected{
        cursor:default;
        font-weight: bold;
        border-radius: 2px 2px 0 0;
    }
	.viewButton {
		cursor: pointer;
	}
</style>
