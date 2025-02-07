<script>
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	//Dynamic progress bar above the page during page load
	import 'nprogress/nprogress.css';
	import NProgress from 'nprogress';
	import { navigating } from '$app/stores';

	NProgress.configure({ minimum: 0.16, showSpinner: false });
	$: {
		if ($navigating) {
			NProgress.start();
		} else {
			NProgress.done();
		}
	}

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import { initializeStores, Modal } from '@skeletonlabs/skeleton';
	initializeStores();

	export let data;
	const { user } = data;
</script>

<Modal />
<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Budget tracker</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if !user}
					<a class="btn btn-sm variant-ghost-surface" href="/login"> Přihlášení </a>
				{:else}
					<a class="btn btn-sm variant-ghost-surface" href="/"> Přehled </a>
					<a class="btn btn-sm variant-ghost-surface" href="/incomes"> Příjmy </a>
					<a class="btn btn-sm variant-ghost-surface" href="/expenses"> Výdaje </a>
					<form method="POST" action="/logout">
						<button type="submit" class="variant-ghost-error btn btn-sm hover:variant-filled-error"
							>Odhlásit se</button
						>
					</form>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
