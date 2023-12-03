<script lang='ts'>
    export let message:string;
    const parseMessage = (msg:string)=>{
        let arr = [{content:msg,type:'text'}];
        let formatters = [
            {type:'strong',matchRegex:/(\*[^\*]+\*)/,replaceRegex:/\*([^\*]+)\*/},
            {type:'italic',matchRegex:/(_[^_]+_)/,replaceRegex:/_([^_]+)_/},
            {type:'pic',matchRegex:/(http[^\s]+:pic)/,replaceRegex:/(http[^\s]+):pic/},
            {type:'link',matchRegex:/(http[^\s]+)/,replaceRegex:/(http[^\s]+)/},
        ]
        for(let formatter of formatters){
            let newArr = [];
            for(let msgPart of arr){
                let content = msgPart.content
                if(msgPart.type == 'text'){
                    let tempArr = content.split(formatter.matchRegex);
                    for(let splitContent of tempArr){
                        let type = 'text';
                        if(splitContent.match(formatter.matchRegex)){
                            type = formatter.type;
                            splitContent = splitContent.match(formatter.replaceRegex)?.[1] ?? splitContent
                        }
                        newArr.push({content:splitContent, type})
                    }
                } else {
                    newArr.push(msgPart);
                }
            }
            arr = newArr;
        }
        return arr;
    }
</script>
{#each parseMessage(message) as msgPart}
    {#if msgPart.type == 'strong'}
        <strong>{msgPart.content}</strong>
    {:else if msgPart.type == 'italic'}
        <em>{msgPart.content}</em>
    {:else if msgPart.type== 'pic'}
        <!-- svelte-ignore a11y-missing-attribute -->
        <a href={msgPart.content} target='_blank' rel="noreferrer">
            <img src={msgPart.content} />
        </a>
    {:else if msgPart.type == 'link'}
        <a href={msgPart.content} target='_blank' rel="noreferrer">{msgPart.content}</a>
    {:else}
        {msgPart.content}
    {/if}
{/each}