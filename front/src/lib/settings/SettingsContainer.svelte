<script lang='ts'>
    import UserSettingsContainer from "./UserSettingsContainer.svelte";    
    import { user } from "$lib/stores/user";
	import EmotesContainer from "./EmotesContainer.svelte";
    import IconsContainer from './IconsContainer.svelte'
    let tabs = ['User'];
    if($user.accessLevel >= 4){
        tabs.push('Emotes');
        tabs.push('Icons');
    }
    let selectedTab = 'User';
</script>
{#each tabs as tab}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span 
        class={'tabHeader' + (tab==selectedTab ? ' selected' : '')}
        on:click={()=>selectedTab=tab}
    >{tab}</span>
{/each}
<hr>
{#if selectedTab == 'User'}
<UserSettingsContainer />
{:else if selectedTab == 'Emotes'}
<EmotesContainer />
{:else if selectedTab == 'Icons'}
<IconsContainer />
{/if}

<style>
    .tabHeader{
        padding:0 5px;
        cursor: pointer;
    }
    .tabHeader.selected{
        cursor:default;
        font-weight: bold;
        border-radius: 2px 2px 0 0;
    }
</style>