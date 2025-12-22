<script module lang="ts">
	import config from '$lib/config';

	const { csrfToken } = await config.fetch('/api/auth/csrf');

	function sendWithForm({
		url,
		method = 'POST',
		queryParams,
		params = {}
	}: {
		url: string;
		method?: string;
		queryParams?: Record<string, string>;
		params?: Record<string, string>;
	}) {
		if (queryParams) url += '?' + new URLSearchParams(queryParams).toString();

		const form = document.createElement('form');
		form.action = url;
		form.method = method.toUpperCase();
		// make it invisible
		form.style.display = 'none';
		form.style.position = 'fixed';
		form.style.zIndex = '-1';
		form.style.transform = 'translate(-110%, -110%)';

		Object.keys(params).forEach((name) => {
			const input = document.createElement('input');
			input.name = name;
			input.value = params[name];
			form.appendChild(input);
		});

		document.body.appendChild(form);
		form.submit();
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	let user = null;

	onMount(async () => {
		const res = await fetch(BASE_URL + '/api/auth/session', { credentials: 'include' });
		if (res.ok) {
			const data = await res.json();
			user = data?.user;
		}
	});

	async function loginWithGoogle() {
		sendWithForm({
			url: `${BASE_URL}/api/auth/signin/google`,
			queryParams: { callbackUrl: 'http://localhost:5173/' },
			params: { csrfToken }
		});
	}
</script>

{#if user}
	<p>Bienvenue, {user.name} !</p>
{:else}
	<button on:click={loginWithGoogle}>Se connecter avec Google</button>
{/if}
