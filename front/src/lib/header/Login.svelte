<script lang="ts">
	import { io } from '$lib/realtime';
	import { user } from '$lib/stores/user';
	import { blocker } from '$lib/stores/blocker';
	import { login } from '$lib/utilities/login';
	import type { blockerType } from '$lib/stores/blocker';
	let usernameInput = '';
	let passwordInput = '';
	let toggleLogin = false;
	const signIn = () => {
		if (usernameInput.length && passwordInput.length) {
			login(usernameInput,passwordInput,'password');			
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
	const signOut = () => {
		localStorage.clear();
		location.reload();
	}
</script>

<div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<span id='loginToggle' on:click={()=>{toggleLogin = !toggleLogin}}>Account</span>
	
		<div id='loginDiv' style='display:{toggleLogin ? 'block' : 'none' }'>
			{#if $user.username}
				<span>
					Signed in as {$user.username}
					{$user.accessLevel === 0 ? ' (guest)' : ''}
					<button title='Sign out' on:click={()=>signOut()}>X</button>
				</span>
			{:else}
				<form>
					<input type="text" placeholder="Username" bind:value={usernameInput} />
					<input type="password" placeholder="Password" bind:value={passwordInput} />
					<span>
						<button on:click={signIn} disabled={$blocker.login}>Sign In</button>
						<button on:click={signUp} disabled={$blocker.login}>Sign Up</button>
					</span>
				</form>
			{/if}
		</div>
</div>

<style>
	input {
		width: 8rem;
	}
	#loginToggle{
		display:none;
	}
	@media (orientation:landscape) {	
		#loginDiv{
			display: block !important;;
		}
	}
	@media (orientation:portrait) {
		#loginToggle{
			display:unset;
		}
		#loginDiv{
			position:fixed;
			background-color: var(--color-bg-dark-1);
			left:0;
			right:0;
			padding:1rem;
			z-index: 1;
		}
		#loginDiv form{
			display:flex;
			flex-wrap: wrap;
			flex-direction: column;
			align-items: center;
		}
	}
</style>
