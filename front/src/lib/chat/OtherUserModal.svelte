<script lang="ts">
    import type {otherUser as otherUserType} from "$lib/stores/users";
    import { permissions } from "$lib/stores/permissions";
    import { user } from "$lib/stores/user";
    import { io } from "$lib/realtime";
	export let closeModal: any;
    export let otherUser:otherUserType;
     
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modalbg" on:click={()=>closeModal(null)}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id="otherUserModal">
		<span
			class="modal"
			on:click={(e) => {
				e.stopPropagation();
			}}
		>
            {otherUser.username}
            <hr>
            {#if $permissions.ignore <= $user.accessLevel}
                <div>Ignore</div>
            {/if}
            {#if $permissions.userMod <= $user.accessLevel}
                <div>Mute</div>
                <div>Kick</div>
                <div>Ban</div>
            {/if}
		</span>
	</div>
</div>

<style>
	#otherUserModal {
		width: 8rem;
		margin-top: 4rem;
        margin-left:calc(24rem - 100vw);
	}
</style>
