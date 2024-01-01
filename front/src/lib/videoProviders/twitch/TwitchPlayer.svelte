<script lang="ts">
	import { video } from '$lib/stores/video';
	import CONFIG from '$lib/clientconfig.json'
    export let type:string;
</script>

<iframe
    src={`https://player.twitch.tv?${type == 'live' ? 'channel=' : 'video=v'}${$video.url}&parent=${CONFIG.WEBSITE_URL.replace(/^.+\/\//,'')}&autoplay=true`}
    title='Twitch Player'
>
    
</iframe>

<style>
	iframe {
		height: 100%;
		width: 100%;
	}
</style>
