<script>
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { formatDistanceToNow, differenceInDays, isToday } from 'date-fns';
	import { cs } from 'date-fns/locale/cs';
	import AiDetail from '$lib/components/AiDetail.svelte';
	import RecurringRecordIcon from '$lib/components/RecurringRecordIcon.svelte';
	import { afterUpdate, onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import CategoryBadge from '$lib/components/CategoryBadge.svelte';
	import { recordsStore } from '$lib/stores/records';

	/** @type {import('./$types').PageData} */
	export let data;

	let { records, categories } = data;
	$: ({ records } = data);

	//Update categories store
	recordsStore.setRecords(records);
	recordsStore.setCategories(categories);

	// Search state
	let searchQuery = '';
	let debouncedSearchQuery = '';
	let afcChip = '';
	let amountFilterQueryFrom = '';
	let amountFilterQueryTo = '';
	let debouncedAmountFilterQueryFrom = '';
	let debouncedAmountFilterQueryTo = '';

	// Debounce the search query
	let debounceTimeout;
	$: {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			debouncedSearchQuery = searchQuery;
		}, 500);
	}

	// Debounce the amount query
	let debounceTimeoutAmount;
	$: {
		clearTimeout(debounceTimeoutAmount);
		debounceTimeoutAmount = setTimeout(() => {
			debouncedAmountFilterQueryFrom = amountFilterQueryFrom;
			debouncedAmountFilterQueryTo = amountFilterQueryTo;
		}, 500);
	}

	// Derived store for filtered records 
	$: filteredRecords = records.filter((record) => {
		const matchesSearch =
			debouncedSearchQuery.toLowerCase().trim() === '' ||
			record.source.toLowerCase().includes(debouncedSearchQuery.toLowerCase().trim()) ||
			record.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase().trim());

		const matchesCategory = afcChip === '' || record.expand?.category.name === afcChip;

		const amount = record.amount ?? 0;
		const fromAmount = debouncedAmountFilterQueryFrom ? Number(debouncedAmountFilterQueryFrom) : 0;
		const toAmount = debouncedAmountFilterQueryTo
			? Number(debouncedAmountFilterQueryTo)
			: Number.MAX_SAFE_INTEGER;

		const matchesAmount = amount >= fromAmount && amount <= toAmount;

		return matchesSearch && matchesCategory && matchesAmount;
	});

	const isRecurringAiFormat = {
		true: 'text-warning-700 bg-warning-200',
		false: 'text-surface-700 bg-surface-200'
	};

	onMount(() => {
		document.getElementById('dateInput').valueAsDate = new Date();
		document.getElementById('dateInput').max = new Date().toLocaleDateString('fr-CA');
	});

	afterUpdate(() => {
		document.getElementById('dateInput').valueAsDate = new Date();
		document.getElementById('dateInput').max = new Date().toLocaleDateString('fr-CA');
	});

	function checkMoreThanWeek(date) {
		const isMoreThanWeek = differenceInDays(new Date(date), new Date()) * -1 > 7 ? true : false;
		return isMoreThanWeek;
	}

	function handleAfcChipClick(c) {
		afcChip = afcChip === c.name ? '' : c.name;
	}

	function handleFilterReset() {
		searchQuery = '';
		afcChip = '';
		amountFilterQueryFrom = '';
		amountFilterQueryTo = '';
	}
</script>

<main class="flex p-4 gap-12">
	<section class="basis-1/3">
		<h3 class="h3">Vložit záznam</h3>
		<form
			method="post"
			action="/expenses?/insertRecord"
			use:enhance
			class="p-4 bg-surface-50 mt-4 shadow rounded-lg space-y-2"
		>
			<label class="label">
				<span>Datum</span>
				<input required class="input" type="date" name="date" id="dateInput" />
			</label>
			<label class="label">
				<span>Zdroj (obchodník)</span>
				<input required class="input" type="text" name="source" placeholder="Zadejte zdroj..." />
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
				/>
			</label>
			<label class="label">
				<span>Kategorie</span>
				<select name="category" class="select">
					<option value="">Žádná kategorie</option>
					{#each categories as { id, translation } (id)}
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
				/>
			</label>
			<label class="label">
				<input class="checkbox" type="checkbox" name="isReccuring" />
				<span>Opakující se platba</span>
			</label>

			<button class="btn variant-ghost-success w-full">Vložit</button>
		</form>
	</section>
	<section class="flex-1">
		<h3 class="h3">Výpis výdajů</h3>
		{#if !records.length}
			<div class="bg-surface-50 text-surface-700 mt-4 rounded-lg shadow py-4">
				<div class="grid place-items-center text-center">
					<div>
						<h5 class="h5">Nebyl nalezen žádný záznam</h5>
						<p class="font-extralight text-sm max-w-md 2xl:max-w-lg 2xl:text-md">
							Zatím jste ještě nevytvořil(a) žádný zaznám. Zkuste si přidat nový v levé části
							obrazovky.
						</p>
					</div>
				</div>
			</div>
		{:else}
			<div class="bg-surface-50 mt-4 rounded-lg shadow p-2">
				<input
					class="input"
					type="search"
					autocomplete="off"
					bind:value={searchQuery}
					placeholder="Hledat... (Zdroj nebo popis)"
				/>
				<div class="flex gap-2 p-2">
					{#each categories as c}
						<button
							class="chip {afcChip === c.name ? 'variant-filled' : 'variant-soft'}"
							on:click={() => handleAfcChipClick(c)}
						>
							<span>{c.translation}</span>
						</button>
					{/each}
					<div class="flex gap-2 w-full h-8">
						<input
							class="input"
							type="number"
							bind:value={amountFilterQueryFrom}
							step="200"
							min="0"
							placeholder="Částka OD..."
						/>
						<input
							class="input"
							type="number"
							bind:value={amountFilterQueryTo}
							step="200"
							min="0"
							placeholder="Částka DO..."
						/>
						<button type="button" class="btn btn-sm variant-soft-error" on:click={handleFilterReset}
							>Resetovat</button
						>
					</div>
				</div>
			</div>
			<div class="bg-surface-50 mt-4 rounded-lg shadow p-4">
				<Accordion class="space-y-4">
					{#each filteredRecords as record (record.id)}
						<AccordionItem class={`${isRecurringAiFormat[record.isReccuring]} rounded-xl`}>
							<svelte:fragment slot="summary">
								<div class="flex items-center gap-2">
									{#if record.isReccuring}
										<RecurringRecordIcon />
									{/if}
									<p class="text-xl font-bold first-letter:uppercase">
										{#if isToday(record.date)}
											dnes,
										{:else}
											{checkMoreThanWeek(record.date)
												? new Date(record.date).toLocaleDateString('cs-CZ')
												: formatDistanceToNow(new Date(record.date), {
														locale: cs,
														addSuffix: true
													})},
										{/if}
										{record.source} -
										{record.amount}
										<span class="text-xs font-extralight">CZK</span> -
										<CategoryBadge record={record.expand?.category || {}} />
									</p>
								</div>
							</svelte:fragment>
							<svelte:fragment slot="content"><AiDetail {...record} /></svelte:fragment>
						</AccordionItem>
					{/each}
				</Accordion>
				{#if filteredRecords.length === 0}
					<div class="grid place-items-center text-surface-700 text-center">
						<div>
							<h5 class="h5">Nebyl nalezen žádný záznam</h5>
							<p class="font-extralight text-sm max-w-md 2xl:max-w-lg 2xl:text-md">
								Této kategorii zatím neodpovídá žádný existující záznam.
							</p>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</section>
</main>
