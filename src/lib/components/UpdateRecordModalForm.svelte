<script>
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';
	import { recordsStore } from '$lib/stores/records';

	const modalStore = getModalStore();

	let isSubmitting = false;

	const { id, date, source, amount, category, description, isReccuring, expand, collectionName } =
		$recordsStore.selectedRecord;

	function handleCancelClick() {
		recordsStore.clearSelectedRecord();
		modalStore.close();
	}
</script>

{#if $modalStore[0]}
	<div class="bg-cyan-50 p-4 rounded-lg">
		<h3 class="h3">Úprava záznamu</h3>
		<form
			method="post"
			use:enhance={() => {
				isSubmitting = true;

				return ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'success') {
						// Update the store with the new data
						recordsStore.updateSelectedRecord(result.data);
						modalStore.close();
					}

					update();
				};
			}}
			action={`/${collectionName}?/updateRecord&recordId=${id}&oldAmount=${amount}`}
			class="p-4 bg-surface-50 mt-4 shadow rounded-lg space-y-2"
		>
			<label class="label">
				<span>Datum</span>
				<input
					required
					class="input"
					type="date"
					name="date"
					id="dateInput"
					value={new Date(date).toISOString().slice(0, 10)}
				/>
			</label>
			<label class="label">
				<span>Zdroj (odesílatel)</span>
				<input
					required
					class="input"
					type="text"
					name="source"
					placeholder="Zadejte zdroj..."
					value={source}
				/>
			</label>
			<label class="label">
				<span>Částka (CZK)</span>
				<input
					required
					class="input"
					type="text"
					name="amount"
					inputmode="numeric"
					pattern="\d*"
					placeholder="1.00"
					value={amount}
				/>
			</label>
			<label class="label">
				<span>Kategorie</span>
				<select name="category" class="select" value={(expand && expand.category.id) || ''}>
					<option value="">Žádná kategorie</option>
					{#each $recordsStore.categories as { id, translation } (id)}
						<option value={id}>{translation}</option>
					{/each}
				</select>
			</label>
			<label class="label">
				<span>Popis transakce</span>
				<textarea
					name="description"
					class="textarea"
					rows="2"
					placeholder="Vložte popis transakce..."
					value={description}
				/>
			</label>
			<label class="label">
				<input class="checkbox" type="checkbox" name="isReccuring" checked={isReccuring} />
				<span>Opakující se platba</span>
			</label>

			<button class="btn btn-sm variant-outline-error w-full" on:click={handleCancelClick}
				>Zrušit</button
			>
			<button type="submit" class="btn variant-ghost-success w-full" disabled={isSubmitting}
				>{isSubmitting ? 'Aktualizace...' : 'Aktualizovat'}</button
			>
		</form>
	</div>
{/if}
