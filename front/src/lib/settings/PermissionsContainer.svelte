<script lang='ts'>
    import { permissions, type Permissions } from "$lib/stores/permissions";
    import { io } from "$lib/realtime";
    const userTypes = {
        '-1':'Anonymous',
        '0':'Guest',
        '1':'Registered',
        '2':'Member',
        '3':'Moderator',
        '4':'Administrator',
        '5':'Owner'
    }
    let permObj:Permissions;
    const updatePermObj = ()=>{
        permObj = structuredClone($permissions);
    }
    permissions.subscribe((e)=>{
        updatePermObj();
    })
    const savePermissions = ()=>{
        io.emit('upsert-permissions',permObj)
    }
</script>
<table>
{#each Object.keys(permObj) as permission}
    <tr>
        <td>{permission.replace(/([A-Z]+)/g, " $1").replace(
            /\w\S*/g,
            function(txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
          )}</td>
        <td>
            <select bind:value={permObj[permission]}>
                {#each Object.keys(userTypes) as lvl}
                    <option value={parseInt(lvl)}>{userTypes[lvl]}</option>
                {/each}
            </select>
        </td>
    </tr>
{/each}
</table>
<button on:click={()=>savePermissions()}>Save permissions</button>