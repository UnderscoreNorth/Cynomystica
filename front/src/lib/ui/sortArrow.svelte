<script lang="ts">
    export let name:string;
    export let selected:string;
    export let dir:number;
    //@ts-ignore
    import MdArrowDropUp from 'svelte-icons/md/MdArrowDropUp.svelte'
    //@ts-ignore
    import MdArrowDropDown from 'svelte-icons/md/MdArrowDropDown.svelte'
</script>
<div class='sortArrow'>
{#if selected == name}
    {#if dir==1}
    <MdArrowDropUp />
    {:else}
    <MdArrowDropDown />
    {/if}
{/if}
</div>
<style>
    .sortArrow{
        display:inline-block;
        aspect-ratio: 1;
        height:inherit
    }
</style>