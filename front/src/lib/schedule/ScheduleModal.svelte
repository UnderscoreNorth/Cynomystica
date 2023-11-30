<script lang='ts'>    
    import {io} from "$lib/realtime";
    export let changeSelectedID:Function;
    export let selectedID:string|null;
    let url:String;
    let title:String;
    let playtime:Date|null = null;
    let leewayBefore:Number;
    let leewayAfter:Number;
    let visible:boolean;
    let loading = true;
    let newEntry = false;
    if(playtime){
        
    } else{
        newEntry= true;
        loading =false;
    }
    const upsert = ()=>{
        let sendObj = {
            url,
            title,
            playtime,
            leewayBefore,
            leewayAfter,
            visible,
            selectedID
        }
        io.emit('upsert-schedule',sendObj);
        url = '';
        title = '';
        playtime = null;
        
    }
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modalbg" on:click={()=>{changeSelectedID(null)}}>
    <table id='scheduleModal' on:click={(e) => {e.stopPropagation();}}>
        <tr>
            <th>URL</th><td><input bind:value={url} disabled={loading}/></td>
        </tr>
        <tr>
            <th>Title</th><td><input bind:value={title}  disabled={loading}/></td>
        </tr>
        <tr>
            <th>Playtime</th><td><input type='datetime-local' bind:value={playtime}  disabled={loading}/></td>
        </tr>
        <tr>
            <th>Leeway Before (s)</th><td><input type="number" bind:value={leewayBefore}  disabled={loading}/></td>
        </tr>
        <tr>
            <th>Leeway After (s)</th><td><input type="number" bind:value={leewayAfter}  disabled={loading}/></td>
        </tr>
        <tr>
            <th>Visible</th><td><input type='checkbox' bind:checked={visible}  disabled={loading}/></td>
        </tr>
        <tr>
            <td colspan=2><button on:click={upsert}>{newEntry ? 'Add' : 'Edit'}</button></td>
        </tr>
    </table>
</div>
<style>
    #scheduleModal{
        max-width:50rem;
        background:var(--color-bg-dark-3);
        opacity:0.9;
        margin-top:calc(50vh - 12rem);
        border:solid 1px var(--color-bg-dark-1);
        color:white;
    }
    input{
        width:25rem;
    }
    #scheduleModal{
        padding:1rem;
        height:20rem;
    }
</style>