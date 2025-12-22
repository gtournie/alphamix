<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import ButtonGroup from '$lib/components/ButtonGroup.svelte';
	import Icon from '@iconify/svelte';
	import { m } from '$lib/paraglide/messages.js';
	import Tabs from '$lib/components/Tabs.svelte';
	import Friends from './Friends.svelte';
	import OtherPlayers from './OtherPlayers.svelte';
	import { goto } from '$app/navigation';
	import config from '$lib/config';

	// Define the type for game mode keys
	type GameModeKey = '1vs1' | '1vs2' | '1vs3';

	// Explicitly type the gameModes array
	const gameModes = (['1vs1', '1vs2', '1vs3'] as GameModeKey[]).map((value) => ({
		value,
		text: m[value]()
	}));
	let gameMode = $state('1vs1');

	function selectGameMode(mode) {
		gameMode = mode;
	}
</script>

<div class="game-container">
	<div class="header">
		<Button inline>
			{#snippet prepend()}
				<Icon icon="mingcute:arrow-left-fill" width="100%" height="100%" />
			{/snippet}
		</Button>
		<h1>Créer une partie</h1>
	</div>

	<ButtonGroup>
		{#each gameModes as gm}
			<Button active={gameMode === gm.value} onclick={() => selectGameMode(gm.value)}
				>{gm.text}</Button
			>
		{/each}
	</ButtonGroup>

	<Tabs
		style="flex: 1"
		items={[
			{ name: 'Friends', comp: Friends },
			{ name: 'Other players', comp: OtherPlayers }
		]}
	/>

	<Button>Play vs Computer</Button>
</div>

<style>
	/* Variables de couleurs */
	:root {
		--primary-bg: #687851;
		--dark-green: #383f2b;
		--light-tan: #e6d3a3;
		--brown: #5e4b35;
		--active-tab-bg: var(--light-tan);
		--inactive-tab-bg: var(--dark-green);
	}

	/* Styles globaux */
	.game-container {
		/* font-family: Arial, sans-serif; */
		max-width: 500px;
		margin: 0 auto;
		height: calc(100% - 40px);
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	/* En-tête */
	.header {
		display: flex;
		align-items: center;
		gap: 10px;
		/* margin-bottom: 20px; */
	}

	h1 {
		font-size: 26px;
		/* color: var(--button-background); */
		text-align: center;
		font-weight: bold;
		margin: 0;
		padding-right: 10px;
		width: 100%;
	}

	.players-section {
		background-color: var(--light-tan);
		border-radius: 20px;
		overflow: hidden;
		margin-bottom: 20px;
	}

	.tabs {
		display: flex;
	}

	.tab-button {
		flex: 1;
		background: none;
		border: none;
		padding: 15px 0;
		font-size: 18px;
		font-weight: bold;
		cursor: pointer;
	}

	.tab-button.active {
		background-color: var(--light-tan);
		color: var(--dark-green);
	}

	.tab-button:not(.active) {
		background-color: var(--dark-green);
		color: var(--light-tan);
	}

	.search-container {
		padding: 15px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}

	.search-box {
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 25px;
		display: flex;
		align-items: center;
		padding: 8px 15px;
	}

	.search-icon {
		margin-right: 10px;
		color: rgba(0, 0, 0, 0.5);
	}

	input {
		background: none;
		border: none;
		outline: none;
		flex: 1;
		font-size: 16px;
		color: var(--dark-green);
	}

	.players-list {
		max-height: 300px;
		overflow-y: auto;
	}

	.player-item {
		display: flex;
		align-items: center;
		padding: 15px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}

	.player-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-right: 15px;
	}

	.player-name {
		flex: 1;
		font-size: 18px;
		font-weight: bold;
	}

	.select-button {
		width: 30px;
		height: 30px;
		border: 2px solid var(--dark-green);
		border-radius: 5px;
		background: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.select-button.selected {
		background-color: var(--brown);
		color: white;
		border: none;
	}

	.checkmark {
		font-size: 18px;
	}

	.play-button {
		background-color: var(--light-tan);
		/* color: var(--dark-green); */
		border: none;
		border-radius: 20px;
		padding: 15px;
		font-size: 22px;
		font-weight: bold;
		margin-bottom: 20px;
		cursor: pointer;
	}
</style>
