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
<div id='chatBarContainer'>	
	<select id='iconSelect'>
		<option></option>
	</select>
	<input
	id="inputBar"
	placeholder={$user.username ? '' : 'Enter a username'}
	disabled={$blocker.login}
	bind:value={inputValue}
	on:keypress={handleKeyPress}
/>
</div>
<style>
	#chatBarContainer{
		position:relative
	}
	#iconSelect{
		position:absolute;
		float:left;
		left:0.5rem;
		width:2.3rem;
		height:1.8rem;
		top:0.1rem;
		z-index: 2;
	}
	#inputBar{
		padding:2px;
		border:0;
		height:calc(100% - 4px);
		width:calc(100% - 2px - 2.5rem);
		padding-left:2.5rem;
		margin:0;
	}
</style>

