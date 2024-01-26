<script lang="ts">
	import type { otherUser as otherUserType } from '$lib/stores/users';
	import { permissions } from '$lib/stores/permissions';
	import { user } from '$lib/stores/user';
	import { io } from '$lib/realtime';
	import { moderation } from '$lib/stores/moderation';
	
	export let closeModal: any;
	export let otherUser: otherUserType;
	export let x:number;
	export let y:number;
	const userMod = (action: actionType) => {
		if($user.username !== otherUser.username){
			if(otherUser[action.key]){
			if($user.accessLevel > 0){
				io.emit('undo-moderation',{
					action:action.action ,username:otherUser.username,byUser:''
				})
			}
			if(action.action == 'Ignore'){
				moderation.update((n)=>{
						for(let i in n.ignored){
						if(n.ignored[i].username == otherUser.username)
							n.ignored.splice(parseInt(i),1);
					}
					return n;
				})
			}
		} else {
			if(action.action == 'Ignore'){
				moderation.update((n)=>{
					n.ignored.push({
						username:otherUser.username,
						byUser:$user.username,
						action:'Ignore',
						dateCreated:new Date().toUTCString()
					})
					return n;
				})
			}
			if($user.accessLevel > 0){
				io.emit('user-mod', { action:action.action, username: otherUser.username });
			}
		}
		closeModal(null,null);
		} 		
	};
	interface actionType {
		action:string
		access:'' | 'userMod'
		key:'ignored' | 'banned' | 'muted' | 'ipbanned';
	}
	const actions = [
		{ action: 'Ignore', access: '',key:'ignored' },
		{ action: 'Ban', access: 'userMod',key:'banned' },
		{ action: 'Mute', access: 'userMod', key:'muted' },
		{ action: 'IP Ban', access: 'userMod', key:'ipbanned' }
	] as Array<actionType>;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modalbg" on:click={(e) => closeModal(null,null)}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="modal"
		on:click={(e) => {e.stopPropagation();}}
		style:top={(y + 5) + 'px'}
		style:left={(x + 10) + 'px'}
	>		
				{otherUser.username}
			<hr />
			{#each actions as action}
				{#if action.access == '' || $permissions[action.access] <= $user.accessLevel}
					<div class="userModActionBtn" on:click={() => userMod(action)}>
						{#if otherUser[action.key]}
							{'Un' + action.action.toLowerCase()}
						{:else}
							{action.action}
						{/if}
					</div>
				{/if}
			{/each}
	</div>
</div>

<style>
	.modal {
		position:fixed;		
		color:var(--color-fg-3);
		height:fit-content;
	}
	.userModActionBtn:hover {
		cursor: pointer;
		background: var(--color-bg-1);
		color:var(--color-fg-1)
	}
</style>
