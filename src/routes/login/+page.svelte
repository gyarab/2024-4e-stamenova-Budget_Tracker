<script>
	/** @type {import('./$types').PageData} */
	export let data;
	export let form;
</script>

<div class="flex h-full w-full flex-col items-center pt-12">
	<h2 class="mt-2 text-base-content h2 text-center text-3xl font-bold tracking-tight">
		Přihlaste se, prosím
	</h2>
	<p class="mt-1 text-center">
		Nebo <a href="/register" class="font-medium text-amber-700 hover:cursor-pointer"
			>si zaregistrujte účet,
		</a> pokud ho ještě nemáte.
	</p>
	<div class="mt-6 w-full max-w-sm rounded-lg bg-primary-50 py-6 shadow-md">
		<form method="POST" action="?/login" class="flex w-full flex-col items-center space-y-2">
			<div class="form-control w-full max-w-xs">
				<label for="email" class="label pb-1 font-medium text-black">
					<span class="label-text">Email</span>
				</label>
				<input required type="email" name="email" class="input-bordered input w-full max-w-xs" />
			</div>
			<div class="form-control w-full max-w-xs">
				<label for="password" class="label pb-1 font-medium text-black">
					<span class="label-text">Heslo</span>
				</label>
				<input
					required
					type="password"
					name="password"
					class="input-bordered input w-full max-w-xs"
				/>
			</div>
			{#if form?.error}
				<p class="text-red-500">{form.error}</p>
			{/if}

			<div class="w-full max-w-xs pt-3">
				<button class="variant-filled-primary btn w-full max-w-xs">Přihlásit se</button>
			</div>
		</form>
	</div>
</div>
