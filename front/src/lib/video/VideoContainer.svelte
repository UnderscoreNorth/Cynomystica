<script lang="ts">
	import { userSettings } from '$lib/stores/userSettings';
	import Video from './Video.svelte';
	import { browser } from '$app/environment';
	import { chat } from '$lib/stores/chat';
	let chatMessageElem:HTMLElement|null;
	let videoHeight;
	let bulletHeight = 0;
	if(browser)
		chatMessageElem = document.getElementById('cVideo');
	chat.subscribe((value) => {
		for(let message of value){
			if(!message.played){
				message.played = true;
				if($userSettings.display.danmaku){
					let bulletMessage = document.createElement('div');
					bulletMessage.innerText = message.message;
					bulletMessage.classList.add('bulletText');
					chatMessageElem?.appendChild(bulletMessage);
					bulletMessage.style.top = `${bulletHeight}px`;
					bulletHeight += 20;	
					if(bulletHeight > videoHeight - 40){
						bulletHeight = 0;
					}
					setTimeout(()=>{
						bulletMessage.remove();
					},10000)
				}
			}
		}
	});
</script>

<div id="videoContainer" style='width:100%' bind:clientHeight={videoHeight}><Video /></div>
<style>
	#videoContainer {
		background: black;
		height:100%;
		vertical-align: top;
		float:left;
		position:relative;
	}

	:global(.bulletText){
        animation:textScrollAnim 10s linear 1;
        animation-fill-mode: forwards;
        font-size:2rem;
        font-weight: bold;
        position:absolute;
        z-index: 1;       
		color:black; 
        text-shadow:
		-1px -1px 0 white,
		1px -1px 0 white,
		-1px 1px 0 white,
		1px 1px 0 white;
		height:2rem;
		width:100%;
		text-align: left;
    }
    @keyframes textScrollAnim {
        0% {
            right:-100%;
        }
        99% {
            right:100%;
        }
        100%{
            right:100%;
            display:none!important;
        }
    }
</style>
