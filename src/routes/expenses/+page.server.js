import { redirect, fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const records = await locals.pb.collection('expenses').getFullList({
		sort: '-date,source,-amount'
	});

	return { records };
}

export const actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries([...formData]);

		try {
			await locals.pb
				.collection('expenses')
				.create({ ...data, user: locals.pb.authStore.model.id });
		} catch (err) {
			return fail(500, {
				data: data,
				message: 'Při vložení záznamu vyskytla neočekávaná chyba'
			});
		}
	}
};
