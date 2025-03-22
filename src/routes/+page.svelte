<script>
	import RtWrapper from '$lib/components/dashboard/RtWrapper.svelte';
	import Chart from '$lib/components/dashboard/Chart.svelte';

	export let data;
	const {
		recentIncomes,
		recentExpenses,
		predictedIncome,
		predictedExpense,
		insufficientData,
		chartIncomes,
		chartExpenses,
		userBalance
	} = data;

	let futureBalance = userBalance + (predictedIncome - predictedExpense);

	function formatCurrency(amount) {
		return new Intl.NumberFormat('cs-CZ', {
			style: 'currency',
			currency: 'CZK'
		}).format(amount);
	}
</script>

<main class="flex h-full px-8">
	<section class="basis-2/3">
		<Chart chartData={chartIncomes} type="income" />
		<Chart chartData={chartExpenses} type="expense" />
	</section>
	<section class="flex-1">
		<h4 class="h4 mt-4 p-4 bg-white rounded-lg shadow-lg">
			Zůstatek: {formatCurrency(userBalance)}
		</h4>
		<RtWrapper {recentIncomes} {recentExpenses} />
		{#if insufficientData}
			<div class="space-y-4 p-4 mt-4 bg-white rounded-lg shadow-lg text-justify">
				<p>📊 <strong>Shromažďujeme transakční data...</strong></p>
				<p>
					Potřebujeme alespoň <strong>5 transakcí</strong> za poslední <strong>2 měsíce</strong>,
					abychom mohli vytvořit přesné předpovědi.
				</p>
				<p>Pokračujte v používání aplikace a brzy uvidíte své finanční aktivity!</p>
			</div>
		{:else}
			<div class="space-y-4 p-4 my-4 bg-white rounded-lg shadow-lg text-justify">
				<h3>📈 Odhad budoucího rozpočtu</h3>
				<p class="text-sm lg:text-md">
					<em
						>🔍 Tento odhad je založen na posledních 5 transakcích každého druhu a stabilních
						příjmech a výdajích z posledních 2 měsíců.</em
					>
				</p>

				<div class="forecast-section">
					<h4 class="forecast-title">🔹 Odhad příjmů</h4>
					<p class="forecast-value">{formatCurrency(predictedIncome)}</p>
				</div>

				<div class="forecast-section">
					<h4 class="forecast-title">🔹 Odhad výdajů</h4>
					<p class="forecast-value">{formatCurrency(predictedExpense)}</p>
				</div>

				<div class="forecast-section">
					<h4 class="forecast-title">🔹 Odhad budoucího zůstatku</h4>
					<p class="forecast-value">{formatCurrency(futureBalance)}</p>
				</div>
			</div>
		{/if}
	</section>
</main>
