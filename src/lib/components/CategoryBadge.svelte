<script>
	export let record;

	const { name, translation } = record;

	const badgeBgMap = {
		none: 'variant-soft-surface',
		food: 'variant-soft-success',
		entertainment: 'variant-soft-secondary',
		clothes: 'variant-soft-tertiary',
		other: 'variant-glass-secondary',
		salary: 'variant-glass-success',
		gift: 'variant-glass-tertiary'
	};
</script>

<span class={`badge ${badgeBgMap[name ? name : 'none']} text-[10px]`}
	>{translation || 'Žádná kategorie'}</span
>
