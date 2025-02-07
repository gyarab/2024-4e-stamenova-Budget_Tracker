import { redirect, fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (locals.pb.authStore.isValid) {
		throw redirect(303, '/');
	}

	return {};
}

export const actions = {
	login: async ({ locals, request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries([...formData]);

		try {
			const { token, record } = await locals.pb
				.collection('users')
				.authWithPassword(data.email, data.password);
		} catch (err) {
			return fail(401, {
				email: data.email,
				error: 'Chybějící nebo chybně zadané přihlašovací údaje'
			});
		}

		throw redirect(303, '/');
	}
};
