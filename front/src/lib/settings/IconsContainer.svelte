<script lang="ts">
    import { icons} from "$lib/stores/icons";
    import type{ Icon } from "$lib/stores/icons";
    import { io } from "$lib/realtime";
    //@ts-ignore
    import MdDelete from 'svelte-icons/md/MdDelete.svelte'

    let iconsGrouped:Record<string, Record<string, Icon>> = {};
    let disableSave = false;
    for(let icon of Object.values($icons)){
        iconsGrouped[icon.preset] = iconsGrouped[icon.preset] || {};
        iconsGrouped[icon.preset][icon.display] = structuredClone(icon);
    }
    let selectedPreset = '';
    let newPresetText = '';
    const placeholderKeyUp = (e:KeyboardEvent)=>{
        let newPreset = newPresetText.trim();        
        if(e.key == 'Enter' && newPreset.length > 0){
            iconsGrouped[newPreset] = {};
            newPresetText = '';
            selectedPreset = newPreset;
        }
    }
    const checkDuplicate = (icon:string) =>{
        let iconObj = iconsGrouped[selectedPreset][icon];
        for(let otherIcon in iconsGrouped[selectedPreset]){
            if(otherIcon !== icon){
                let otherIconObj = iconsGrouped[selectedPreset][otherIcon];
                if(iconObj.display.trim() == otherIconObj.display.trim()){
                    disableSave = true;
                    return 'duplicate';
                }
            }
        }
        disableSave = false;
        return '';
    }
    const addRow = ()=>{
        let ID = Math.random().toString();
        iconsGrouped[selectedPreset][ID] = {
            display:'',
            url:'',
            preset:selectedPreset,
            color:''
        }
    }
    const deleteIcon = (icon:string)=>{
        delete iconsGrouped[selectedPreset][icon];
        iconsGrouped = iconsGrouped;
    }
    const savePreset = ()=>{        
        io.emit('upsert-icons',iconsGrouped[selectedPreset]);
    }
</script>
<div id='iconContainer'>
    <div class='presetContainer'>
        {#each Object.keys(iconsGrouped) as preset}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div 
                class={'preset' + (preset == selectedPreset ? ' selected' : '')}
                on:click={()=>{selectedPreset=preset}}
            >
                {preset}
            </div>
        {/each}
        <input placeholder="Create new preset" bind:value={newPresetText} on:keyup={placeholderKeyUp}>
    </div>
    <div class='iconList'>
        {#if selectedPreset}
            <table>

            <tr>
                <th colspan=2>Name</th>
                <th>URL</th>
                <th colspan=2>User Color</th>
                <th></th>
            </tr>
            {#each Object.keys(iconsGrouped?.[selectedPreset] ?? {}) as icon}
                <tr>
                    <td>
                        {#if iconsGrouped[selectedPreset][icon].url}
                            <img 
                                src={iconsGrouped[selectedPreset][icon].url} 
                                alt={iconsGrouped[selectedPreset][icon].url}
                            />
                        {/if}
                    </td>
                    <td>
                        <input style:width={'5rem'} 
                        bind:value={iconsGrouped[selectedPreset][icon].display} 
                        class={checkDuplicate(icon)}>
                    </td>
                    <td>
                        <input 
                        bind:value={iconsGrouped[selectedPreset][icon].url} >
                    </td>
                    <td>
                        <input style:width={'5rem'} 
                        bind:value={iconsGrouped[selectedPreset][icon].color} >
                    </td>
                    <td 
                        style:background={iconsGrouped[selectedPreset][icon].color} 
                        style:width={'1.8rem'} style:border-radius={'4px'}>
                    </td>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <td class='iconDelete' on:click={()=>deleteIcon(icon)}>
                        <MdDelete />
                    </td>
                </tr>
            {/each}
                <tr>
                    <td colspan=5>                        
                        <button on:click={()=>{addRow()}}>Add New</button>
                        {#key disableSave}
                            <button on:click={()=>{savePreset()}} disabled={disableSave}>Save</button>
                        {/key}
                    </td>
                </tr>
        </table>
        {/if}
    </div>
</div>
<style>
    #iconContainer{
        display:flex;
    }
    .presetContainer{
        padding-right: 5px;
        border-right: solid 3px var(--color-bg-2);
    }
    .iconList{
        min-width: 10rem;
    }
    .preset{
        cursor: pointer;
    }
    .preset.selected{
        cursor: default;
        font-weight: bold;
    }
    .presetContainer input{
        width:10rem
    }
    .iconList img{
        height:1.8rem;
        width:1.8rem;
        max-width: 1.8rem;
    }
    .iconList td{
        height:1.8rem;
        vertical-align: middle;
    }
    .saveTD{
        cursor: pointer;
    }
    .saveTD:hover{
        background-color: var(--color-bg-2);
        border-radius: 3px;
    }
    .duplicate{
        background:#7a2121;
        color:white;
    }
    .iconDelete:hover{
        cursor: pointer;
        background-color: var(--color-bg-2);
        border-radius: 3px;
        width:1.8rem;
    }
</style>