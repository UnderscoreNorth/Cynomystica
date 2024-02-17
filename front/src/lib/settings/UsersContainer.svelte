<script lang="ts">
    import { user as me } from "$lib/stores/user";
    import { io } from "$lib/realtime";
    import SortArrow from "$lib/ui/sortArrow.svelte";  
    import { dateTime } from "$lib/utilities/timeUtilities";
    import accessLevels from "$lib/accessLevels";
    let users:Array<any>;
    let sortBy = 'username';
    let sortDir = 1;
    io.on('user-management',(e)=>{
        users = Array.from(e);
        sortUsers();
    });
    io.emit('get-user-management');
    const sortUsers = ()=>{
        users = users.sort((a,b)=>{
            let res;
            if(typeof a[sortBy] == 'string'){
                res = a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? 1 : -1;
            } else {
                res = a[sortBy] - b[sortBy]
            }
            res *= sortDir;
            return res;
        });
    }
    const changeSort = (sort:string)=>{
        if(sort == sortBy)
            sortDir *= -1;
        sortBy = sort;
        sortUsers();
    }
    const updateUser = (user:any,lvl:number)=>{
        user.accessLevel = parseInt(lvl.toString());
        io.emit('update-user-role',user);
    }
    $: accessKeys = Object.keys(accessLevels).filter(x=>parseInt(x)>0)
</script>
<table>
    <thead>
    <tr>
        <th>

        </th>
        <th colspan={accessKeys.length} class='clickCell' on:click={()=>changeSort('accessLevel')}>
            Role 
            <SortArrow name='accessLevel' selected={sortBy} dir={sortDir} />
        </th>
        <th></th>
    </tr>
    <tr>
        <th  on:click={()=>changeSort('username')}  class='clickCell'>
            User
            <SortArrow name='username' selected={sortBy} dir={sortDir} />
        </th>
        {#each accessKeys as key}
            <th>{accessLevels[key]}</th>
        {/each}
        <th  on:click={()=>changeSort('lastLogin')}  class='clickCell'>
            Last Login
            <SortArrow name='lastLogin' selected={sortBy} dir={sortDir} />
        </th>
    </tr>
</thead>
    <tbody>  
        {#if users?.length > 0}
            {#key users}
            {#each users as user}
                <tr>
                    <td>{user.username}</td>
                    {#each accessKeys as roleLvl}
                        <td><input 
                            type='radio' 
                            name={user.username} 
                            bind:group={user.accessLevel} 
                            value={parseInt(roleLvl)}
                            on:click={()=>updateUser(user,roleLvl)}
                            disabled={user.username == $me.username ||((user.accessLevel >= $me.accessLevel) || parseInt(roleLvl) > $me.accessLevel) && $me.accessLevel !== 5}
                            >
                        </td>
                    {/each}
                    <td>{dateTime(user.lastLogin)}</td>
                </tr>
            {/each}
            {/key}
        {/if}
    </tbody>
</table>
<style>
    thead{
        position:sticky;
        top:0;
        background:var(--color-bg-3);
    }
    th{
        padding: 0 5px;
        height:1rem;
    }
    tbody tr:nth-child(2n){
        background:rgba(255,255,255,0.2)
    }
    .clickCell:hover{
        cursor: pointer;
        background-color: var(--color-bg-2);
    }
    table{
        border-collapse: collapse;
    }
</style>
