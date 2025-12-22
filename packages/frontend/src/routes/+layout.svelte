<script module lang="ts">
	// let SERVER_URL = 'http://localhost:3049';
	// let res = await fetch(SERVER_URL + '/api/protected', { credentials: 'include' });
	// console.log(await res.json());
</script>

<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import { fetchUser } from '$lib/stores/user';
	import { isAuthenticated } from '$lib/stores/user';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	onMount(async () => {
		await fetchUser();
		if ($isAuthenticated === false) goto('/auth/login');
	});

	// if (!$isAuthenticated) {
	// 	console.log('not authenticated');
	// 	// goto('/auth/login');
	// 	if (window.location.pathname !== '/auth/login') {
	// 		history.pushState({}, '', new URL(window.location.origin + '/auth/login'));
	// 	}
	// }

	let { children } = $props();
</script>

{@render children()}

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<svelte:head>
	<style>
		:root {
			--color-darker: #bf571c;
			--color-lighter: #d67f2a;
			--text-color: #78360a;
			--tile-color: #774a25;
			--logo-color: #f8cd84;
			--logo-border-color: #753511;
			--logo-depth-color: #4a220c;

			--button-background: #eca122;
			/* --button-color: #fcefcc; */
			--button-color: var(--text-color);
			--button-depth-color: #c46905;

			/* dark theme */
			/* --color-darker: #221b14;
			--color-lighter: #3a2e1e;
			--tile-color: #473620;
			--logo-border-color: #492b12;
			--logo-depth-color: #382412; */

			/* light theme*/
			/* --color-darker: #fff5dc;
			--color-lighter: #fef5de;
			--tile-color: #705433;
			--logo-color: #f6af14;
			--logo-border-color: #c07818;
			--logo-depth-color: #f8cd84; */

			/* green theme */
			/* --color-darker: #3c5431;
			--color-lighter: #648250;
			 --tile-color: #39491d; 
			--logo-border-color: #334829;
			--logo-depth-color: #25380e; */

			/*  theme */
			/* --color-darker: 
			--color-lighter: 
			 --tile-color:  
			--logo-color: 
			--logo-border-color: 
			--logo-depth-color:  */
		}

		html,
		body {
			font-size: 16px;
			height: 100%;
			width: 100%;
			margin: 0;
			padding: 0;
			overflow: hidden;
		}

		body,
		input,
		button,
		textarea,
		select {
			font-family: 'Arial Rounded MT Bold', 'Arial', sans-serif;
			color: var(--text-color);
		}

		body {
			position: relative;
			/* height: calc(100% - 20px);
			top: 10px;
			outline: 10px solid blue; */

			background-color: var(--color-darker);
			background-image:
				url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1250' height='1250'%3E%3Cfilter id='noise1'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1' numOctaves='5' stitchTiles='stitch' /%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise1)'/%3E%3C/svg%3E"),
				radial-gradient(circle at 50% 50%, var(--color-lighter) 0%, var(--color-darker) 100%);
			background-size:
				1250px / 1250px,
				cover;
			background-repeat: repeat, no-repeat;
			background-attachment: fixed;
			background-blend-mode: multiply, normal;
		}

		@media only screen and (max-width: 400px) {
			:global(html) {
				font-size: 4.444444vw;
			}
		}

		@media only screen and (max-height: 600px) {
			:global(html) {
				font-size: 2.5vh;
			}
		}
	</style>
</svelte:head>
