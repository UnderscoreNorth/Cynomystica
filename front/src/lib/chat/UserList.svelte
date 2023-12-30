<script lang="ts">
import OtherUserModal from './OtherUserModal.svelte';
import { user } from '$lib/stores/user';
import { permissions } from '$lib/stores/permissions';
import { users, type otherUser } from '$lib/stores/users';
//@ts-ignore
import FaVolumeMute from 'svelte-icons/fa/FaVolumeMute.svelte'
//@ts-ignore
import MdBlock from 'svelte-icons/md/MdBlock.svelte'
let selectedOtherUser: otherUser | null;
	let x = 0;
	let y = 0;

const selectOtherUser = (user: otherUser | null,e:PointerEvent | null) => {
		if(e !== null){
			x = e.pageX;
			y = e.pageY;
		}
		selectedOtherUser = user;
	};
</script>
<div id="userList">
    Userlist
    <hr />
    {#each $users.users as userItem}
        {#if userItem.accessLevel >= 0}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                class={"userListItem accessLevel" + userItem.accessLevel}									
                on:click={(e) => {
                    selectOtherUser(userItem,e);
                }}
            >
                {#if userItem.muted}
					<span class='muted'><FaVolumeMute /></span>
				{/if}
				{#if userItem.ignored}
					<span class='muted'><MdBlock /></span>
				{/if}
				{userItem.username}
            </div>
        {/if}
    {/each}
</div>
{#if selectedOtherUser}
    <OtherUserModal otherUser={selectedOtherUser} closeModal={selectOtherUser} x={x} y={y}/>
{/if}
<style>
    .userListItem.accessLevel0 {
		font-style: italic;
	}
    #userList {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
		background: var(--color-bg-3);
		color:var(--color-fg-3);
		height: calc(100% - 1em);
		padding: 0.5em;
		box-shadow: 4px 0px 4px black;
		overflow-y: auto;
		opacity:0.9;
	}	
	.muted{
		height:0.8rem;
		display:inline-block;
	}
</style>