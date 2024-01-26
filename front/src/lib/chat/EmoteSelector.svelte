<script lang='ts'>
    import { emotes } from "$lib/stores/emotes";
    import { presets } from "$lib/stores/presets";
    import { chatInput,chatEl } from "$lib/stores/chat";
	import { settings } from "$lib/stores/settings";
    //@ts-ignore
    import MdInsertEmoticon from 'svelte-icons/md/MdInsertEmoticon.svelte'
	import Modal from "$lib/ui/modal.svelte";
	import { onMount } from "svelte";
    let emoteListEl;
    let emoteListOpen = false;
	let emoteSearch = '';
	let selectedPreset = '';
    const toggleemoteList = (e: MouseEvent) => {
		emoteListOpen = !emoteListOpen;
		e.stopPropagation();
	};
	const selectemote = (emote: any) => {
		$chatInput += emote; 
		$chatEl.focus();       
	};
	const isSelected = (value:string,selected:string)=>{
		if(value == selected) return 'selected'
		return 'unselected'
	}
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="emoteSelect" on:click={toggleemoteList} bind:this={emoteListEl}>
	<MdInsertEmoticon />
</div>
{#if emoteListOpen}
    <Modal title='Emotes' closeModal={()=>emoteListOpen=false} align='center'>		
		<div style:display='flex' style:margin-top='5px' style:height='100%'>
			<div class='emotePresetList'>
				<input placeholder='Search' bind:value={emoteSearch}><br>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div on:click={()=>selectedPreset=''} class={isSelected('',selectedPreset)}>All</div>
				{#each Array.from(new Set(Object.values($emotes).map((x) => x.preset))).filter(x=>$presets.emotes[x] == true) as preset}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div on:click={()=>selectedPreset=preset} class={isSelected(preset,selectedPreset)}>{preset}</div>
				{/each}
			</div>
			<div class='emoteList' 
				 style:--max-emote-height={$settings.maxEmoteHeight + 'px'}
				 style:height='100%'
				 style:overflow-y='auto'
			>
				<table style:border-collapse='collapse'>
				{#each Object.values($emotes).filter((e)=>{return (
					(e.preset == selectedPreset || selectedPreset == '') 
					&& (emoteSearch == '' || e.text.toLowerCase().includes(emoteSearch.toLowerCase()))
					&& ($presets.emotes[e.preset] == true)
					)}).sort((a,b)=>{
						return a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1;
					}) as emote}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<tr class='emoteItem' on:click={()=>selectemote(emote.text)}>
						<td  style:text-align='center'><img class='emote' src={emote.url} alt={emote.text}/> </td>
						<td>{emote.text}</td>
					</tr>
				{/each}
			</table>
			</div>
		</div>
		
    </Modal>
{/if}
<style>
	.presetContainer {
		display: inline-block;
		vertical-align: top;
		padding:0 5px;
	}
	.selected{
		font-weight: bold;
	}
	.unselected{
		cursor: pointer;
	}
	#emoteSelect {
		position: absolute;
		float: right;
		right: 0.5rem;
		top:2px;
		height: calc(100% - 4px);
		z-index: 0;
		display:flex;
		justify-content: center;
		align-items: center;
		aspect-ratio: 1;
	}
	#emoteSelect:hover {
		background-color: #1e90ff;
	}
	.emotePresetList{
		padding:0.5rem;
		border-right:solid 2px var(--color-bg-2);
	}
	.emoteList{
		display:flex;
		flex-direction: column;
		padding:0.5rem;
	}
	.emoteItem{
		margin:2px;
		padding:2px;
	}
	.emoteItem:hover{
		background:var(--color-bg-2);
		cursor: pointer;
	}
	input{
		width:8rem;
	}
</style>