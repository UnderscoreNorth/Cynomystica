<script lang='ts'>
    import { user } from "$lib/stores/user";
    import { io } from '$lib/realtime';
    import { polls } from "$lib/stores/polls";
    import { permissions } from "$lib/stores/permissions";
	import Poll from "./Poll.svelte";
    let title = '';
    let duration:number;
    let options = [''];
    const createNewOption = () =>{
        if(options[options.length -1] !== ''){
            options.push('')
        }
    }
    const createPoll = ()=>{
        io.emit('create-poll', {title,duration,options});
    }
</script>
{#if $user.accessLevel >= $permissions.managePolls}
    <table>
        <tr>
            <th>Title</th>
            <td><input bind:value={title}></td>
        </tr>
        <tr>
            <th>Duration (sec)</th>
            <td><input bind:value={duration} type="number" step="1" placeholder='Blank for no expiry'></td>            
        </tr>
        <tr>
            <th>Options</th>
            <td>Leave blank for pinned messages</td>
        </tr>
        {#each options as option,index}
        <tr>
            <th>Option {index + 1}</th>
            <td><input bind:value={option} on:keyup={createNewOption}></td>
        </tr>
        {/each}
    </table>
    <button on:click={createPoll}>{options.map(x=>x.trim()).join('') == '' ? 'Pin Message' : 'Create Poll'}</button>
    <hr>
{/if}
{#each Object.entries($polls).sort((a,b)=>(a[1].options.length ? 1 : 0)-(b[1].options.length ? 1 : 0)) as poll}
<div class='poll'>
    <Poll poll={poll[1]} pollID={poll[0]}></Poll>
</div>
{/each}
<style>
    .poll{
        border:solid 1px white;
        padding:5px;
        margin:5px;
    }
</style>