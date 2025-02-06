import { json, fail } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ locals, request }) {
	try {
		// Get the record ID from the request
		const recordId = await request.json();

		// Fetch the record to get the amount before deletion
		const record = await locals.pb.collection('incomes').getOne(recordId);

		// Parse the amount as a number (in case it's stored as a string)
		const amount = Number(record.amount);

		// Delete the record from the expenses collection
		await locals.pb.collection('incomes').delete(recordId);

		// Fetch the user's balance record
		const userBalanceRecord = await locals.pb
			.collection('balance')
			.getFirstListItem(`user.id="${locals.user.id}"`);

		// Update the user's balance by adding back the deleted amount
		await locals.pb.collection('balance').update(userBalanceRecord.id, {
			'balance-': amount
		});

		// Return a success response
		return json({ message: 'Successfully deleted item and updated balance' }, { status: 200 });
	} catch (err) {
		// Handle errors
		return fail(500, {
			message: 'An unexpected error occurred while deleting the item',
			error: err.message
		});
	}
}
