<script lang='ts'>
    import ChatRow from './ChatRow.svelte';
    import Poll from '$lib/polls/Poll.svelte';
    import { polls } from '$lib/stores/polls';	
    import { chat } from '$lib/stores/chat';
    import { tempSettings } from '$lib/stores/tempSettings';
	import { onMount } from 'svelte';
    import { settings } from '$lib/stores/settings';
	let chatScroller:HTMLDivElement;    
	const hidePoll = (pollID:string)=>{
        $tempSettings.hiddenPolls = $tempSettings.hiddenPolls.add(pollID)
	}
    $tempSettings.scrollLock = true;    
    onMount(()=>{
        chat.subscribe((e)=>{
            if ($tempSettings.minimize.toggle || $tempSettings.scrollLock){
                setTimeout(()=>{
                    if('maxTouchPoints' in navigator){
                        if(navigator.maxTouchPoints > 1){
                            chatScroller.scrollTop = chatScroller.scrollHeight;
                            return;
                        }
                    }
                    chatScroller?.lastElementChild?.lastElementChild?.lastElementChild?.scrollIntoView();
                },50);
            }
                
        })
    })
    
</script>
<div id="chatScroller" 
    bind:this={chatScroller} 
    class={$tempSettings.minimize.toggle ? 'chatMinimal' : ''}
    style:opacity={$tempSettings.minimize.toggle ? $tempSettings.minimize.opacity/100 : ''}
    style:background-image={$settings.chatBG && !$tempSettings.minimize.toggle ? `url(${$settings.chatBG})` : ''}
>
    <table id="chatTable" class={$tempSettings.minimize.toggle ? 'chatMinimal' : ''}>
        <thead>
            {#key $tempSettings.hiddenPolls}
                {#each Object.entries($polls).sort((a,b)=>(a[1].options.length ? 1 : 0)-(b[1].options.length ? 1 : 0)) as poll}
                    {#if $tempSettings.hiddenPolls.has(poll[0]) == false}
                    <tr>
                        <td colspan=2>
                            <div class='poll'>
                                <Poll poll={poll[1]} pollID={poll[0]} hideFn={hidePoll}></Poll>
                            </div>
                        </td>
                    </tr>
                    {/if}	
                {/each}
            {/key}
        </thead>
        <tbody>
            {#each $chat as message (message.id)}
                <ChatRow {message} />
            {/each}
        </tbody>
    </table>
</div>
<style>
    #chatScroller.chatMinimal{
        pointer-events: none;
        background:none;
        margin: 0 4rem;
        height:calc(100svh - 20rem);
        min-height: 70svh;
        overflow-y: hidden;
        color:var(--color-fg-1);
        font-size: 1.5rem;
        text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black;
    }
    :global(#chatTable.chatMinimal  tbody tr:nth-child(2n)) {
		background: none;
	}
    :global(#chatTable.chatMinimal .chatTime){
        display:none;
    }
    :global(tbody tr:last-child td){
        padding-bottom:5px;
    }
    #chatTable {
		border-collapse: collapse;
		width: 100%;
	}
	:global(#chatTable tbody tr:nth-child(2n)) {
		background: rgba(0, 0, 0, 0.15);
	}
    #chatScroller {
		height: calc(100% - 0.5rem);
        background-color: var(--color-bg-3);
		overflow-y: scroll;
		padding-bottom: 0.5rem;
		overflow-x: hidden;
		background-position: bottom;
		color: var(--color-fg-3);
	}
	thead{
		position:sticky;
		top:0;	
		padding:1rem;
	}
    .poll{
		padding:0.5rem;
		font-size: 0.8rem;
		box-shadow: 1px 1px 5px 0px black;
		background: var(--color-bg-2);
		margin:5px;
		color:var(--color-fg-2);
		opacity:0.9;
	}
    #chatScroller.chatMinimal .poll{
        display:none;
    }
</style>