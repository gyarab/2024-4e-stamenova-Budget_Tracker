<script>
	import RtItem from './RtItem.svelte';
	import RtNoRecords from './RtNoRecords.svelte';

	export let recentIncomes;
	export let recentExpenses;
</script>

<div class="container text-left space-y-6 mt-4">
	<div class="space-y-4 p-4 bg-white rounded-lg shadow-lg">
		<h3 class="h3">Příjmy</h3>
		{#if !recentIncomes.length}
			<RtNoRecords />
		{:else}
			{#each recentIncomes as income, idx}
				<RtItem data={income} />
			{/each}
		{/if}
	</div>
	<div class="space-y-4 p-4 bg-white rounded-lg shadow-lg">
		<h3 class="h3">Výdaje</h3>
		{#if !recentExpenses.length}
			<RtNoRecords />
		{:else}
			{#each recentExpenses as expense, idx}
				<RtItem data={expense} />
			{/each}
		{/if}
	</div>
</div>
