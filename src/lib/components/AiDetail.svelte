<script>
	import { goto } from '$app/navigation';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import UpdateRecordModalForm from './UpdateRecordModalForm.svelte';
	import { recordsStore } from '$lib/stores/records';

	export let description = 'Žádný popis transakce';
	export let date;
	export let id;
	export let collectionName;

	const modalStore = getModalStore();

	const urModalComponent = { ref: UpdateRecordModalForm };

	const fetchDeleteOptions = {
		method: 'delete',
		body: JSON.stringify(id),
		headers: {
			'content-type': 'application/json'
		}
	};

	const deleteModal = {
		type: 'confirm',
		// Data
		title: 'Potvrzení smazání záznamu',
		body: 'Opravdu si přejete tento záznam smazat? Tato akce je nevratná.',
		// TRUE if confirm pressed, FALSE if cancel pressed
		response: async (r) => {
			if (r) {
				await fetch(`/api/${collectionName}`, fetchDeleteOptions).then(() =>
					goto(`${collectionName}`, { invalidateAll: true })
				);
			}
		}
	};

	const updateModal = {
		type: 'component',
		component: urModalComponent
	};

	function handleUpdateClick() {
		recordsStore.selectRecordById(id);
		modalStore.trigger(updateModal);
	}
</script>

<div>
	<p><strong>Datum</strong>: {new Date(date).toLocaleDateString('cs-CZ')}</p>
	<div class="flex">
		<p>{description || 'Žádný popis transakce'}</p>
	</div>
	<div class="btn-group variant-filled font-bold mt-2">
		<button on:click={handleUpdateClick}>Upravit</button>
		<button on:click={() => modalStore.trigger(deleteModal)}>Smazat</button>
	</div>
</div>
