<script lang='ts'>
    import { icons } from "$lib/stores/icons";
    import { userSettings } from "$lib/stores/userSettings";
    import { presets } from "$lib/stores/presets";
	import { onMount } from "svelte";
    import { browser } from "$app/environment";
    let iconListEl;
    let iconListOpen = false;
    const toggleIconList = (e: MouseEvent) => {
		iconListOpen = !iconListOpen;
		e.stopPropagation();
	};
	const selectIcon = (icon: any) => {
		$userSettings.icon = icon;
	};
    onMount(() => {
		if (browser) {
			window.addEventListener('click', function (event) {
				iconListOpen = false;
			});
		}
	});
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="iconSelect" on:click={toggleIconList} bind:this={iconListEl}>
	{#if $userSettings.icon && $icons[$userSettings.icon]?.url}
		<img src={$icons[$userSettings.icon].url} alt="icon" />
	{/if}
</div>
{#if iconListOpen}
	<div
		id="iconList"
		style={iconListEl?.getBoundingClientRect()?.top < 250 ? 'top:2rem;' : 'bottom:2rem'}
	>
		{#each Array.from(new Set(Object.values($icons).map((x) => x.preset))).filter(x=>$presets.icons[x] == true) as preset}
			<div class="presetContainer">
				<div>
					<u>{preset}</u>
				</div>
				{#each Object.entries($icons) as [id, icon]}
					{#if icon.preset == preset}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							on:click={() => {
								selectIcon(id);
							}}
							class="iconListItem"
						>
							{#if icon.url}
								<img src={icon.url} alt="icon" />
							{/if}
							<span style:color={icon.color}>
								{icon.display}
							</span>
						</div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
{/if}
<style>
    #iconList {
		position: absolute;
		left: 0.5rem;
		max-height: 70svh;
		overflow-y: scroll;
		background: var(--color-bg-3);
		z-index: 2;
		color: var(--color-fg-3);
		box-shadow: 1px 1px 5px 0px black;
		border: solid 1px black;
		font-weight: bold;
		width:max-content;
		max-width: 90vw;
		max-height: 20rem;
	}
	.presetContainer {
		display: inline-block;
		vertical-align: top;
		padding:0 5px;
	}
	.iconListItem {
		display: flex;
		align-items: center;
		height: 1.8rem;
	}
	.iconListItem img{
		padding-right:2px;
	}
	.iconListItem:hover {
		background-color: var(--color-bg-2);
		color:var(--color-fg-2);
	}	
	.iconListItem img,
	#iconSelect img {
		height: 1.8rem;
		width: 1.8rem;
	}
	#iconSelect {
		position: absolute;
		float: left;
		left: 0.5rem;
		width: 2rem;
		height: calc(100% - 4px);
		top: 2px;
		z-index: 0;
		border-right: solid 1px black;
		display:flex;
		justify-content: center;
		align-items: center;
	}
	#iconSelect:hover {
		background-color: #1e90ff;
	}
</style>