<script module lang="ts">
	import config from '$lib/config';

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

	const DELAY_BETWEEN_LETTERS = 200;
	const TILES: Record<string, any> = {
		S: { rotate: 18, right: -0.8, bottom: -1.8 },
		O: { rotate: -27, left: -2.5, bottom: -1.4 },
		L: { rotate: 15, left: -12, top: 12.4 },
		V: { rotate: -20, left: -1, top: -1.6 },
		E: { rotate: 15, right: 0.5, top: -1.6 },
		Z: { rotate: -20, right: -13, bottom: 11.6 }
	};
	Object.keys(TILES).forEach((letter, index) => {
		TILES[letter].animDelay = DELAY_BETWEEN_LETTERS * index;
	});
</script>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Tile from './Tile.svelte';
	import { goto } from '$app/navigation';
	import Logo from './Logo.svelte';
	import Button from '$lib/components/Button.svelte';
	import { isAuthenticated } from '$lib/stores/user';
	import api from '$lib/api';

	// Already authenticated
	onDestroy(
		// $isAuthenticated doesn't work well in Safari...
		isAuthenticated.subscribe((val) => {
			// if (val) goto('/');
		})
	);

	let csrf = $state('');

	onMount(async () => {
		const { csrfToken } = await api.getCsrf();
		csrf = csrfToken;
	});

	// if ($isAuthenticated) {
	// 	// history.pushState({}, '', '/');
	// 	console.log('isAuthenticated, yes');
	// 	goto('/');
	// }
	// console.log($isAuthenticated);

	// getContext<any>('user').subscribe((user: unknown) => user && goto('/'));

	let mounted = $state(false);
	let timer: ReturnType<typeof setTimeout>;
	onMount(() => {
		timer = setTimeout(() => (mounted = true), 2500);
	});
	onDestroy(() => clearTimeout(timer));

	const loginWithGoogle = async () => {
		// const data = await authClient.signIn.social({
		// 	provider: 'google',
		// 	callbackURL: 'http://localhost:5173/'
		// });
		// console.log(data.error);
		sendWithForm({
			url: `${config.SERVER_URL}/api/auth/signin/google`,
			queryParams: { callbackUrl: 'http://localhost:5173/' },
			params: { csrfToken: csrf }
		});
	};

	// Fonctions de connexion
	function loginWithFacebook() {
		alert('Connexion avec Facebook');
	}

	function loginWithApple() {
		alert('Connexion avec Apple');
	}

	function getCssVar(name: string) {
		return getComputedStyle(document.documentElement).getPropertyValue(name);
	}
</script>

<main>
	<div class="login-container">
		<div class="hexagon-1"></div>
		<div class="hexagon-2"></div>
		<div class="hexagon-3"></div>
		<div class="hexagon-4"></div>
		<div class="hexagon-5"></div>
		<div class="hexagon-6"></div>
		<div class="hexagon-7"></div>

		{#each Object.entries(TILES) as [letter, props]}
			<Tile {letter} {...props} />
		{/each}

		<h1 class="logo">
			<Logo
				color={getCssVar('--logo-color')}
				borderColor={getCssVar('--logo-border-color')}
				depthColor={getCssVar('--logo-depth-color')}
			/>
		</h1>

		<div class="social-logins">
			<p class="connect-with">Se connecter avec</p>

			<Button
				type="submit"
				background="#f7e7cd"
				color="#333"
				depthColor="#cebda4"
				onclick={loginWithGoogle}
			>
				{#snippet prepend()}
					<svg viewBox="0 0 24 24" width="24" height="24">
						<path
							fill="#4285F4"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="#34A853"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="#FBBC05"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="#EA4335"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
				{/snippet}
				Google
			</Button>

			<Button background="#315e90" color="#f7e7cd" depthColor="#284465" onclick={loginWithFacebook}>
				{#snippet prepend()}
					<span class="facebook-icon"></span>
				{/snippet}
				Facebook
			</Button>

			<Button background="#222" color="white" depthColor="black" onclick={loginWithApple}>
				{#snippet prepend()}
					<svg viewBox="0 0 384 512" width="22" height="22">
						<path
							fill="currentColor"
							d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
						/>
					</svg>
				{/snippet}
				Apple
			</Button>
		</div>
	</div>
</main>

<style>
	.hexagon-1,
	.hexagon-2,
	.hexagon-3,
	.hexagon-4,
	.hexagon-5,
	.hexagon-6,
	.hexagon-7 {
		position: absolute;
		background-color: var(--color-lighter);
		z-index: -1;
		clip-path: path(
			'M172.871,0a28.906,28.906,0,0,1,25.009,14.412L245.805,97.1a28.906,28.906,0,0,1,0,28.989L197.88,208.784A28.906,28.906,0,0,1,172.871,223.2H76.831a28.906,28.906,0,0,1-25.009-14.412L3.9,126.092A28.906,28.906,0,0,1,3.9,97.1L51.821,14.412A28.906,28.906,0,0,1,76.831,0Z'
		);
		transform-origin: 50% 50%;
		filter: brightness(110%);
	}

	.hexagon-1 {
		width: 250px;
		height: 223px;
		top: -75px;
		left: -15px;
		opacity: 0.15;
		transform: scale(0.35) rotate(15deg);
	}

	.hexagon-2 {
		width: 250px;
		height: 223px;
		top: 110px;
		left: -123px;
		opacity: 0.25;
		transform: scale(0.31) rotate(-10deg);
	}

	.hexagon-3 {
		width: 250px;
		height: 223px;
		top: -30px;
		right: -150px;
		opacity: 0.15;
		transform: scale(0.3) rotate(30deg);
	}

	.hexagon-4 {
		width: 250px;
		height: 250px;
		top: 120px;
		right: -115px;
		clip-path: none;
		opacity: 0.2;
		border-radius: 10%;
		transform: scale(0.2) rotate(22deg);
	}

	.hexagon-5 {
		width: 250px;
		height: 250px;
		bottom: -130px;
		left: -35px;
		clip-path: none;
		opacity: 0.2;
		border-radius: 10%;
		transform: scale(0.2) rotate(22deg);
	}

	.hexagon-6 {
		width: 250px;
		height: 223px;
		bottom: -95px;
		right: -10px;
		opacity: 0.2;
		transform: scale(0.2) rotate(30deg);
	}

	.hexagon-7 {
		width: 250px;
		height: 223px;
		bottom: -60px;
		right: -140px;
		opacity: 0.2;
		transform: scale(0.3) rotate(30deg);
	}

	main {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		margin: auto;
		padding: 0;

		/* padding: 15px; */
	}

	.login-container {
		/* font-size: 10px; */
		position: relative;
		/* z-index: 1; */
		max-width: 400px;
		margin: auto;
		/* width: 100vw; */
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 25px;
		margin: 0 35px;
		padding: 60px 0;
		text-align: center;
	}

	@keyframes tilt-shaking {
		0% {
			transform: translateX(0);
		}
		95% {
			transform: translateX(0);
		}
		96.25% {
			transform: translateX(5px);
		}
		97.5% {
			transform: translateX(-5px);
		}
		98.75% {
			transform: translateX(5px);
		}
		100% {
			transform: translateX(0);
		}
	}

	.connect-with {
		color: #f8e0a8;
		margin: 0;
		animation: 7s ease-in-out tilt-shaking infinite;
	}

	/* .tile {
		position: absolute;
		width: 60px;
		height: 60px;
		background-color: #ebb970;
		border-radius: 6px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32px;
		font-weight: bold;
		color: #6d3200;
		box-shadow:
			2px 2px 0 rgba(0, 0, 0, 0.1),
			4px 4px 10px #9b4c15,
			inset 0 0 0 1px rgba(255, 255, 255, 0.2);
		z-index: 5;
	} */

	@keyframes scale {
		0% {
			transform: scale(0.5);
		}
		50% {
			transform: scale(1.2);
		}
		75% {
			transform: scale(0.9);
		}
		100% {
			transform: scale(1);
		}
	}

	.logo {
		/* width: 343px;
		height: 90px; */
		/* width: 115%;
    padding-bottom: 30.175%; */
		/* width: 100%;
    padding-bottom: 26.24%; */
		/* width: 105%;
		padding-bottom: 27.5511%; */
		margin: 0;
		width: 110%;
		padding-bottom: 28.863%;
		height: 0;
		overflow: hidden;
		/* aspect-ratio: 343 / 90; */
		/* background: center / 100% no-repeat url($lib/images/logo.png); */
		color: transparent;
		animation: scale 1s ease-in-out forwards;
		/* font-size: 54px;
    font-weight: bold;
    text-align: center;
    color: #f8e0a8;
    font-family: 'Arial Rounded MT Bold', 'Arial Black', sans-serif;
    text-shadow: 
      -3px -3px 0 #743412,
      3px -3px 0 #743412,
      -3px 3px 0 #743412,
      3px 3px 0 #743412,
      6px 6px 0 #58270e;
    margin: 30px 0;
    letter-spacing: 1px;
    display: inline-block;
    padding: 0 10px; */
	}

	/* .login-button {
    background-color: #d35400;
    color: #f8e0a8;
    border: none;
    border-radius: 30px;
    padding: 14px 30px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    width: 180px;
    box-shadow: 
      0 4px 0 #a04000,
      0 4px 10px rgba(0, 0, 0, 0.25);
    transition: all 0.2s ease;
    margin-bottom: 15px;
  }
  
  .login-button:hover {
    background-color: #e67e22;
    transform: translateY(-2px);
    box-shadow: 
      0 6px 0 #a04000,
      0 6px 12px rgba(0, 0, 0, 0.3);
  } */

	/* .login-button:active {
    transform: translateY(2px);
    box-shadow: 
      0 2px 0 #a04000,
      0 2px 5px rgba(0, 0, 0, 0.2);
  } */

	.social-logins {
		display: flex;
		flex-direction: column;
		gap: 20px;
		width: 100%;
		margin-top: 45px;
	}

	.facebook-icon {
		width: 100%;
		height: 100%;
		color: #315e90;
		background-color: white;
		border-radius: 50%;
		font-family: Arial, sans-serif;
		font-weight: 900;
	}

	.facebook-icon::before {
		content: 'f';
		font-size: 24px;
	}
</style>
