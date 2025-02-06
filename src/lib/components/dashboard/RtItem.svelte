<script>
	import { formatDistanceToNow, isToday } from 'date-fns';
	import { cs } from 'date-fns/locale/cs';

	export let data;

	function formatDate(date) {
		return formatDistanceToNow(new Date(date), { locale: cs, addSuffix: true });
	}
</script>

<div class="bg-stone-100 py-1 px-2 rounded-md">
	{data.amount} Kč - {data.source} - {isToday(new Date(data.date)) ? 'Dnes' : formatDate(data.date)}
	({new Date(data.date).toISOString().slice(0, 10)})
</div>
