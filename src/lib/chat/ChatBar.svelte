<script lang="ts">
	import { io } from '$lib/realtime';
	import { user } from '$lib/stores/user';
	let inputValue: string;
	let userObj: any;
	user.subscribe((value) => {
		userObj = value;
	});
	const handleKeyPress = (e: KeyboardEvent) => {
		if (e.key == 'Enter' && inputValue.trim().length > 0) {
			if (!userObj.username.length) {
				io.emit('login-guest', inputValue.trim());
			} else {
				io.emit('message', inputValue.trim());
				inputValue = '';
			}
		}
	};
	io.on('name', (message) => {
		if (message.status == 'success') {
			userObj.username = message.username;
			inputValue = '';
		}
	});
</script>

<input
	id="inputBar"
	placeholder={userObj.username ? '' : 'Enter a username'}
	bind:value={inputValue}
	on:keypress={handleKeyPress}
/>
