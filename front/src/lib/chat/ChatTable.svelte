<script lang='ts'>
    import ChatRow from './ChatRow.svelte';
    import Poll from '$lib/polls/Poll.svelte';
    import { polls } from '$lib/stores/polls';	
    import { chat } from '$lib/stores/chat';
    import { tempSettings } from '$lib/stores/tempSettings';
	let chatScroller:HTMLDivElement;
    let hiddenPolls = new Set();
	const hidePoll = (pollID:string)=>{
		hiddenPolls.add(pollID);
		hiddenPolls = hiddenPolls;
	}
</script>
<div id="chatScroller" bind:this={chatScroller} class={$tempSettings.minimize ? 'chatMinimal' : ''}>
    <table id="chatTable" class={$tempSettings.minimize ? 'chatMinimal' : ''}>
        <thead>
            {#key hiddenPolls}
                {#each Object.entries($polls).sort((a,b)=>(a[1].options.length ? 1 : 0)-(b[1].options.length ? 1 : 0)) as poll}
                    {#if hiddenPolls.has(poll[0]) == false}
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
            {#each $chat as message}
                <ChatRow {message} />
            {/each}
        </tbody>
    </table>
</div>
<style>
    #chatScroller.chatMinimal{
        pointer-events: none;
        background:none;
        margin: 4rem;
        margin-bottom:8rem;
        height:calc(100svh - 12rem);
        overflow-y: hidden;
        opacity: 0.25;
        color:var(--color-fg-1);
        text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black;
    }
    :global(#chatTable.chatMinimal img){
        opacity:0.2;
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
		overflow-y: scroll;
		padding-bottom: 0.5rem;
		overflow-x: hidden;
        background-image: url(/CynoChatBG.png);
		background-position: bottom;
	}
	thead{
		position:sticky;
		top:0;	
		padding:1rem;
	}

</style>