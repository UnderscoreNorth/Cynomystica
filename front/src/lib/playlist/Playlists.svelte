<script lang="ts">
    import type {playlistType} from "$lib/stores/playlists";
    import { io } from "$lib/realtime";
    //@ts-ignore
    import MdDelete from 'svelte-icons/md/MdDelete.svelte'
    import Modal from "$lib/ui/modal.svelte";
    import { user } from "$lib/stores/user";
    import { permissions } from "$lib/stores/permissions";
    import accessLevels from "$lib/accessLevels";
    import { secondsToTime,dateTime } from "$lib/utilities/timeUtilities";    

    let playlistsTemp:Record<string, playlistType> = {};
    io.emit('get-playlists');
    io.on('playlists',(e)=>{
        playlistsTemp = e;
    })
    let deleteModal = '';
    let selectedPlaylist = '';
    let presetTblEl:HTMLTableElement;
    let playlistTblEl:HTMLTableElement;
    let override = '';
    let url = '';
    const createNewPlaylist = ()=>{
        io.emit('upsert-playlist',{}); 
        /*let tempID = 'n' + Math.random();
        playlistsTemp[tempID] = {
            id:tempID,
            name:'New Playlist',
            description:'',
            owner:$user.username,
            mode:'Random',
            items:[],
            durationLimit:-1,
            itemLimit:-1,
            allowDuplicates:true,
            deleteAfter:-1,
            minAccessLevel:3
        }
        selectedPlaylist = tempID*/
    }
    const updatePlaylist = ()=>{
        io.emit('upsert-playlist',selPlay); 
    }
    $: selPlay = playlistsTemp[selectedPlaylist];
    const addToPlaylist = ()=>{
        url = url.trim();
        override = override.trim();
        if(url.length)
        io.emit('add-to-playlist',{
                playlist:selPlay.id,
                override,
                url
        });
        /*setTimeout(()=>{
            playlistTblEl.lastElementChild?.scrollIntoView();
        },50)*/
    }
    const deletePlaylist = (playlist:playlistType)=>{        
        io.emit('delete-playlist',playlist);        
    }
    const changeselectedPlaylist = (preset:string)=>{
        selectedPlaylist = preset;
    }
    $: accessKeys = Object.keys(accessLevels).map(x=>parseInt(x));
</script>
<div id='playlistContainer'>
    <div class='presetContainer'>
        <div class='scroller'>
            <table bind:this={presetTblEl}>
                {#each Object.values(playlistsTemp) as preset}
                <tr>
                    
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <td 
                        class={'preset' + (preset.id == selectedPlaylist ? ' selected' : '')}
                        style:font-style={preset.id.startsWith('n') ? 'italics' : ''}
                        on:click={()=>{changeselectedPlaylist(preset.id)}}>
                            {preset.name}
                    </td>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <td class='playlistDelete' style:height={'1rem'} on:click={()=>deleteModal=preset.id}>
                        <MdDelete />
                    </td>
                </tr>
            {/each}
            </table>
        </div>
        {#if $user.accessLevel >= $permissions.createPlaylists}
            <button on:click={createNewPlaylist}>Create new playlist</button>
        {/if}
    </div>
    <div id='playlistMetaContainer'>
        {#if selectedPlaylist}
        <div class='metaHeader'>Name</div>
        <div>{#if $user.username == selPlay.owner}
                <input bind:value={selPlay.name} />
            {:else}
                {selPlay.name}
            {/if}</div>
        <div class='metaHeader'>Owner</div>
        <div>{selPlay.owner}</div>
        <div class='metaHeader'>Description</div>
        <div>{#if $user.username == selPlay.owner}
            <textarea bind:value={selPlay.description} />
        {:else}
            {selPlay.description}
        {/if}</div>
        <div style:grid-column='span 2'><center>Limits are total by user, -1 denotes no limit</center></div>
        <div class='metaHeader'>Duration Limit (Min)</div>
        <div><input type='number' min=-1 step='1' bind:value={selPlay.durationLimit} disabled={$user.username !== selPlay.owner}/></div>
        <div class='metaHeader'>Item Limit</div>
        <div><input bind:value={selPlay.itemLimit} disabled={$user.username !== selPlay.owner} /></div>
        <div class='metaHeader'>Allow Duplicates</div>
        <div><input type='checkbox' bind:checked={selPlay.allowDuplicates} disabled={$user.username !== selPlay.owner}/></div>
        <div class='metaHeader'>Delete After # of Plays</div>
        <div><input type='number' min=-1 step='1' bind:value={selPlay.deleteAfter} disabled={$user.username !== selPlay.owner}/></div>                
        <div class='metaHeader'>Mode</div>
        <div><select bind:value={selPlay.mode}  disabled={$user.username !== selPlay.owner}>
                <option>Random</option>
                <option>Least Played</option>
                <option>Add Date</option>
            </select>
        </div>
        <div class='metaHeader'>Min User Level</div>
        <div><select bind:value={selPlay.minAccessLevel}  disabled={$user.username !== selPlay.owner}>
            {#each accessKeys as key}
                <option value={key}>{accessLevels[key]}</option>
            {/each}
        </select></div>
        <div><button on:click={updatePlaylist}>Update</button></div>
        {/if}
    </div>
    <div class='playlistList'>
        {#if selectedPlaylist}
            <div>
                <input placeholder='Title Override' bind:value={override}  disabled={$user.accessLevel < selPlay.minAccessLevel} />
                <input placeholder='URL' bind:value={url}  disabled={$user.accessLevel < selPlay.minAccessLevel} />
                <button on:click={()=>{addToPlaylist()}} disabled={$user.accessLevel < selPlay.minAccessLevel} >Add to Playlist</button>   
            </div>
            <div class='scroller'>
                <table bind:this={playlistTblEl}>
                    <tr>
                        <th>Title</th>
                        <th>Duration</th>
                        <th>Added By</th>
                        <th>Added</th>
                        <th>Play Count</th>
                    </tr>
                    {#each selPlay.items as item}
                        <tr>
                            <td><a href={item.url} target='_blank'>{item.title}</a></td>
                            <td>{secondsToTime(item.duration)}</td>
                            <td>{item.username}</td>
                            <td>{dateTime(item.dateCreated)}</td>
                            <td>{item.playcount}</td>
                        </tr>
                    {/each}                
                </table>
            </div>                 
        {/if}
    </div>
    {#if deleteModal !== ''}
    <Modal title={'Delete'} closeModal={()=>{deleteModal=''}}>
        Delete playlist: {playlistsTemp[deleteModal].name}?<br><br>
        <button on:click={()=>{deletePlaylist(playlistsTemp[deleteModal]);deleteModal = '';}}>Yes</button>
        <button on:click={()=>deleteModal=''}>No</button>
    </Modal>
    {/if}
</div>
<style>
    #playlistContainer{
        display:flex;
    }    
    .presetContainer{
        padding-right: 5px;
        border-right: solid 3px var(--color-bg-2);
        margin-right:5px;
    }
    .preset{
        cursor: pointer;
    }
    .scroller{
        height: 55svh;
        overflow-y: auto;
    }
    table{
        width:100%;
    }
    input{
        width:fit-content;
    }
    .preset.selected{
        cursor: default;
        font-weight: bold;
    }
    .playlistList td{
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
    .playlistDelete:hover{
        cursor: pointer;
        background-color: var(--color-bg-2);
        border-radius: 3px;
        aspect-ratio: 1;
    }
    textarea{
        width:-webkit-fill-available;
        height:4rem;
    }
    #playlistMetaContainer{
        width:13rem;
    }
    .metaHeader{
        font-weight: bold;
    }
    .metaHeader + div{
        margin-bottom:5px;
    }
    @media (orientation:portrait){
        #playlistMetaContainer{
            width:auto;
            display:grid;
            grid-template-columns: auto auto;
        }
        #playlistContainer{
            display:block;
            width:100%;
        }
        .presetContainer{
            padding-right: 0;
            border-right: none;
        }
        .playlistList{
            width:100%;
        }
        .scroller{
        height: auto;
        overflow-y: auto;
        width:100%;
        }
    }
</style>