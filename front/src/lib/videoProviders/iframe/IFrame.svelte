<script lang="ts">
	import { video } from '$lib/stores/video';	
</script>
<div id='iFrameContainer'>
    {@html $video.url}
</div>
<style>
    :global(#iFrameContainer,#iFrameContainer iframe){
        height: 100%;
		width: 100%;
    }
</style>
