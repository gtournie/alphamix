<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import { user } from '$lib/stores/user';
</script>

<main>
	<div class="header">
		<div class="logo-container">
			<div class="logo">
				<div class="user-icon"></div>
			</div>
			<h1 class="title">{$user?.name?.toUpperCase()}</h1>
		</div>
	</div>

	<div class="content">
		<Button onclick={() => goto('/game/new')}>Créer une nouvelle partie</Button>
		<!-- <button class="button new">
      <span class="text">Créer une nouvelle partie</span>
    </button> -->

		<div class="section">
			<h2 class="section-title">À VOTRE TOUR</h2>
			<h3 class="subsection-title">AVEC DES AMIS</h3>

			<div class="player-list">
				<div class="player">
					<div class="player-avatar emma"></div>
					<span class="player-name">Emma</span>
				</div>
				<div class="player">
					<div class="player-avatar eric"></div>
					<span class="player-name">Eric</span>
				</div>
			</div>
		</div>

		<div class="section">
			<h2 class="section-title">EN ATTENTE DES ADVERSAIRES</h2>
			<h3 class="subsection-title">AVEC DES AMIS</h3>

			<div class="player-list">
				<div class="player">
					<div class="player-avatar sophie"></div>
					<span class="player-name">Sophie</span>
				</div>
				<div class="player">
					<div class="player-avatar adversaire"></div>
					<span class="player-name">Adversaire</span>
				</div>
			</div>
		</div>
	</div>

	<div class="footer">
		<div class="footer-item">
			<div class="footer-icon shop"></div>
			<span>Shop</span>
		</div>
		<div class="footer-item">
			<div class="footer-icon play"></div>
			<span>Play</span>
		</div>
		<div class="footer-item">
			<div class="footer-icon friends"></div>
			<span>Friends</span>
		</div>
		<div class="footer-item">
			<div class="footer-icon settings"></div>
			<span>Settings</span>
		</div>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		height: 100vh;
		max-width: 600px;
		margin: auto;
	}

	.header {
		background-color: #9a5c18; /* Couleur marron pour l'en-tête */
		padding: 15px;
		display: flex;
		align-items: center;
	}

	.logo-container {
		display: flex;
		align-items: center;
	}

	.logo {
		width: 60px;
		height: 60px;
		background-color: #8b4513; /* Marron foncé */
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 10px;
	}

	.user-icon {
		width: 40px;
		height: 40px;
		background-color: #f5deb3; /* Couleur beige clair */
		border-radius: 50%;
	}

	.title {
		color: #f5deb3; /* Beige clair */
		font-size: 2.5rem;
		font-weight: bold;
	}

	.content {
		flex: 1;
		padding: 20px;
		overflow-y: auto;
	}

	.new-game-button {
		width: 100%;
		padding: 15px;
		background-color: #f5b041; /* Orange plus clair */
		border: none;
		border-radius: 25px;
		color: white;
		font-size: 1.4rem;
		font-weight: bold;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		margin-bottom: 20px;
		cursor: pointer;
	}

	.section {
		margin-bottom: 20px;
	}

	.section-title {
		color: #6b3a0d; /* Marron foncé */
		font-size: 1.5rem;
		margin-bottom: 5px;
	}

	.subsection-title {
		color: #6b3a0d; /* Marron foncé */
		font-size: 1.3rem;
		margin-bottom: 10px;
	}

	.player-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.player {
		display: flex;
		align-items: center;
		gap: 15px;
	}

	.player-avatar {
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: #8b4513; /* Couleur par défaut */
	}

	.emma {
		background-color: #8b4513;
		/* Ici on pourrait ajouter une image de fond si nécessaire */
	}

	.eric {
		background-color: #8b4513;
		/* Ici on pourrait ajouter une image de fond si nécessaire */
	}

	.sophie {
		background-color: #8b4513;
		/* Ici on pourrait ajouter une image de fond si nécessaire */
	}

	.adversaire {
		background-color: #8b4513;
		/* Ici on pourrait ajouter une image de fond si nécessaire */
	}

	.player-name {
		color: white;
		font-size: 1.5rem;
	}

	.footer {
		display: flex;
		justify-content: space-around;
		background-color: #8b4513; /* Marron foncé */
		padding: 10px 0;
	}

	.footer-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #f5deb3; /* Beige clair */
	}

	.footer-icon {
		width: 30px;
		height: 30px;
		background-color: #f5deb3; /* Beige clair */
		margin-bottom: 5px;
	}

	.shop {
		/* Icône de panier */
		mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 3c0 .55.45 1 1 1h1l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45 1-1s-.45-1-1-1H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.67-1.43c-.16-.35-.52-.57-.9-.57H2c-.55 0-1 .45-1 1zm16 15c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>')
			no-repeat center;
		-webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 3c0 .55.45 1 1 1h1l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45 1-1s-.45-1-1-1H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.67-1.43c-.16-.35-.52-.57-.9-.57H2c-.55 0-1 .45-1 1zm16 15c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>')
			no-repeat center;
	}

	.play {
		/* Icône de grille */
		mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>')
			no-repeat center;
		-webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>')
			no-repeat center;
	}

	.friends {
		/* Icône de personnes */
		mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>')
			no-repeat center;
		-webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>')
			no-repeat center;
	}

	.settings {
		/* Icône d'engrenage */
		mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>')
			no-repeat center;
		-webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>')
			no-repeat center;
	}
</style>
