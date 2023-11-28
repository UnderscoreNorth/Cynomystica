<script lang="ts">
	import { io } from '$lib/realtime';
	import { user } from '$lib/stores/user';
	import { blocker } from '$lib/stores/blocker';
	import type { Icon } from '$lib/stores/icons';
	import { icons} from '$lib/stores/icons';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { login } from '$lib/utilities/login';
	let inputValue: string;
	let iconListOpen = false;
	let selectedIcon = '';
	const handleKeyPress = (e: KeyboardEvent) => {
		if (e.key == 'Enter' && inputValue.trim().length > 0) {
			if (!$user.username.length) {
				login(inputValue.trim(),'','guest');
			} else {
				io.emit('message', {icon:selectedIcon ?? '', msg:inputValue.trim()});
			}
			inputValue = '';
		}
	};
	const toggleIconList = (e:MouseEvent)=>{
		iconListOpen = !iconListOpen;
		e.stopPropagation();
	}
	const selectIcon = (icon:any)=>{
		selectedIcon = icon;
	}
	onMount(() => {
	if(browser){
		window.addEventListener("click", function(event) {
			iconListOpen = false;
		});
	}
});
	
</script>
<div id='chatBarContainer'>	
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id='iconSelect' on:click={toggleIconList} >
		{#if selectedIcon && $icons[selectedIcon]?.url}
		<img src={$icons[selectedIcon].url} alt='icon' />
		{/if}
	</div>
	{#if iconListOpen}	
	<div id='iconList'>
		{#each Object.entries($icons) as [id,icon]}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div on:click={()=>{selectIcon(id)}} class='iconListItem'>
			{#if icon.url}
				<img src={icon.url} alt='icon' />
			{/if}
			<span>
				{icon.display}
			</span>
		</div>
		{/each}
	</div>
	{/if}
	<input
	id="inputBar"
	placeholder={$user.username ? '' : 'Enter a username (Guest)'}
	disabled={$blocker.login}
	bind:value={inputValue}
	on:keypress={handleKeyPress}
/>
</div>
<style>
	#chatBarContainer{
		position:relative
	}
	#iconSelect{
		position:absolute;
		float:left;
		left:0.5rem;
		width:1.8rem;
		height:1.8rem;
		top:0.1rem;
		z-index: 1;
		border-right:solid 1px;
	}
	#iconList{
		position:absolute;
		bottom:2rem;
		left:0.5rem;
		max-height:70vh;
		overflow-y: scroll;
		background:white;
		z-index:2;
	}
	.iconListItem{
		display:flex;
		align-items: center;
		height:1.8rem
	}
	.iconListItem:hover{
		background-color:#1E90FF;
	}
	.iconListItem img, #iconSelect img{
		height:1.8rem;
		width:1.8rem;
		margin-right:0.2rem;
	}
	#iconSelect:hover{
		background-color:#1E90FF;
	}
	#inputBar{
		padding:2px;
		border:0;
		height:calc(100% - 4px);
		width:calc(100% - 2px - 2.8rem);
		padding-left:2.8rem;
		margin:0;
	}
</style>

