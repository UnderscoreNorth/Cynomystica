<script lang="ts">
    import { emotes,type Emote } from "$lib/stores/emotes";
    import { io } from "$lib/realtime";
    //@ts-ignore
    import MdDelete from 'svelte-icons/md/MdDelete.svelte'
    import Modal from "$lib/ui/modal.svelte";
    import { presets } from "$lib/stores/presets";

    let emotesGrouped:Record<string, Record<string, Emote>> = {};
    let disableSave = false;
    emotes.subscribe((e)=>{
        emotesGrouped = {};
        for(let emote of Object.values($emotes)){
            emotesGrouped[emote.preset] = emotesGrouped[emote.preset] || {};
            emotesGrouped[emote.preset][emote.text] = structuredClone(emote);
        }
    })
    let deleteModal = '';
    let selectedPreset = '';
    let newPresetText = '';
    let textEl:HTMLTextAreaElement;
    let presetTblEl:HTMLTableElement;
    let emoteTblEl:HTMLTableElement;
    const placeholderKeyUp = (e:KeyboardEvent)=>{
        let newPreset = newPresetText.trim();        
        if(e.key == 'Enter' && newPreset.length > 0 && !Object.keys(emotesGrouped).includes(newPreset)){
            emotesGrouped[newPreset] = {
            0:{
                text:'',
                url:'',
                preset:newPreset
            }};
            newPresetText = '';
            changeSelectedPreset(newPreset);
            setTimeout(()=>{
                presetTblEl.lastElementChild?.scrollIntoView();
            },50);
        }
    }
    const checkDuplicate = (emote:string) =>{
        let emoteObj = emotesGrouped[selectedPreset][emote];
        for(let otheremote in emotesGrouped[selectedPreset]){
            if(otheremote !== emote){
                let otheremoteObj = emotesGrouped[selectedPreset][otheremote];
                if(emoteObj.text.trim() == otheremoteObj.text.trim()){
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
        emotesGrouped[selectedPreset][ID] = {
            text:'',
            url:'',
            preset:selectedPreset,
        }
        setTimeout(()=>{
            emoteTblEl.lastElementChild?.scrollIntoView();
        },50)
    }
    const deleteemote = (emote:string)=>{
        delete emotesGrouped[selectedPreset][emote];
        emotesGrouped = emotesGrouped;
    }
    const exportJSON = ()=>{        
        textEl.value = JSON.stringify(
            Object.values(emotesGrouped[selectedPreset])
            .map((x)=>{delete x?.preset; return x}));
        textEl.select();
    }
    const importJSON = ()=>{
        try{
            let importObj = JSON.parse(textEl.value ?? '');
            importObj = importObj.map((x)=>{x.preset = selectedPreset; return x});
            emotesGrouped[selectedPreset] = {...importObj}
        } catch{

        }
    }
    const savePreset = (deletePreset=false,preset='')=>{
        if(deletePreset){
            emotesGrouped[selectedPreset] = {}
        }        
        io.emit('upsert-emotes',{preset:(preset.length ? preset : selectedPreset),emotes:emotesGrouped[selectedPreset]});        
    }
    const changeSelectedPreset = (preset:string)=>{
        selectedPreset = preset;
        if(textEl)
            textEl.value = '';
    }
</script>
<div id='emoteContainer'>
    <div class='presetContainer'>
        <div class='scroller'>
            <table bind:this={presetTblEl}>
                {#each Object.keys(emotesGrouped) as preset}
                <tr>
                    <td>
                        <input type='checkbox' style:width={'1rem'} bind:checked={$presets.emotes[preset]}>
                    </td>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <td 
                        class={'preset' + (preset == selectedPreset ? ' selected' : '')}
                        on:click={()=>{changeSelectedPreset(preset)}}>
                            {preset}
                    </td>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <td class='emoteDelete' style:height={'1rem'} on:click={()=>deleteModal=preset}>
                        <MdDelete />
                    </td>
                </tr>
            {/each}
            </table>
        </div>
        <input placeholder="Create new preset" bind:value={newPresetText} on:keyup={placeholderKeyUp}>
    </div>
    <div class='emoteList'>
        {#if selectedPreset}
            <div class='scroller'>
                <table bind:this={emoteTblEl}>
                    <tr>
                        <th colspan=2>Name</th>
                        <th>URL</th>
                        <th></th>
                    </tr>
                    {#each Object.keys(emotesGrouped?.[selectedPreset] ?? {}) as emote}
                        <tr>
                            <td>
                                {#if emotesGrouped[selectedPreset][emote].url}
                                    <img 
                                        src={emotesGrouped[selectedPreset][emote].url} 
                                        alt={emotesGrouped[selectedPreset][emote].url}
                                    />
                                {/if}
                            </td>
                            <td>
                                <input style:max-width={'5rem'} 
                                bind:value={emotesGrouped[selectedPreset][emote].text} 
                                class={checkDuplicate(emote)}>
                            </td>
                            <td>
                                <input 
                                bind:value={emotesGrouped[selectedPreset][emote].url} >
                            </td>
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <td class='emoteDelete'  style:min-width={'1.8rem'} on:click={()=>deleteemote(emote)}>
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
        Delete emote Preset: {deleteModal}?<br><br>
        <button on:click={()=>{savePreset(true,deleteModal);deleteModal = '';}}>Yes</button>
        <button on:click={()=>deleteModal=''}>No</button>
    </Modal>
    {/if}
</div>
<style>
    #emoteContainer{
        display:flex;
    }    
    .presetContainer{
        padding-right: 5px;
        border-right: solid 3px var(--color-bg-2);
        margin-right:5px;
    }
    .emoteList{
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
    .emoteList img{
        height:1.8rem;
        width:1.8rem;
        max-width: 1.8rem;
    }
    .emoteList td{
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
    .emoteDelete:hover{
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
        #emoteContainer{
            display:block;
            width:100%;
        }
        .presetContainer{
            padding-right: 0;
            border-right: none;
        }
        .emoteList{
            width:100%;
        }
        .scroller{
        height: auto;
        overflow-y: auto;
        width:100%;
    }
    }
</style>