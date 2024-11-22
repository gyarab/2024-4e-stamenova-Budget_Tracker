<script>
	export let description = 'Žádný popis transakce';
	export let date;
	export let id;

	const fetchDeleteOptions = {
		method: 'delete',
		body: JSON.stringify(id),
		headers: {
			'content-type': 'application/json'
		}
	};

	async function handleDelete() {
		await fetch('/api/expenses', fetchDeleteOptions);
	}
</script>

<div>
	<p><strong>Datum</strong>: {new Date(date).toLocaleDateString('cs-CZ')}</p>
	<div class="flex">
		<p>{description || 'Žádný popis transakce'}</p>
	</div>
	<button on:click={handleDelete}>Delete</button>
</div>
