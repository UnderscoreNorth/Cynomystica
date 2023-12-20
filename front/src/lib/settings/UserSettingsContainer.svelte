<script lang="ts">
	import { userSettings } from '$lib/stores/userSettings';
</script>
<table>
	<tr>
		<th rowspan="4">Display</th>
		<th>Chat</th>
		<td>
			Left<input
				type="radio"
				name="chatDisplay"
				value="left"
				bind:group={$userSettings.display.chat}
			/>
			Right<input
				type="radio"
				name="chatDisplay"
				value="right"
				bind:group={$userSettings.display.chat}
			/>
			None<input
				type="radio"
				name="chatDisplay"
				value="none"
				bind:group={$userSettings.display.chat}
			/></td
		>
	</tr>
	<tr>
		<th>Video</th>
		<td><input type="checkbox" bind:checked={$userSettings.display.video} /></td>
	</tr>
	<tr>
		<th>Danmaku</th>
		<td>
			Full<input
				type="radio"
				name="chatDanmaku"
				value="full"
				bind:group={$userSettings.display.danmaku}
			/>
			Transparent<input
				type="radio"
				name="chatDanmaku"
				value="half"
				bind:group={$userSettings.display.danmaku}
			/>
			None<input
				type="radio"
				name="chatDanmaku"
				value="none"
				bind:group={$userSettings.display.danmaku}
			/>
		</td>
	</tr>
	<tr>
		<th>Snow</th>
		<td><input type="checkbox" bind:checked={$userSettings.display.snow} /></td>
	</tr>
	<tr>
		<th rowspan="2">Chat</th>
		<th>Chat Width</th>
		<td><input type="number" step="1" bind:value={$userSettings.chat.chatWidth} /></td>
	</tr>
	<tr>
		<th>Anonymous Mode</th>
		<td><input type="checkbox" bind:checked={$userSettings.chat.anonymous} /></td>
	</tr>
	<tr>
		<th>Sync</th>
		<th>Threshold (ms)</th>
		<td><input type="number" step="1" bind:value={$userSettings.sync.threshold} /></td>
	</tr>
</table>

<style>
	input {
		max-width: 4rem;
	}
</style>
