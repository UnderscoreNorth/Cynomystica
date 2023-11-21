<script>
	import Header from '$lib/header/Header.svelte';
	import './styles.css';
</script>

<div class="app">
	<main>
		<Header />
		<slot />
	</main>
</div>

<style>
	.app {
		min-height: 100vh;
	}

	main {
		width: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 2rem 1fr;
		gap: 0px 0px;
		height: 100vh;
	}
</style>
