<script lang='ts'>
    export let message:any;
    import {icons} from '$lib/stores/icons';
    import { bulletMode } from '$lib/stores/bulletmode';
</script>
{#if message?.username}
<tr class={$bulletMode ? 'chatRow bulletMode' : 'chatRow'}>						
    <td class="chatTime">
        [{new Date(message.time).toLocaleTimeString('en-UK', { hour12: false })}]
    </td>
    <td style='width:99%'>
        <span class='chatIcon'>
            {#if message.icon && $icons[message.icon]?.url}
                <img src={$icons[message.icon].url} alt='icon' title={$icons[message.icon].display}/>
            {/if}
        </span>
        <span class="chatUser">
            {message.username}: 
        </span>
        <span class="chatMsg">
            {#if message.message?.[0] == '>'}
            <span class='greentext'>{message.message}</span>
            {:else}
            {message.message}
            {/if}
        </span>
    </td>
</tr>
{/if}
<style>
    .chatUser {
		text-align: right;
		font-weight: bold;
	}
	.chatMsg {
		width: 100%;
	}
	.chatIcon{
		padding-left:0.5rem;
	}
	.chatRow{
		font-size:0.9em;
	}
	.chatIcon img{
		height:0.9em;
		width:0.9em;
	}
	.chatTime {
		font-size: 0.6em;
		padding-left: 5px;
		
		border-right: 1px solid black;
	}
    .chatRow td {
		line-height: 1rem;
	}
    .chatMsg{
        overflow-wrap: anywhere;
    }
</style>