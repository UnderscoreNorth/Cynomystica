<script lang='ts'>
    import { permissions, permissionGrouping, type Permissions } from "$lib/stores/permissions";
    import { io } from "$lib/realtime";
    import camelToProper from "$lib/utilities/camelToProper";
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
    {#each Array.from(new Set(Object.values(permissionGrouping))) as group}
        {#each Object.keys(permObj).filter(x=>permissionGrouping[x] == group) as permission, i}
            <tr>
                {#if i == 0}
                <td
                rowspan={Object.keys(permObj).filter(x=>permissionGrouping[x] == group).length}>{group}</td>
                {/if}
                <td>{camelToProper(permission)}</td>
                <td>
                    <select bind:value={permObj[permission]}>
                        {#each Object.keys(userTypes) as lvl}
                            <option value={parseInt(lvl)}>{userTypes[lvl]}</option>
                        {/each}
                    </select>
                </td>
            </tr>
        {/each}
    {/each}
</table>
<button on:click={()=>savePermissions()}>Save permissions</button>
<style>
    td{
        vertical-align: top;
        text-align: right;
    }
</style>