<script>
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { formatDistanceToNow, differenceInDays, isToday } from 'date-fns';
	import { cs } from 'date-fns/locale/cs';
	import AiDetail from '$lib/components/expenses/AiDetail.svelte';
	import RecurringRecordIcon from '$lib/components/expenses/RecurringRecordIcon.svelte';
	import { afterUpdate, onMount } from 'svelte';
	import { enhance } from '$app/forms';

	/** @type {import('./$types').PageData} */
	export let data;

	let { records } = data;
	$: ({ records } = data);

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
</script>

<main class="flex p-4 gap-12">
	<section class="basis-1/3">
		<h3 class="h3">Vložit záznam</h3>
		<form method="post" use:enhance class="p-4 bg-surface-50 mt-4 shadow rounded-lg space-y-2">
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
			<button class="btn variant-ghost-success w-full">Vložit</button>
		</form>
	</section>
	<section class="flex-1">
		<h3 class="h3">Výpis výdajů</h3>
		{#if !records.length}
			<div class="bg-surface-50 text-surface-700 mt-8 rounded-lg shadow py-4">
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
			<div class="bg-surface-50 mt-4 rounded-lg shadow p-4">
				<Accordion class="space-y-4">
					{#each records as record (record.id)}
						<AccordionItem class={`${isRecurringAiFormat[record.isRecurring]} rounded-xl`}>
							<svelte:fragment slot="summary">
								<div class="flex items-center gap-2">
									{#if record.isRecurring}
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
										<span class="text-xs font-extralight">CZK</span>
									</p>
								</div>
							</svelte:fragment>
							<svelte:fragment slot="content"><AiDetail {...record} /></svelte:fragment>
						</AccordionItem>
					{/each}
				</Accordion>
			</div>
		{/if}
	</section>
</main>
