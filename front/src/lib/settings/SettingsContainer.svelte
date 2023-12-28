<script lang="ts">
    import { settings } from "$lib/stores/settings";
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
    <th>{camelToProper(setting)}</th>
    <td><input bind:value={settingsObj[setting]} /></td>
</tr>
    {/each}
</table>
<button on:click={()=>save()}>Save</button>
