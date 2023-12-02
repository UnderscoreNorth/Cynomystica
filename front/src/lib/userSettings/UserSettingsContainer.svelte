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
					<th rowspan=3>Display</th>
					<th>Chat</th>
					<td><input type="checkbox" bind:checked={settingsJson.display.chat} /></td>
				</tr>
				<tr>
					<th>Video</th>
					<td><input type="checkbox" bind:checked={settingsJson.display.video} /></td>
				</tr>
				<tr>
					<th>Danmaku</th>
					<td><input type="checkbox" bind:checked={settingsJson.display.danmaku} /></td>
				</tr>
				<tr>
					<th>Sync</th>
					<th>Video Sync Threshold (ms)</th>
					<td><input type="number" step=1 bind:value={settingsJson.sync.threshold} /></td>
				</tr>
				<button on:click={saveChanges}>Save Changes</button>
			</table>
		</span>
	</div>
</div>

<style>
	#userSettingsContainer {
		width: 80vw;
		max-width: 80em;
		margin-top: 2rem;
		color:white;
	}
</style>
