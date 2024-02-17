<script lang="ts">
	import { user } from '$lib/stores/user';
	import { permissions } from '$lib/stores/permissions';
	import { moderation, type ModerationItem } from '$lib/stores/moderation';
	import { io } from '$lib/realtime';
	//@ts-ignore
	import MdDelete from 'svelte-icons/md/MdDelete.svelte';
	import { dateTime } from '$lib/utilities/timeUtilities';
	console.log($moderation)
	io.emit('get-moderation');
	io.on('moderation',(e)=>{
		moderation.update((n)=>{
			n.public = [];
			for(let username in e){
				for(let action in e[username]){
					n.public.push(e[username][action])
				}
			}
			return n;
		})
	})
	let filter = '';	
	const undoAction = (item:ModerationItem)=>{
		io.emit('undo-moderation',item);
		
		if(item.action == 'Ignore'){
			moderation.update((n)=>{
				for(let i in n.ignored){
					if(n.ignored[i].username == item.username)
						n.ignored.splice(parseInt(i),1);
				}
				return n;
			})
		}
	}
	const clearAll = ()=>{
		io.emit('undo-moderation',filter);
	}
</script>
<table>		
	<tr>
		<th>Ignored</th>
		<th>Date</th>
	</tr>
	{#each $moderation.ignored as item}
			<tr>
				<td>{item.username}</td>
				<td>{dateTime(item.dateCreated)}</td>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<td class='svgIcon' on:click={()=>undoAction(item)}><MdDelete /></td>
			</tr>
	{/each}
</table>
{#if $user.accessLevel >= $permissions.userMod}
	<hr/>
	Filter <select bind:value={filter}>
		<option value=''>All</option>
		<option value='Mute'>Muted</option>
		<option value='Ban'>Banned</option>
		<option value='ipBanned'>IP Banned</option>
	</select>
	<table>	
		<tr>
			<th>Name</th>
			<th>Type</th>
			<th>Date</th>
			<th>By</th>
		</tr>
		{#each $moderation.public.filter((x)=>{return filter == '' || filter == x.action}) as item}
			<tr>
				<td>{item.username}</td>
				<td>{item.action}</td>
				<td>{dateTime(item.dateCreated)}</td>
				<td>{item.byUser}</td>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<td class='svgIcon' on:click={()=>undoAction(item)}><MdDelete /></td>
			</tr>
		{/each}
	</table>
{/if}
<style>
	
</style>
