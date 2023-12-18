<script lang="ts">
	import type { otherUser as otherUserType } from '$lib/stores/users';
	import { permissions } from '$lib/stores/permissions';
	import { user } from '$lib/stores/user';
	import { io } from '$lib/realtime';
	export let closeModal: any;
	export let otherUser: otherUserType;

	const userMod = (action: string) => {
		io.emit('user-mod', { action, username: otherUser.username });
	};
	const actions = [
		{ action: 'Ignore', access: 'ignore' },
		{ action: 'Ban', access: 'userMod' },
		{ action: 'IP Ban', access: 'userMod' }
	];
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modalbg" on:click={() => closeModal(null)}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id="otherUserModal">
		<span
			class="modal"
			on:click={(e) => {
				e.stopPropagation();
			}}
		>
				{otherUser.username}
			<hr />
			{#each actions as action}
				{#if $permissions[action.access] <= $user.accessLevel}
					<div class="userModActionBtn" on:click={() => userMod(action.action)}>
						{action.action}
					</div>
				{/if}
			{/each}
		</span>
	</div>
</div>

<style>
	#otherUserModal {
		width: 8rem;
		margin-top: 4rem;
		margin-left: calc(26rem - 100vw);
	}
	.userModActionBtn:hover {
		cursor: pointer;
		background: var(--color-bg-dark-1);
	}
</style>
