<script lang='ts'>
    import type { Poll } from "$lib/stores/polls";
    import { io } from "$lib/realtime";
    import { user } from "$lib/stores/user";
	import { onMount } from "svelte";
    import { permissions } from "$lib/stores/permissions";
    export let poll:Poll;
    export let pollID:string;
    export let hideFn:Function|undefined = undefined;
    const vote = (vote:number) =>{
        if(vote == poll.votes[$user.uuid])
            vote = -1;  
        io.emit('vote-poll',{pollID:pollID,vote})
    }
    const closePoll = ()=>{
        if(poll.dateClose || poll.options.length == 0){
            io.emit('delete-poll',{pollID});
        } else {
            io.emit('close-poll',{pollID});
        }

    }
    const getTimeLeft = ()=>{
        let hours = -1;
        let minutes = -1;
        let seconds = (Math.floor((Date.parse(poll.dateCreate)/1000 + poll.duration) - new Date().getTime()/1000) + 1 );
        if(seconds > 60){
            minutes = Math.floor(seconds / 60);
            seconds = seconds % 60;
        }
        if(minutes > 60){
            hours = Math.floor(minutes / 60);
            minutes = minutes % 60;
        }
        return `${hours >= 0 ? hours + 'hr, ' : ''}${minutes >= 0 ? minutes + 'min, ' : ''}${seconds}s`;
    }
    let timer = 0;
    onMount(() => {
        if(poll.duration > 0){
            setInterval(()=>{
                timer++;
            },1000)
        }
    });
</script>
<div class='header'>
    <b class='pollTitle'>
        {@html poll.title.replaceAll(/(http[^\s]+)/g,(match,url)=>{return `<a target='_blank' href='${url}'>${url}</a>`})}
    </b>
    {#if $user.accessLevel >=$permissions.managePolls}
    <button on:click={()=>closePoll()}>
        {poll.dateClose || poll.options.length == 0 ? 'Delete' : 'End'}
    </button>
    {/if}
    {#if hideFn !== undefined}
    <button on:click={()=>{if (hideFn!== undefined) hideFn(pollID)}}>Hide</button>
    {/if}
</div>

<small>{poll.options.length ? 'opened' : 'pinned'} by {poll.username}
    {#if poll.duration > 0 && !poll.dateClose}
        {#key timer}
        {' - Closes in ' + getTimeLeft()}
        {/key}
        
    {/if}
</small>
{#if poll.options.length}
<hr>
    <table>
    {#each poll.options as option,index}
    <tr>
        <td><button disabled={poll.dateClose !== undefined} on:click={()=>vote(index)}>{Object.values(poll.votes).filter(x=>x==index).length}</button></td>
        <td style:font-weight={poll.votes[$user.uuid]==index ? 'bold':''}>{option}</td>
    </tr>
    {/each}
    </table>
{/if}
<style>
    hr{
        border-color:var(--color-text-light-1);
    }
    .header{
        display:flex;
    }
    .header .pollTitle{
        flex-shrink: 1;
        flex-grow:1;
    }
    .header button{
        flex-shrink: 0;
        flex-grow:0;
        height:fit-content;
    }
    .pollTitle{
        word-break: break-word;
    }
</style>