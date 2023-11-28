<script lang='ts'>    
    import {io} from "$lib/realtime";
    let url:String;
    let title:String;
    export let playtime:Date|null;
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
            visible
        }
        io.emit('upsert-schedule',sendObj);
        url = '';
        title = '';
        playtime = null;
        
    }
</script>
<table>
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
<style>
    input{
        width:100%;
    }
</style>