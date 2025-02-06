import { redirect } from '@sveltejs/kit';
import { subMonths } from 'date-fns';

export async function load({ locals }) {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const userId = locals.user.id;
	const twoMonthsAgo = subMonths(new Date(), 2).toISOString();

	const req_userBalance = locals.pb.collection('balance').getFirstListItem(`user.id="${userId}"`);

	const req_recentIncomes = locals.pb
		.collection('incomes')
		.getList(1, 5, { sort: '-date,-amount', fields: 'amount,date,source' });

	const req_recentExpenses = locals.pb
		.collection('expenses')
		.getList(1, 5, { sort: '-date,-amount', fields: 'amount,date,source' });

	const req_pastExpenses = locals.pb.collection('expenses').getFullList({
		filter: `user = "${userId}" && date >= "${twoMonthsAgo}"`,
		requestKey: null
	});

	const req_pastIncomes = locals.pb.collection('incomes').getFullList({
		filter: `user = "${userId}" && date >= "${twoMonthsAgo}"`,
		requestKey: null
	});

	const res_chartIncomes = await locals.pb.collection('incomes').getFullList({
		filter: `user = "${userId}" && date >= "${twoMonthsAgo}"`,
		sort: '-date,-amount',
		fields: 'amount,date,source',
		requestKey: null
	});

	const groupedChartIncomes = res_chartIncomes.reduce((acc, income) => {
		const source = (income.source || 'Neznámý zdroj').trim().replace(/\s+/g, ' ').toLowerCase();

		if (!acc[source]) {
			acc[source] = { source: income.source.trim().replace(/\s+/g, ' '), amount: 0 };
		}

		acc[source].amount += income.amount;
		return acc;
	}, {});

	const formattedChartIncomes = Object.values(groupedChartIncomes).sort(
		(a, b) => a.amount - b.amount
	);

	const res_chartExpenses = await locals.pb.collection('expenses').getFullList({
		filter: `user = "${userId}" && date >= "${twoMonthsAgo}"`,
		sort: '-date,-amount',
		fields: 'amount,date,source',
		requestKey: null
	});

	const groupedChartExpenses = res_chartExpenses.reduce((acc, expense) => {
		const source = (expense.source || 'Neznámý zdroj').trim().replace(/\s+/g, ' ').toLowerCase();

		if (!acc[source]) {
			acc[source] = { source: expense.source.trim().replace(/\s+/g, ' '), amount: 0 };
		}

		acc[source].amount += expense.amount;
		return acc;
	}, {});

	const formattedChartExpenses = Object.values(groupedChartExpenses).sort(
		(a, b) => a.amount - b.amount
	);

	const [
		res_userBalance,
		res_recentIncomes,
		res_recentExpenses,
		res_pastExpenses,
		res_pastIncomes
	] = await Promise.all([
		req_userBalance,
		req_recentIncomes,
		req_recentExpenses,
		req_pastExpenses,
		req_pastIncomes
	]);

	const detectStablePaycheck = (incomes) => {
		const frequency = {};
		incomes.forEach(({ amount }) => {
			frequency[amount] = (frequency[amount] || 0) + 1;
		});
		const stablePaychecks = Object.keys(frequency)
			.map(Number)
			.filter((val) => frequency[val] > 1);
		return stablePaychecks.length > 0 ? Math.max(...stablePaychecks) : 0;
	};

	const getWeightedAverage = (incomes) => {
		if (incomes.length === 0) return 0;
		incomes.sort((a, b) => new Date(b.date) - new Date(a.date) || b.amount - a.amount);
		const last5 = incomes.slice(0, 5);
		let weights = last5.map((_, index) => last5.length - index);
		let weightedSum = last5.reduce((sum, t, index) => sum + t.amount * weights[index], 0);
		let totalWeight = weights.reduce((sum, w) => sum + w, 0);
		return weightedSum / totalWeight;
	};

	const stablePaycheck = detectStablePaycheck(res_pastIncomes);
	const variableIncomes = res_pastIncomes.filter((t) => t.amount !== stablePaycheck);
	const predictedVariableIncome = getWeightedAverage(variableIncomes);
	const predictedIncome = stablePaycheck + predictedVariableIncome;

	const stableRecurringExpense = detectStablePaycheck(res_pastExpenses);
	const variableExpenses = res_pastExpenses.filter((t) => t.amount !== stableRecurringExpense);
	const predictedVariableExpense = getWeightedAverage(variableExpenses);
	const predictedExpense = stableRecurringExpense + predictedVariableExpense;

	const insufficientData = res_pastExpenses.length < 5 && res_pastIncomes.length < 5;

	return {
		userBalance: res_userBalance.balance,
		recentIncomes: res_recentIncomes.items,
		recentExpenses: res_recentExpenses.items,
		predictedIncome,
		predictedExpense,
		insufficientData,
		chartIncomes: formattedChartIncomes.slice(0, 10),
		chartExpenses: formattedChartExpenses.slice(0, 10)
	};
}
