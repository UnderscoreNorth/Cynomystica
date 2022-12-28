<script lang="ts">
	let username: string;
	let password: string;
	let currentUser: String;
</script>

<div>
	{#if currentUser}
		<p>
			Signed in as {currentUser}
		</p>
	{:else}
		<form>
			<input type="text" placeholder="Username" bind:value={username} />
			<input type="password" placeholder="Password" bind:value={password} />
			<button>Sign In</button>
			<button>Sign Up</button>
		</form>
	{/if}
</div>

<style>
	input {
		width: 8rem;
	}
</style>
