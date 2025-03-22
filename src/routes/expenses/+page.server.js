import { redirect, fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const records_req = locals.pb.collection('expenses').getFullList({ //vypsání seznamu výdajů z databáze
		sort: '-date,source,-amount',
		expand: 'category'
	});

	const categories_req = locals.pb.collection('category').getFullList({
		filter: 'type = "expenses"'
	});

	const [records, categories] = await Promise.all([records_req, categories_req]);

	return { records, categories };
}

export const actions = {							//vytvoření nového výdaje
	insertRecord: async ({ locals, request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries([...formData]);

		data.isReccuring = data.isReccuring === 'on' ? true : false;

		try {
			locals.pb
				.collection('expenses')
				.create({ ...data, user: locals.pb.authStore.model.id })
				.then(() => {
					return locals.pb.collection('balance').getFirstListItem(`user.id="${locals.user.id}"`);
				})
				.then(({ id: userBalanceRecord }) => {		//aktualizace zůstatku
					return locals.pb
						.collection('balance')
						.update(userBalanceRecord, { 'balance-': `${data.amount}` });
				});
		} catch (err) {
			return fail(500, {
				data: data,
				message: 'Při vložení záznamu se vyskytla neočekávaná chyba',
				error: err.message
			});
		}
	},
	updateRecord: async ({ request, locals, url }) => {   //úprava již existujícího výdaje
		const formData = await request.formData();
		const data = Object.fromEntries([...formData]);

		data.isReccuring = data.isReccuring === 'on' ? true : false;

		const recordId = url.searchParams.get('recordId');

		const oldAmount = Number(url.searchParams.get('oldAmount')); 
		const difference = Math.abs(data.amount - oldAmount);
		const isIncreasing = data.amount > oldAmount;

		try {
			const updateRecord = await locals.pb.collection('expenses').update(recordId, { ...data });

			const userBalanceRecord = await locals.pb
				.collection('balance')
				.getFirstListItem(`user.id="${locals.user.id}"`);

			await locals.pb.collection('balance').update(userBalanceRecord.id, {  //aktualizace zůstatku
				[`balance${isIncreasing ? '-' : '+'}`]: difference
			});

			return {
				type: 'success',
				data: updateRecord
			};
		} catch (err) {
			return fail(500, {
				data: data,
				message: 'Při aktualizaci záznamu se vyskytla neočekávaná chyba',
				error: err.message
			});
		}
	}
};
