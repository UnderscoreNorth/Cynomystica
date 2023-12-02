<script lang='ts'>
    export let message:any;
    import {icons} from '$lib/stores/icons';
    import { bulletMode } from '$lib/stores/bulletmode';
    import { user } from '$lib/stores/user';
    const getMessageClasses = (message:string)=>{
        let array = [];
        if(message?.[0] == '>' )
        array.push('greentext');
        return array.join(' ');
    }
    const getRowClasses = (message:string)=>{
        let array = [];
        array.push($bulletMode ? 'chatRow bulletMode' : 'chatRow');
        if(message.includes($user.username) && $user.username)
            array.push('userHighlighted');
            return array.join(' ');
    }
    const getUserStyle = ()=>{
        let style = '';
        if($icons[message.icon]?.url){
            style=`color:${$icons[message.icon]?.color}`
        }
        return style;
    }
</script>
{#if message?.username}
{#key $icons}
    <tr class={getRowClasses(message.message)}>						
        <td class="chatTime">
            [{new Date(message.time).toLocaleTimeString('en-UK', { hour12: false })}]
        </td>
        <td style='width:99%'>
            <span class='chatIcon'>
                {#if message.icon && $icons[message.icon]?.url}
                    <img src={$icons[message.icon].url} alt='icon' title={$icons[message.icon].display}/>
                {/if}
            </span>
            <span class="chatUser" style={getUserStyle()}>
                {message.username}: 
            </span>
            <span class="chatMsg">
                <span class={getMessageClasses(message.message)}>{message.message}</span>
            </span>
        </td>
    </tr>
{/key}
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
		padding-left:2px;
	}
	.chatRow{
		font-size:1rem;
	}
	.chatIcon img{
		height:1.25rem;
		width:1.25rem;
        margin-bottom:-0.125rem;
	}
	.chatTime {
		font-size: 0.6em;
		padding-left: 5px;
		padding-right:5px;
		border-right: 1px solid var(--color-bg-dark-1);
	}
    .chatRow td {
		line-height: 1rem;
	}
    .chatMsg{
        overflow-wrap: anywhere;
    }
    .userHighlighted{
        color:white;
    }
</style>