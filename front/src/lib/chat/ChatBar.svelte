<script lang="ts">
	import { io } from '$lib/realtime';
	import { user } from '$lib/stores/user';
	import { blocker } from '$lib/stores/blocker';
	import type { Icon } from '$lib/stores/icons';
	import { icons} from '$lib/stores/icons';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { login } from '$lib/utilities/login';
	import { users } from '$lib/stores/users';
	import { userSettings } from '$lib/stores/userSettings';
	import { tabText } from '$lib/stores/tabText';
	let inputValue: string;
	let lastInput = '';
	let iconListOpen = false;
	let lastKey = '';
	let tabIndex = 0;
	let tabRegex = /([^ ]+)$/g;
	let sent:Array<string> = [];
	let sentIndex = -1;
	const handleKeyDown = (e: KeyboardEvent) => {
		if(e.key == 'Tab'){
			e.preventDefault();
			let tabWord = lastInput.match(tabRegex)?.[0].toLowerCase() ?? '';
			if(tabWord?.length){
				let matched = $users.users.filter((otherUser)=>{
					return otherUser.username.toLowerCase().indexOf(tabWord) == 0
				}).map((otherUser)=>otherUser.username);
				if(matched.length){
					inputValue = lastInput.replace(tabRegex,matched[tabIndex])
					tabIndex++;
					if(tabIndex >= matched.length)
						tabIndex = 0;
				}
			}
		} else {
			tabIndex = 0;
		}
		if (e.key == 'Enter' && inputValue.trim().length > 0) {
			if (!$user.username.length) {
				login(inputValue.trim(),'','guest');
			} else {
				sent.unshift(inputValue)
				if($user.accessLevel < 4){
					inputValue = inputValue.replace(/(http[^\s]+):pic/gmi,'$1');
				}
				io.emit('message', {icon:$userSettings.icon ?? '', msg:inputValue.trim()});
			}
			inputValue = '';
		}
		lastKey = e.key;
	};
	const handleKeyUp = (e:KeyboardEvent)=>{
		if(e.key !== 'Tab')
			lastInput = inputValue;
		if(['ArrowUp','ArrowDown'].includes(e.key)){
			if(sent.length){
				if(e.key == 'ArrowUp'){
					sentIndex++;
				} else {
					sentIndex--;
				}
				if(sentIndex >= sent.length){
					sentIndex = 0;
				} else if (sentIndex < 0){
					sentIndex = sent.length -1;
				}
				inputValue = sent[sentIndex]
			}	
		} else {
			sentIndex = -1;
		}
	}
	const toggleIconList = (e:MouseEvent)=>{
		iconListOpen = !iconListOpen;
		e.stopPropagation();
	}
	const selectIcon = (icon:any)=>{
		$userSettings.icon = icon;
	}
	const handleFocus = ()=>{
		$tabText = '';
	}
	onMount(() => {
	if(browser){
		window.addEventListener("click", function(event) {
			iconListOpen = false;
		});
	}
});
	
</script>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id='iconSelect' on:click={toggleIconList} >
		{#if $userSettings.icon && $icons[$userSettings.icon]?.url}
		<img src={$icons[$userSettings.icon].url} alt='icon' />
		{/if}
	</div>
	{#if iconListOpen}	
	<div id='iconList'>
		{#each Array.from(new Set(Object.values($icons).map(x=>x.preset))) as preset}
			<div class='presetContainer'>
				<div>
					<b>{preset}</b>
				</div>
				{#each Object.entries($icons) as [id,icon]}
					{#if icon.preset == preset}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div on:click={()=>{selectIcon(id)}} class='iconListItem'>
							{#if icon.url}
								<img src={icon.url} alt='icon' />
							{/if}
							<span>
								{icon.display}
							</span>
						</div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
	{/if}
	<input
	id="inputBar"
	placeholder={$user.username ? '' : 'Enter a username (Guest)'}
	disabled={$blocker.login}
	bind:value={inputValue}
	on:keydown={handleKeyDown}
	on:keyup={handleKeyUp}
	on:focus={handleFocus}
	autocomplete="off"
/>
<style>
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
		color:black;
	}
	.presetContainer{
		display:inline-block;
		vertical-align: top;
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
	#iconSelect img{
		margin-bottom:-0.1rem;
		margin-top:-1px;
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

