<script lang="ts">
	import { io } from '$lib/realtime';
	import { user } from '$lib/stores/user';
	import { blocker } from '$lib/stores/blocker';
	let inputValue: string;
	const handleKeyPress = (e: KeyboardEvent) => {
		if (e.key == 'Enter' && inputValue.trim().length > 0) {
			if (!$user.username.length) {
				io.emit('login-guest', inputValue.trim());
				inputValue = '';
			} else {
				io.emit('message', inputValue.trim());
				inputValue = '';
			}
		}
	};
</script>

<input
	id="inputBar"
	placeholder={$user.username ? '' : 'Enter a username'}
	disabled={$blocker.login}
	bind:value={inputValue}
	on:keypress={handleKeyPress}
/>
