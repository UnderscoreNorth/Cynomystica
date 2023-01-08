<script lang="ts">
	import { io } from '$lib/realtime';
	import { user } from '$lib/stores/user';
	import { blocker } from '$lib/stores/blocker';
	import type { blockerType } from '$lib/stores/blocker';
	let usernameInput = '';
	let passwordInput = '';
	const signIn = () => {
		if (usernameInput.length && passwordInput.length) {
			io.emit('sign-in', { username: usernameInput, password: passwordInput });
			blocker.update((n: blockerType) => {
				n.login = true;
				return n;
			});
		}
	};
	const signUp = () => {
		if (usernameInput.length && passwordInput.length) {
			io.emit('sign-up', { username: usernameInput, password: passwordInput });
			blocker.update((n: blockerType) => {
				n.login = true;
				return n;
			});
		}
	};
</script>

<div>
	{#if $user.username}
		<span>
			Signed in as {$user.username}
			{$user.accessLevel === 0 ? ' (guest)' : ''}
		</span>
	{:else}
		<form>
			<input type="text" placeholder="Username" bind:value={usernameInput} />
			<input type="password" placeholder="Password" bind:value={passwordInput} />
			<button on:click={signIn} disabled={$blocker.login}>Sign In</button>
			<button on:click={signUp} disabled={$blocker.login}>Sign Up</button>
		</form>
	{/if}
</div>

<style>
	input {
		width: 8rem;
	}
</style>
