<script lang="ts">
    import { icons} from "$lib/stores/icons";
    import type{ Icon } from "$lib/stores/icons";
    import { io } from "$lib/realtime";
    //@ts-ignore
    import MdDelete from 'svelte-icons/md/MdDelete.svelte'
    import Modal from "$lib/ui/modal.svelte";
    import { presets } from "$lib/stores/presets";

    let iconsGrouped:Record<string, Record<string, Icon>> = {};
    let disableSave = false;
    icons.subscribe((e)=>{
        iconsGrouped = {};
        for(let icon of Object.values($icons)){
            iconsGrouped[icon.preset] = iconsGrouped[icon.preset] || {};
            iconsGrouped[icon.preset][icon.display] = structuredClone(icon);
        }
    })
    let deleteModal = '';
    let selectedPreset = '';
    let newPresetText = '';
    let textEl:HTMLTextAreaElement;
    let presetTblEl:HTMLTableElement;
    let iconTblEl:HTMLTableElement;
    const placeholderKeyUp = (e:KeyboardEvent)=>{
        let newPreset = newPresetText.trim();        
        if(e.key == 'Enter' && newPreset.length > 0 && !Object.keys(iconsGrouped).includes(newPreset)){
            iconsGrouped[newPreset] = {
            0:{
                display:'',
                url:'',
                preset:newPreset,
                color:''
            }};
            newPresetText = '';
            changeSelectedPreset(newPreset);
            setTimeout(()=>{
                presetTblEl.lastElementChild?.scrollIntoView();
            },50);
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
        setTimeout(()=>{
            iconTblEl.lastElementChild?.scrollIntoView();
        },50)
    }
    const deleteIcon = (icon:string)=>{
        delete iconsGrouped[selectedPreset][icon];
        iconsGrouped = iconsGrouped;
    }
    const exportJSON = ()=>{        
        textEl.value = JSON.stringify(
            Object.values(iconsGrouped[selectedPreset])
            .map((x)=>{delete x?.preset; return x}));
        textEl.select();
    }
    const importJSON = ()=>{
        try{
            let importObj = JSON.parse(textEl.value ?? '');
            importObj = importObj.map((x)=>{x.preset = selectedPreset; return x});
            iconsGrouped[selectedPreset] = {...importObj}
        } catch{

        }
    }
    const savePreset = (deletePreset=false,preset='')=>{
        if(deletePreset){
            iconsGrouped[selectedPreset] = {}
        }        
        io.emit('upsert-icons',{preset:(preset.length ? preset : selectedPreset),icons:iconsGrouped[selectedPreset]});        
    }
    const changeSelectedPreset = (preset:string)=>{
        selectedPreset = preset;
        if(textEl)
            textEl.value = '';
    }
</script>
<div id='iconContainer'>
    <div class='presetContainer'>
        <div class='scroller'>
            <table bind:this={presetTblEl}>
                {#each Object.keys(iconsGrouped) as preset}
                <tr>
                    <td>
                        <input type='checkbox' style:width={'1rem'} bind:checked={$presets.icons[preset]}>
                    </td>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <td 
                        class={'preset' + (preset == selectedPreset ? ' selected' : '')}
                        on:click={()=>{changeSelectedPreset(preset)}}>
                            {preset}
                    </td>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <td class='iconDelete' style:height={'1rem'} on:click={()=>deleteModal=preset}>
                        <MdDelete />
                    </td>
                </tr>
            {/each}
            </table>
        </div>
        <input placeholder="Create new preset" bind:value={newPresetText} on:keyup={placeholderKeyUp}>
    </div>
    <div class='iconList'>
        {#if selectedPreset}
            <div class='scroller'>
                <table bind:this={iconTblEl}>
                    <tr>
                        <th colspan=2>Name</th>
                        <th>URL</th>
                        <th colspan=2>User Color</th>
                        <th></th>
                    </tr>
                    {#each Object.keys(iconsGrouped?.[selectedPreset] ?? {}) as icon}
                        <tr>
                            <td  style:text-align='center'> 
                                {#if iconsGrouped[selectedPreset][icon].url}
                                    <img 
                                        src={iconsGrouped[selectedPreset][icon].url} 
                                        alt={iconsGrouped[selectedPreset][icon].url}
                                    />
                                {/if}
                            </td>
                            <td>
                                <input style:max-width={'5rem'} 
                                bind:value={iconsGrouped[selectedPreset][icon].display} 
                                class={checkDuplicate(icon)}>
                            </td>
                            <td>
                                <input 
                                bind:value={iconsGrouped[selectedPreset][icon].url} >
                            </td>
                            <td>
                                <input style:max-width={'5rem'} 
                                bind:value={iconsGrouped[selectedPreset][icon].color} placeholder="#000000" >
                            </td>
                            <td 
                                style:background={iconsGrouped[selectedPreset][icon].color} 
                                style:min-width={'1.8rem'} style:border-radius={'4px'}>
                            </td>
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <td class='iconDelete'  style:min-width={'1.8rem'} on:click={()=>deleteIcon(icon)}>
                                <MdDelete />
                            </td>
                        </tr>
                    {/each}
                </table>
            </div>
            {#key disableSave}
                <button on:click={()=>{importJSON()}}>Import JSON</button>           
                <button on:click={()=>{exportJSON()}} disabled={disableSave}>Export JSON</button>           
                <button on:click={()=>{addRow()}}>Add New</button>                        
                <button on:click={()=>{savePreset()}} disabled={disableSave}>Save</button>
            {/key}
            <br>
            <textarea bind:this={textEl}></textarea>
        {/if}
    </div>
    {#if deleteModal !== ''}
    <Modal title={'Delete'} closeModal={()=>{deleteModal=''}}>
        Delete Icon Preset: {deleteModal}?<br><br>
        <button on:click={()=>{savePreset(true,deleteModal);deleteModal = '';}}>Yes</button>
        <button on:click={()=>deleteModal=''}>No</button>
    </Modal>
    {/if}
</div>
<style>
    #iconContainer{
        display:flex;
    }    
    .presetContainer{
        padding-right: 5px;
        border-right: solid 3px var(--color-bg-2);
        margin-right:5px;
    }
    .iconList{
        width: 32rem;
    }
    .preset{
        cursor: pointer;
    }
    .scroller{
        height: 50svh;
        overflow-y: auto;
    }
    table{
        width:100%;
    }
    .preset.selected{
        cursor: default;
        font-weight: bold;
    }
    .presetContainer input{
        width:10rem
    }
    .iconList img{
        max-height:1.8rem;
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
        aspect-ratio: 1;
    }
    textarea{
        width:-webkit-fill-available;
        height:4rem;
    }
    @media (orientation:portrait){
        #iconContainer{
            display:block;
            width:100%;
        }
        .presetContainer{
            padding-right: 0;
            border-right: none;
        }
        .iconList{
            width:100%;
        }
        .scroller{
        height: auto;
        overflow-y: auto;
        width:100%;
    }
    }
</style>