<script lang="ts">
    import { settings, placeholderText,numberTypes } from "$lib/stores/settings";
    import camelToProper from "$lib/utilities/camelToProper";
    import { io } from "$lib/realtime";
    let settingsObj = structuredClone($settings);
    settings.subscribe((e)=>{
        settingsObj = structuredClone($settings);
    })
    const save = ()=>{
       io.emit('upsert-settings',settingsObj);
    }
</script>
<table>
    {#each Object.keys(settingsObj) as setting}
<tr>
    <td>{camelToProper(setting)}</td>
    <td>
        {#if numberTypes.includes(setting)}
        <input 
            bind:value={settingsObj[setting]} 
            placeholder={placeholderText?.[setting] ?? ''} 
            type='number'
        />
        {:else}
        <input 
            bind:value={settingsObj[setting]} 
            placeholder={placeholderText?.[setting] ?? ''} 
            type='text'
        />
        {/if}
    </td>
</tr>
    {/each}
</table>
<button on:click={()=>save()}>Save</button>
<style>
    td{
        text-align: right;
    }
</style>