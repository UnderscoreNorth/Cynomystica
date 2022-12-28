<script lang="ts">
	import { userSettings } from '$lib/stores/userSettings';
	import { stop_propagation } from 'svelte/internal';
	export let closeModal: any;
	let settingsJson: any;

	userSettings.subscribe((value) => {
		settingsJson = value;
	});
	const saveChanges = () => {
		userSettings.set(settingsJson);
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modalbg" on:click={closeModal()}>
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
				<tr
					><th>Video</th><td>Video Width</td><td><input bind:value={settingsJson.video.width} /></td
					></tr
				>
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
	}
</style>
