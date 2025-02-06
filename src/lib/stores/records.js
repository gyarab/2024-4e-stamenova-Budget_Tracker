import { writable } from 'svelte/store';

const initialState = {
	records: [],
	categories: [],
	selectedRecord: null
};

const createRecordsStore = () => {
	const { subscribe, set, update } = writable(initialState);

	return {
		subscribe,
		// Set categories
		setCategories: (categories) => {
			update((state) => ({
				...state,
				categories
			}));
		},
		// Set records
		setRecords: (records) => {
			update((state) => ({
				...state,
				records
			}));
		},
		// Select record by ID
		selectRecordById: (recordId) => {
			update((state) => {
				const foundRecord = state.records.find((record) => record.id === recordId);
				return {
					...state,
					selectedRecord: foundRecord || null
				};
			});
		},
		// Update selected record
		updateSelectedRecord: (updatedData) => {
			update((state) => {
				if (!state.selectedRecord) return state;

				// Update the record in the records array
				const updatedRecords = state.records.map((record) =>
					record.id === state.selectedRecord.id ? { ...record, ...updatedData } : record
				);

				// Update both the records array and the selected record
				return {
					...state,
					records: updatedRecords,
					selectedRecord: { ...updatedData.data }
				};
			});
		},
		// Clear selected record
		clearSelectedRecord: () => {
			update((state) => ({
				...state,
				selectedRecord: null
			}));
		},
		// Reset store
		reset: () => set(initialState)
	};
};

export const recordsStore = createRecordsStore();
