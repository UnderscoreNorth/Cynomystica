<script lang="ts">
	export let closeModal: Function;
	
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modalbg" on:click={closeModal()}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div id="infoContainer">
		<span
			class="modal"
			on:click={(e) => {
				e.stopPropagation();
			}}
		>
			<h3>
				Information
			</h3>
			<hr />
            <a target='_blank' rel="noreferrer" href='https://forms.gle/vouJ1c4m7iSysj789'>Submit Suggestions https://forms.gle/vouJ1c4m7iSysj789</a>
            <h4>Chat Commands</h4>
            <table>
                <tr><td>*text*</td><td><b>text</b></td></tr>
                <tr><td>_text_</td><td><em>text</em></td></tr>
                <tr><td>CTRL+S</td><td>inserts or wraps selected<br>text in [s][/s] tags</td></tr>
                <tr><td>[s]text[/s]</td><td><span class='spoilertext'>text</span></td></tr>
                <tr><td>red: text</td><td><span class='redtext'>text</span></td></tr>
                <tr><td>blue: text</td><td><span class='bluetext'>text</span></td></tr>
                <tr><td>>text</td><td><span class='greentext'>>text</span></td></tr>
                <tr><td>/me text</td><td>/me text</td></tr>
                <tr><td>TAB</td><td>autocompletes username<br>tab again to cycle</td></tr>
                <tr><td>↑/↓</td><td>Cycles through previous<br>sent messages</td></tr>
            </table>
            <h4>Update Log</h4>
            <b>Dec 17, 2023</b>
            <ul>
                <li>Persistent user settings</li>
                <li>Can move chat window to the right side</li>
                <li>Vertical mode applies if height is greater than width of screen</li>
                <li>Danmaku text shouldn't wrap anymore</li>
                <li>Text formatting on danmaku</li>
                <li>Red,blue, and spoiler text filters</li>
                <li>Chat bar moved to top of chat window in vertical mode</li>
            </ul>
		</span>
	</div>
</div>

<style>
	#infoContainer {
		width: 80vw;
		max-width: 80em;
		margin-top: 2em;
        color:white;
        max-height:90vh;
        overflow-y:auto;
        overflow-x:hidden;
	}
    #infoContainer table td{
        padding:2px 5px;
    }
    #infoContainer table{
        border-collapse: collapse;
    }
    #infoContainer table td{
        border: solid 1px;
    }
	@media (max-width: 768px) or (orientation:portrait) {
		#infoContainer{
			font-size: 0.7rem;
			width:calc(100vw - 6em);
		}
	}
</style>
