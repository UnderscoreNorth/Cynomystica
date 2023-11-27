<script lang='ts'>
    import { schedule } from "$lib/stores/schedule";
    import moment from 'moment'
    import type { Moment } from "moment";
    import { io } from "$lib/realtime";
    let date = moment().startOf('day');
    let week = [] as Array<Moment>;
    let scheduleArray = [];
    let scheduleObject = [];
    io.emit('get-schedule');    
    const getSchedule = ()=>{
        week = [];
        scheduleArray = new Array(288);
        scheduleObject = new Array();
        for(let i = 0; i<7;i++){
            week.push(date.clone().add(i,'days'));      
        }
        for(let item of $schedule){
            let itemMoment = moment.utc((item.playTimeUTC)).local();        
            let diff = Math.floor(itemMoment.diff(date)/86400000);
            if(diff < 7){
                let minute = Math.floor((parseInt(itemMoment.format('H')) * 60 + parseInt(itemMoment.format('m'))) / 5);
                scheduleArray[minute] = scheduleArray[minute] || ['','','','','','',''];
                scheduleArray[minute][diff] = item.title;
            }
        }
        for(let minuteShort in scheduleArray){
            let hour = Math.floor(parseInt(minuteShort) * 5 / 60).toString().padStart(2,'0');
            let minute = (parseInt(minuteShort) * 5 % 60).toString().padStart(2,'0');   
            if(scheduleArray[minuteShort]?.length > 0){
                scheduleObject.push([`${hour}:${minute}`,...scheduleArray[minuteShort]]);
            }
        }
    }
    const moveDate = (int:number) =>{
        date.add(int,'days');
        io.emit('get-schedule');    
    }
    schedule.subscribe(()=>{
        getSchedule();
    })
</script>
<table>
    <tr>
        <th style='width:4rem'><button on:click={()=>{moveDate(-1)}}>{`<`}</button><button on:click={()=>{moveDate(1)}}>{`>`}</button></th>
        {#each week as day}
            <th>{day.format('ddd DD')}</th>
        {/each}
    </tr>        
    {#if scheduleObject.length > 0}
        {#each scheduleObject as row}
        <tr>
            {#each row as td}
                <td>{td}</td>
            {/each}
        </tr>
        {/each}
    {/if}        
</table>
<style>
    table{
        width:100%;
        table-layout: fixed;
        border-collapse: collapse;
    }
    td{text-align: center;width:20%;border:1px solid}
</style>