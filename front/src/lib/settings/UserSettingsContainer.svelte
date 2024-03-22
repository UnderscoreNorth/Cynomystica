<script lang="ts">
	import { userSettings } from '$lib/stores/userSettings';
	import { tempSettings } from '$lib/stores/tempSettings';
</script>

<table>
	<tr>
		<th rowspan="7">Display</th>
	</tr>
	<tr>
		<th>Chat</th>
		<td>
			<div style="display:flex">
				<span
					><input
						type="radio"
						name="chatDisplay"
						value="left"
						bind:group={$userSettings.display.chat}
					/>Left</span
				>
				<span
					><input
						type="radio"
						name="chatDisplay"
						value="right"
						bind:group={$userSettings.display.chat}
					/>Right</span
				>
				<span
					><input
						type="radio"
						name="chatDisplay"
						value="none"
						bind:group={$userSettings.display.chat}
					/>None</span
				>
			</div>
		</td>
	</tr>
	<tr>
		<th>Video</th>
		<td>
			<input
				type="checkbox"
				bind:checked={$userSettings.display.video}
				disabled={$tempSettings.minimize.toggle}
			/>
		</td>
	</tr>
	<tr>
		<th>Danmaku</th>
		<td>
			<div style="display:flex">
				<span
					><input
						type="radio"
						name="chatDanmaku"
						value="full"
						bind:group={$userSettings.display.danmaku}
					/>Full</span
				>
				<span
					><input
						type="radio"
						name="chatDanmaku"
						value="half"
						bind:group={$userSettings.display.danmaku}
					/>Transparent</span
				>
				<span
					><input
						type="radio"
						name="chatDanmaku"
						value="none"
						bind:group={$userSettings.display.danmaku}
					/>None</span
				>
			</div>
		</td>
	</tr>
	<tr>
		<th>Chat Width</th>
		<td><input type="number" step="1" min="0" bind:value={$userSettings.chat.chatWidth} /></td>
	</tr>
	<tr>
		<th>Max Chat Msgs</th>
		<td
			><input
				type="number"
				step="10"
				min="0"
				max="500"
				bind:value={$userSettings.chat.chatArray}
			/></td
		>
	</tr>
	<tr>
		<th>Hide Images</th>
		<td><input type="checkbox" bind:checked={$userSettings.display.hideImage} /></td>
	</tr>
	<tr class="divider"></tr>
	<tr>
		<th>Sync</th>
		<th>Threshold (ms)</th>
		<td><input type="number" step="100" min="100" bind:value={$userSettings.sync.threshold} /></td>
	</tr>
	<tr class="divider"></tr>
	<tr>
		<th rowspan="3">
			Temporary<br />Settings
		</th>
		<th>Video Minimal</th>
		<td>
			<input
				type="checkbox"
				on:change={() => {
					$userSettings.display.video = true;
				}}
				bind:checked={$tempSettings.minimize.toggle}
			/>
			{#if $tempSettings.minimize.toggle}
				Opacity <input
					type="number"
					style:width={'3rem'}
					min="0"
					max="100"
					step="10"
					bind:value={$tempSettings.minimize.opacity}
				/>%
			{/if}
		</td>
	</tr>
	<tr>
		<th>Anonymous Mode</th>
		<td><input type="checkbox" bind:checked={$tempSettings.anonymous} /></td>
	</tr>
	<tr>
		<th>Snow</th>
		<td>
			<input type="number" step="50" min="0" bind:value={$tempSettings.snow} />
		</td>
	</tr>
</table>

<style>
	.divider {
		height: 1rem;
	}
	input {
		max-width: 4rem;
	}
	td {
		padding: 0 1rem;
	}
</style>
