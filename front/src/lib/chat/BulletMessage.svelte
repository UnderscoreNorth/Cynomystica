<script>
    export let message;
</script>
{#key message.played}
<div style='top:calc(2rem + {message.bulletHeight}vh)'>
    {#if message.message?.[0] == '>'}
        <span class='greentext'>{message.message}</span>
        {:else}
        {message.message}
    {/if}
</div>
{/key}

<style>
    div{
        animation: textScrollAnim 10s linear 1;
        animation-fill-mode: forwards;
        font-size:1.2rem;
        font-weight: bold;
        position:fixed;
        z-index: 10;        
        text-shadow:
	-1px -1px 0 white,
	1px -1px 0 white,
	-1px 1px 0 white,
	1px 1px 0 white;
    text-wrap: nowrap;
    }
    @keyframes textScrollAnim {
        0% {
            left:100vw;
        }
        99% {
            left:-10vw;
        }
        100%{
            left:-10vw;
            display:none;
        }
    }
</style>