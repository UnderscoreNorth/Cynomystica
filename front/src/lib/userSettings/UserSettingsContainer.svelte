<script lang="ts">
	import { userSettings } from '$lib/stores/userSettings';
	import { stop_propagation } from 'svelte/internal';
	export let closeModal: any;
	let settingsJson = structuredClone($userSettings);
	
	const saveChanges = () => {
		userSettings.set(settingsJson);
		closeModal();
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modalbg" on:click={()=>{settingsJson = structuredClone($userSettings);closeModal()}}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id="userSettingsContainer">
		<span
			class="modal"
			on:click={(e) => {
				e.stopPropagation();
			}}
		>
			<h3>User Settings</h3>
			<hr />
			<table>
				<tr>
					<th rowspan=4>Display</th>
					<th>Chat</th>
					<td><input type="checkbox" bind:checked={$userSettings.display.chat} /></td>
				</tr>
				<tr>
					<th>Video</th>
					<td><input type="checkbox" bind:checked={$userSettings.display.video} /></td>
				</tr>
				<tr>
					<th>Danmaku</th>
					<td><input type="checkbox" bind:checked={$userSettings.display.danmaku} /></td>
				</tr>
				<tr>
					<th>Chat Width</th>
					<td><input type="number" step=1 bind:value={$userSettings.display.chatWidth} /></td>
				</tr>
				<tr>
					<th>Sync</th>
					<th>Threshold (ms)</th>
					<td><input type="number" step=1 bind:value={$userSettings.sync.threshold} /></td>
				</tr>
			</table>
			<!--<button on:click={saveChanges}>Save Changes</button>-->
		</span>
	</div>
</div>

<style>
	#userSettingsContainer {
		margin-top: 2rem;
		color:white;
	}
	#userSettingsContainer input{
		max-width:4rem;
	}
</style>
