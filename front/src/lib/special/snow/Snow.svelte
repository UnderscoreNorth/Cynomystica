<script lang='ts'>
    function getStyle(){
        let xStart = Math.random();
        let xEnd = xStart + (Math.random() - 0.5) * .50
        let scale = Math.random();
        let duration = Math.random() * 20 + 10;
        let delay = Math.random() * -duration;
        return `
        opacity:${Math.random()};
        animation:snowfall ${duration}s linear infinite;
        animation-delay:${delay}s;
        --xStart:${xStart*100}vw;
        --xEnd:${xEnd*100}vw;
        --scale:${scale};
        `;
    }
</script>
<div id='snowContainer'>
    {#each Array(500) as _,index(index)}
        <div class='snow' style={getStyle()}></div>
    {/each}
</div>
<style>
    #snowContainer{
        position:absolute;
        height:100vh;
        width:100vw;
        z-index: 3;
        top:0;
        left:0;
        pointer-events: none;
        overflow:hidden;
    }
    .snow{
        position: absolute;
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        box-shadow: 0px 0px 5px 5px white;
    }    
</style>