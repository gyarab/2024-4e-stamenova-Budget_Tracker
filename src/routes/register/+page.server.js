import { redirect, fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (locals.pb.authStore.isValid) {
		throw redirect(303, '/');
	}

	return {};
}

export const actions = {
	register: async ({ locals, request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries([...formData]);

		data['passwordConfirm'] = data?.password.toString();
		try {
			await locals.pb.collection('users').create(data);
			await locals.pb.collection('users').authWithPassword(data.email, data.password.toString());
			await locals.pb.collection('users').requestVerification(data.email);
		} catch (err) {
			return fail(500, { email: data.email, error: 'Nepodařilo se vytvořit učet' });
		}

		throw redirect(303, '/');
	}
};
