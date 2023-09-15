<script>
    import { schedule } from "$lib/stores/schedule";
    console.log(3,$schedule);
</script>
<table>
{#each $schedule as item}
    <tr>
        <td>{item.url}</td>
        <td>{item.playTimeUTC}</td>
    </tr>
{/each}
</table>