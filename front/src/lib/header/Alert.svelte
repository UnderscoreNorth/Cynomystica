<script lang="ts">
	let messages: Array<{
		message: string;
		type: string;
	}> = [];
	import { blocker } from '$lib/stores/blocker';
	import type { blockerType } from '$lib/stores/blocker';
	import { io } from '$lib/realtime';
	io.on('alert', (messageObj) => {
		if(messageObj.type == 'login-token'){
			localStorage.clear();
			return;
		} else if (messageObj.type == 'banned'){
			localStorage.clear();
			io.disconnect();
			return;
		} else if (messageObj.type =='IP banned'){
			localStorage.clear();
			io.disconnect();
			return;
		} else if (messageObj.type =='Reload'){
			location.reload();
		}
		messages.push(messageObj);
		messages = messages;
		//@ts-ignore
		$blocker[messageObj.type] = true;
	});
	const removeMessage = (index: number) => {
		//@ts-ignore
		$blocker[messages[index].type] = false;
		messages.splice(index, 1);
		messages = messages;
	};
</script>

<div id="alert" class:show={messages.length > 0}>
	<table>
		{#each messages as messageObj, i}
			<tr>
				<td>{messageObj.message}</td>
				<td><button on:click={() => removeMessage(i)}>Ok</button></td>
			</tr>
		{/each}
	</table>
</div>

<style>
	#alert {
		visibility: hidden; /* Hidden by default. Visible on click */
		min-width: 250px; /* Set a default minimum width */
		background-color: #333; /* Black background color */
		color: #fff; /* White text color */
		text-align: center; /* Centered text */
		border-radius: 2px; /* Rounded borders */
		padding: 16px; /* Padding */
		position: fixed; /* Sit on top of the screen */
		z-index: 10; /* Add a z-index if needed */
		top: 30px; /* 30px from the top */
		transform: translateX(-50%);
		left: 50%;
	}

	/* Show the snackbar when clicking on a button (class added with JavaScript) */
	#alert.show {
		visibility: visible; /* Show the snackbar */
		/* Add animation: Take 0.5 seconds to fade in and out the snackbar.
    However, delay the fade out process for 2.5 seconds */
		-webkit-animation: fadein 0.5s;
		animation: fadein 0.5s;
	}
	td {
		white-space: pre-line;
	}
	tr:nth-child(2n) {
		background: rgba(0, 0, 0, 0.5);
	}
	/* Animations to fade the snackbar in and out */
	@-webkit-keyframes fadein {
		from {
			top: 0;
			opacity: 0;
		}
		to {
			top: 30px;
			opacity: 1;
		}
	}

	@keyframes fadein {
		from {
			top: 0;
			opacity: 0;
		}
		to {
			top: 30px;
			opacity: 1;
		}
	}
</style>
