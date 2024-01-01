<script lang='ts'>
	import { permissions } from "$lib/stores/permissions";
	import { info } from "$lib/stores/info";
	import { user } from "$lib/stores/user";
	import { io } from "$lib/realtime";
	import { onMount } from "svelte";
	let infoEl:HTMLTextAreaElement;
	let liveEdit = false;
	onMount(()=>{
		if(infoEl)
			infoEl.value = $info.replace(/&lt;/g,'<');
	})
	const handleKeyDown = (e:KeyboardEvent) =>{
		if(e.key == 'Tab'){
			e.preventDefault();
			let start = infoEl.selectionStart;
    		let end = infoEl.selectionEnd;
			infoEl.value = infoEl.value.substring(0, start) + "\t" + infoEl.value.substring(end);
			infoEl.selectionStart = infoEl.selectionEnd = start + 1;
		}
	}
	const infoChange = ()=>{
		let allowedEl = [
			'div',
			'style',
			'span',
			'table',
			'thead',
			'tbody',
			'tr',
			'td',
			'th',
			'b',
			'hr',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'a',
			'p',
			'i',
			'u',
			'img',
			'video',
			'ol',
			'ul',
			'li',
			'center'
		]
		if(liveEdit){
			let tempHTML = infoEl.value.replace(/</g,'&lt;');
			for(let el of allowedEl){
				let regex = new RegExp(`&lt;` + el,'gi');
				tempHTML = tempHTML.replace(regex,'<' + el);
				regex = new RegExp(`&lt;/` + el,'gi');
				tempHTML = tempHTML.replace(regex,'</' + el);
			}
			$info = tempHTML;
		}
	}
	const saveEdit = ()=>{
		io.emit('update-info',infoEl.value);
	}
</script>
{#if $user.accessLevel >= $permissions.manageInfoModal }
<div id='infoEditContainer'>
	<textarea 
		id='infoEditText'
		bind:this={infoEl}
		on:keydown={handleKeyDown} 
		contenteditable=true 
		on:paste={()=>infoChange()}
		on:keyup={()=>infoChange()}
	/>
	<span id='infoEditControls'>
		<input type='checkbox' bind:checked={liveEdit}> Live Edit<br>
		<button id='infoEditSave' on:click={()=>saveEdit()}>Save</button>
	</span>
</div>
<hr>
{/if}
{@html $info}
<style>
	#infoEditContainer{
		display: flex;		
	}
	#infoEditText {flex-grow:1}
	#infoEditSave{
		width:100%
	}
</style>
