import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ locals, request }) {
	const recordId = await request.json();

	await locals.pb.collection('expenses').delete(recordId);

	return new json({ message: 'Succesfully deleted item' }, { status: 200 });
}
