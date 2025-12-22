<script lang="ts">
	import '../app.css';
	import { setContext, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { writable } from 'svelte/store';
	import { History } from 'game-core/src/core/game/History';

	let { children } = $props();

	let session = $state(authClient.useSession());

	// const formData = new FormData();
	// formData.append('entry', '-HHEXEMPLE');
	// fetch('http://localhost:3049/api/games/play/12345', {
	// 	method: 'POST',
	// 	credentials: 'include',
	// 	body: formData
	// });

	// fetch('http://localhost:3049/api/games', {
	// 	method: 'GET',
	// 	credentials: 'include'
	// });

	let user = writable(session.data?.user);
	setContext('user', user);

	onMount(async () => {
		if ($user) return;
		session = await authClient.getSession();
		$user = session.data?.user;

		if (!$user) goto('/auth/login');
	});
</script>

<!-- <p style="position: fixed; color: rgba(0, 0, 0, 0.1); width: 100%; text-align: center;">
	Name: {$user?.name}
</p> -->

{@render children()}

<!-- <style>
	body {
		color: #59290e
	}
</style> -->

<svelte:head>
	<style>
		:root {
			--color-darker: #bf571c;
			--color-lighter: #d67f2a;
			--tile-color: #774a25;
			--logo-color: #f8cd84;
			--logo-border-color: #753511;
			--logo-depth-color: #4a220c;

			--button-background: #eca122;
			--button-color: #fcefcc;
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

		body {
			font-family: 'Arial Rounded MT Bold', 'Arial', sans-serif;
			position: relative;

			background-color: var(--color-lighter);
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
