<script lang="ts">
	let messages: Array<{
		message: string;
		type: string;
	}> = [];
	import { blocker } from '$lib/stores/blocker';
	import type { blockerType } from '$lib/stores/blocker';
	import { io } from '$lib/realtime';
	import Modal from '$lib/ui/modal.svelte';
	const clearLogin = ()=>{
		localStorage.removeItem('accessToken');
		localStorage.removeItem('accessTokenExpires');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('refreshTokenExpires');
		localStorage.removeItem('username');
	}
	io.on('alert', (messageObj) => {
		if (messageObj.type == 'login-token') {
			clearLogin();
			return;
		} else if (messageObj.type == 'clearLogin') {
			clearLogin();
		} else if (messageObj.type == 'disconnect') {
			io.disconnect();
		} else if (messageObj.type == 'Reload') {
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
	const closeModal = ()=>{
		messages = [];
	}
</script>
{#if messages.length > 0}
	<Modal title={'Alerts'} zIndex={3} closeModal={closeModal}>
		<table>
			{#each messages as messageObj, i}
				<tr>
					<td>{messageObj.message}</td>
					<td><button on:click={() => removeMessage(i)}>Ok</button></td>
				</tr>
			{/each}
		</table>
	</Modal>
{/if}
<style>	
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
