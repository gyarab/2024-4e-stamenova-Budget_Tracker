<script>
	export let data;
	const { user } = data;
</script>

<main class="grid place-items-center h-full">
	<div class="text-center space-y-8">
		<h1 class="h1">Hello, {user.name}!</h1>
		<p>Tady bude celkový přehled rozpočtu</p>
	</div>
</main>
