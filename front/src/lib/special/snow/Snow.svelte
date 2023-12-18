<script lang='ts'>
    function getStyle(){
        let xStart = Math.random();
        let angle = (Math.random() - 0.5) * 0.25;
        let xMid = xStart + angle;
        let xEnd = xMid + angle * Math.random();
        let scale = Math.random() * 0.8 + 0.2;
        let duration = Math.random() * 20 + 10;
        let delay = Math.random() * -duration;
        let mid = 0.5 + (Math.random() - 0.5) * 0.2;
        return `
        opacity:${Math.random()};
        animation:snowfall ${duration}s linear infinite;
        animation-delay:${delay}s;
        --xStart:${xStart*100}vw;
        --xEnd:${xEnd*100}vw;
        --scale:${scale};
        --xMid:${xMid*100}vw;
        --yMid:${mid*100}vh;
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
    @keyframes -global-snowfall {
        from {
            transform: translate(var(--xStart), calc(0vh - 20px)) scale(var(--scale));
        }
        50% {
            transform: translate(var(--xMid), var(--yMid)) scale(var(--scale));
        }
        to {
            transform: translate(var(--xEnd), calc(100vh + 20px)) scale(var(--scale));
        }
    }
 
</style>