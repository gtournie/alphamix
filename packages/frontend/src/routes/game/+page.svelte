<script module lang="ts">
	let lastValue = '';
	const flipDurationMs = 200;

	const transformDraggedElement = (draggedEl, data, index) => {
		const elt = draggedEl.querySelector(':scope > *:first-child');
		if (elt) elt.style.opacity = 0.5;
	};

	const newSquareState = (bool: boolean) => ({
		valid: bool,
		top: bool,
		bottom: bool,
		left: bool,
		right: bool,
		score: null
	});
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Board } from 'game-core/src/core/game/Board';
	import api from '$lib/api';
	// import Tile from '../auth/login/Tile.svelte';
	import Tile2 from '$lib/components/Tile.svelte';
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME, TRIGGERS } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import Square from './Square.svelte';
	import { boardState } from './board-state.svelte';
	import { get, writable } from 'svelte/store';
	import { TILE_RACK_SIZE } from 'game-core/src/core/game/const';
	import { m } from '$lib/paraglide/messages.js';

	const gameId = page.url.searchParams.get('id') || '';
	const rackDrag = writable(true);
	rackDrag.set(false);

	boardState.squareItems = Board.createGrid(() => []);
	boardState.userTiles = [];

	let history = $state('');
	let board = $derived(Board.buildFromHistory(history));
	let grid = $derived(board.hGrid);
	let allPlayers = $state([]);

	let squareStates = $state(Board.createGrid(() => ''));
	let items = $state([]);
	let rackStore = $state([]);

	let rackNodes = $state(new Array(TILE_RACK_SIZE).fill(null));
	let boardNode = $state();
	let overlayNode = $state();

	let options = $derived({
		items,
		flipDurationMs,
		morphDisabled: true,
		dropTargetStyle: {},
		transformDraggedElement
	});

	$effect.pre(() => {
		if (!gameId) goto('/game/list');

		(async () => {
			const gameData = await api.getGameData(gameId);
			items = gameData.currentGameUser.tiles
				.split('')
				.map((tileChar, index) => ({ tileChar, id: index, key: index }));
			// TODO: add empty items until items.length === 7
			rackStore = items;
			console.log(gameData);
			history = gameData.game.history;
			allPlayers = [gameData.currentGameUser, ...gameData.otherGameUsers];
			// console.log(board.hGrid);
		})();
	});

	function onreset() {
		lastValue = null;
		// squareStates = Board.createGrid(() => newSquareState(false));
		onplay();
	}

	function onplay() {
		let value = boardState.userTiles.map((t) => t.y + t.char + t.x).join('');
		if (value === lastValue) return;
		lastValue = value;

		const info = board.checkLetters(boardState.userTiles);
		const { wordSpan, crossWordSpans = [] } = info;
		const all = wordSpan ? [wordSpan, ...crossWordSpans] : [];

		const newSquareStates = Board.createGrid(() => newSquareState(false));
		if (info.valid) {
			all.forEach(({ coords }) => {
				coords.forEach((coord) => {
					newSquareStates[coord.y][coord.x] = newSquareState(true);
				});
			});
			newSquareStates.forEach((row, y) => {
				row.forEach((_, x) => {
					const state = newSquareStates[y][x];
					if (state.valid) {
						if (y > 0 && newSquareStates[y - 1][x].valid) state.top = false;
						if (y < newSquareStates.length - 1 && newSquareStates[y + 1][x].valid)
							state.bottom = false;
						if (x > 0 && newSquareStates[y][x - 1].valid) state.left = false;
						if (x < row.length - 1 && newSquareStates[y][x + 1].valid) state.right = false;
					}
				});
			});
		}
		if ('score' in info && !info.errors.floating) {
			let maxY = -1;
			let maxX = -1;
			all.forEach(({ coords }) => {
				coords.forEach(({ y, x }) => {
					maxY = Math.max(y, maxY);
					maxX = Math.max(x, maxX);
				});
			});
			if (maxX !== -1 && maxY !== -1) newSquareStates[maxY][maxX].score = info.score;
		}
		squareStates = newSquareStates;
	}

	function handleDndConsider(e) {
		const { trigger } = e.detail.info;
		if (trigger === TRIGGERS.DRAG_STARTED) {
			rackDrag.set(true);
		}
		if (e.detail.items.length === items.length) {
			items = e.detail.items;
			rackStore = items;
		}
		// if (trigger === TRIGGERS.DRAGGED_OVER_INDEX) {
		// 	if (!items.some((item) => item.empty || item.isDndShadowItem)) {
		// 		rackStore = items;
		// 	}
		// }
	}

	function handleDndFinalize(e) {
		const { trigger } = e.detail.info;
		if (get(rackDrag) && trigger === TRIGGERS.DROPPED_INTO_ANOTHER) {
			e.detail.items.forEach((item) => {
				if (item.isDndShadowItem) {
					item.empty = true;
					delete item.isDndShadowItem;
				}
			});
		}
		items = e.detail.items;
		rackDrag.set(false);
	}

	function resetSquareStates() {
		squareStates = Board.createGrid(() => newSquareState(false));
	}

	async function getTilesBack() {
		// kinda what onreset does. We can"t use it though, coz userTiles are still in dom...
		resetSquareStates();

		// Animation start. If you don't want this juste remove this part
		const rackEmptyNodesByKey = rackNodes.reduce((h, node) => {
			h[node.getAttribute('data-key')] = node.querySelector(':first-child');
			return h;
		}, {});
		let countFinished = boardState.userTiles.length;
		boardState.userTiles.forEach(({ node }, index) => {
			node = node.querySelector('[data-key]');
			node.classList.add('shadow'); // ensure it has the same size with tiles in rack

			const rackNode = rackEmptyNodesByKey[node.getAttribute('data-key')];
			const rackRect = rackNode.getBoundingClientRect();
			const nodeRect = node.getBoundingClientRect();
			const topDiff = rackRect.top - nodeRect.top + (rackNode.offsetHeight - node.offsetHeight) / 2;
			const leftDiff =
				rackRect.left - nodeRect.left + (rackNode.offsetWidth - node.offsetWidth) / 2;
			const scaleDiff = [
				rackNode.offsetWidth / node.offsetWidth,
				rackNode.offsetHeight / node.offsetHeight
			];

			node.animate(
				[
					{ transform: 'translate(0, 0) scale(1)', zIndex: 2 },
					{
						transform: `translate(${leftDiff}px, ${topDiff}px) scale(${scaleDiff.join(',')})`,
						zIndex: 2
					}
				],
				{
					delay: index * 150,
					duration: 250,
					easing: 'ease-out',
					fill: 'none'
				}
			).onfinish = () => {
				node.style.transform = `translate(${leftDiff}px, ${topDiff}px) scale(${scaleDiff.join(',')})`;
				if (--countFinished === 0) ondone();
			};
		});
		// Animation end

		// If you don't want any animation, just call this:
		function ondone() {
			boardState.userTiles = [];
			boardState.squareItems = Board.createGrid(() => []);
			items = rackStore.map((item) => ({ tileChar: item.tileChar, id: item.id, key: item.key }));
		}
	}

	async function play() {
		resetSquareStates();
		const info = board.checkLetters(boardState.userTiles);
		if (info.valid) {
			const countTiles = boardState.userTiles.length;
			const duration = 600;
			const delay = 180;
			const allDuration = (countTiles - 1) * delay + duration;

			const animation = overlayNode.animate(
				[
					{ display: 'block', background: 'rgba(0,0,0,0)' },
					{ display: 'block', background: 'rgba(0,0,0,0.12)' },
					{ display: 'block', background: 'rgba(0,0,0,0)' }
				],
				{ duration: allDuration, fill: 'none' }
			);
			animation.addEventListener('finish', save);

			const color = '#eece93';
			const thick = 1;
			const expand = 40;
			boardState.userTiles
				.sort(info.horizontal ? (a, b) => a.x - b.x : (a, b) => a.y - b.y)
				.forEach(({ node }, index) => {
					node = node.querySelector('[data-key]');
					node.animate(
						[
							{ transform: 'scale(1) rotate(0)', zIndex: 2, easing: 'ease-out' },
							{
								transform: `scale(1.6) rotate(7deg)`,
								boxShadow: 'none',
								zIndex: 2,
								easing: 'ease-in',
								offset: 0.4
							},
							{ transform: 'scale(1) rotate(0)', zIndex: 2, offset: 0.5 },
							{
								transform: 'scale(1) rotate(0)',
								boxShadow: `${thick}px ${thick}px ${expand}px ${color}, -${thick}px -${thick}px ${expand}px  ${color}, -${thick}px ${thick}px ${expand}px ${color}, ${thick}px -${thick}px ${expand}px ${color}`,
								zIndex: 2,
								offset: 0.75
							},
							{ zIndex: 2 }
						],
						{
							delay: index * delay,
							duration,
							// easing: 'ease-out',
							fill: 'none'
						}
					);
				});

			async function save() {
				// Save data
				const { drawn } = await api.playTurn(gameId, info.entry!);
				// update history (board will refresh automatically)
				history += info.entry;
				// update tiles
				boardState.userTiles.forEach(({ key }, index) => {
					const itemIndex = items.findIndex((item) => item.key === key);
					items[itemIndex] = { tileChar: drawn.charAt(index), id: items[itemIndex].id, key };
				});
				// TODO: have to do something if we get less drawn tiles than 7?
				rackStore = items;
			}
		}
	}
</script>

<div class="container" style={`--tile-rack-size: ${TILE_RACK_SIZE}`}>
	<div class="max-width">
		<div class="players">
			{#each allPlayers as player}
				<div class="player">{player.name} : {player.score}</div>
			{/each}
		</div>
	</div>
	<div class="board-auto-size">
		<div class="board" bind:this={boardNode}>
			<div class="overlay" bind:this={overlayNode}></div>
			{#each grid as row, y}
				<div class="row">
					{#each row as tile, x}
						{@const state = squareStates[y][x]}
						<div
							class="col"
							class:valid={state.valid}
							class:top={state.top}
							class:bottom={state.bottom}
							class:left={state.left}
							class:right={state.right}
							class:score={state.score}
							data-score={state.score}
							data-score-n={state.score ? ('' + state.score).length : null}
						>
							<div class="square"></div>
							{#if !tile.isEmpty}
								<Square
									{y}
									{x}
									dnd={false}
									bonus={tile.bonus}
									items={[{ ...tile, id: `${y}-${x}`, key: `${y}-${x}` }]}
								/>
							{:else}
								<Square {y} {x} bonus={tile.bonus} {onplay} {onreset} />
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
	<div class="max-width">
		<div
			class="tile-rack"
			use:dndzone={options}
			onconsider={handleDndConsider}
			onfinalize={handleDndFinalize}
		>
			{#each items as item, index (`${item.key}${item.empty ? '_empty' : item.isDndShadowItem ? '_shadow' : ''}`)}
				<div
					bind:this={rackNodes[index]}
					data-is-dnd-shadow-item-hint={item[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
					class="item"
					data-key={item.key}
					class:draggable={!item.empty}
					style:opacity={item.empty ? 0 : 1}
					animate:flip={{ duration: flipDurationMs }}
				>
					<Tile2 letter={item.tileChar} />
				</div>
			{/each}
		</div>
		<button onclick={getTilesBack}>Go see daddy</button>
		<button onclick={play}>{m.game_play()}</button>
	</div>
</div>

<style>
	.item[data-is-dnd-shadow-item-hint] {
		/* border: 1px solid blue; */
	}
	.container,
	.container * {
		user-select: none;
	}

	.container {
		--gap: 1px;
		--highlight-border-width: 2px;
		--no-gap: -1px; /* calc(-1 * var(--highlight-border-width)); */
		--border-radius: 5px;

		width: 100%;
		height: 100%;
		/* max-width: 500px; */
		margin: auto;
		display: flex;
		flex-direction: column;
		/* container-type: size; */
	}
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
		display: none;
	}

	.players {
		display: flex;
		justify-content: space-between;
	}

	.board-auto-size {
		flex: 1;
		position: relative;
	}

	.board {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		height: calc(100% - 10px);
		padding: 5px;
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		border-radius: calc(-1px + var(--border-radius));
		background-color: #eece93;
		box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.05);
		/* position: relative; */
		/* display: none; */
	}
	.row {
		display: flex;
		flex-direction: row;
		flex: 1;
	}
	.col {
		display: flex;
		/* justify-content: center;
		align-items: center; */
		flex: 1;
		aspect-ratio: 1;
		width: 100%;
		position: relative;
		/* margin: var(--gap); */

		/* 1px 1px 1px #dfba78; */
	}
	.square {
		position: absolute;
		top: 2px;
		right: 2px;
		bottom: 2px;
		left: 2px;
		display: flex;
		border-radius: 2px;
		box-shadow:
			-1px -1px 0px #d5ab6a,
			1px 1px 0px #e2bf81,
			-1px 1px 0px #dcb576,
			1px -1px 0px #dcb576;
	}
	.max-width {
		width: calc((58px + 15px) * var(--tile-rack-size)); /* 10px being padding */
		margin: 0 auto;
	}
	.tile-rack {
		height: 58px; /* TODO: sync it with tile height...? */
		margin: 10px 1%;
		min-height: auto !important;
		min-width: auto !important;
		display: flex;
		width: 100%;
		justify-content: space-around;
	}
	.item {
		flex: 1;
		display: flex;
		justify-content: center;
		outline: none !important;
	}
	.draggable {
		cursor: pointer;
	}
	.score::after {
		position: absolute;
		z-index: 2;
		content: attr(data-score);
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		bottom: 0;
		right: 0;
		border-radius: 50%;
		font-family: Arial, sans-serif;
		letter-spacing: -0.5px;
		white-space: nowrap;
		overflow: hidden;
		color: white;
		margin: auto;
		background: red;
		transform: translate(65%, 65%);

		/* 4 numbers and more. Should be VERY rare */
		font-size: 9px;
		min-width: 42px;
	}
	.score[data-score-n='1']::after {
		font-size: 10px;
		width: 22px;
		min-width: auto;
	}
	.score[data-score-n='2']::after {
		font-size: 10px;
		width: 24px;
		min-width: auto;
	}
	.score[data-score-n='3']::after {
		font-size: 9.5px;
		width: 32px;
		min-width: auto;
	}
	.valid.score::after {
		background: green;
	}
	.valid::before {
		content: '';
		position: absolute;
		pointer-events: none;
		/* z-index: 2; */
		top: var(--no-gap);
		left: var(--no-gap);
		right: var(--no-gap);
		bottom: var(--no-gap);
		border: 0 solid green;
	}
	.valid.top::before {
		border-top-width: var(--highlight-border-width);
	}
	.valid.left::before {
		border-left-width: var(--highlight-border-width);
	}
	.valid.bottom::before {
		border-bottom-width: var(--highlight-border-width);
	}
	.valid.right::before {
		border-right-width: var(--highlight-border-width);
	}
	.valid.top.left::before {
		border-top-left-radius: var(--border-radius);
	}
	.valid.top.right::before {
		border-top-right-radius: var(--border-radius);
	}
	.valid.bottom.left::before {
		border-bottom-left-radius: var(--border-radius);
	}
	.valid.bottom.right::before {
		border-bottom-right-radius: var(--border-radius);
	}
</style>
