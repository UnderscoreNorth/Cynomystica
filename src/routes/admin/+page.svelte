<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<table>
	{#each data.users as user}
		<tr><td>{user.username}</td><td>{user.dateCreated}</td></tr>
	{/each}
</table>

<style>
	td {
		color: white;
		height: 1em;
		padding-left: 2rem;
	}
</style>
