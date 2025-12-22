<script module lang="ts">
	let lastValue = '';
	const flipDurationMs = 200;

	const transformDraggedElement = (draggedEl, data, index) => {
		const elt = draggedEl.querySelector(':scope > *:first-child');
		if (elt) elt.style.opacity = 0.5;
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Board } from 'game-core/src/core/game/Board';
	import api from '$lib/api';
	// import Tile from '../auth/login/Tile.svelte';
	import Tile2 from '$lib/components/Tile.svelte';
	import { draggable, droppable, type DragDropState } from '@thisux/sveltednd';
	import { flip } from 'svelte/animate';
	import Square from './Square.svelte';
	import { boardState } from './board-state.svelte';
	import { get, writable } from 'svelte/store';

	const rackDrag = writable(true);
	rackDrag.set(false);

	boardState.userTiles = [];

	let board = $state(new Board());
	let grid = $derived(board.hGrid);
	let squareStates = $state(Board.createGrid(() => ''));
	let items = $state([]);
	let emptyItemIds = $derived(
		items.reduce((h, item) => {
			if (item.empty) h[item.id] = true;
			return h;
		}, {})
	);

	$effect.pre(() => {
		const id = page.url.searchParams.get('id') || '';
		if (!id) goto('/game/list');

		(async () => {
			const gameData = await api.getGameData(id);
			items = gameData.currentGameUser.tiles
				.split('')
				.map((tileChar, index) => ({ id: index, tileChar }));
			// console.log(gameData);
			board = Board.buildFromHistory(gameData.game.history);
			// console.log(board.hGrid);
		})();
	});

	function onmove() {
		lastValue = '';
		squareStates = Board.createGrid(() => ({
			border: false,
			top: false,
			bottom: false,
			left: false,
			right: false
		}));
	}

	function onplay() {
		let value = boardState.userTiles.map((t) => t.y + t.char + t.x).join('');
		if (value === lastValue) return;
		lastValue = value;

		const info = board.checkLetters(boardState.userTiles);
		// console.log(
		// 	userTiles.map((t) => t.char).join(''),
		// 	boardState.userTiles.map((t) => t.char).join('')
		// );
		const newSquareStates = Board.createGrid(() => ({
			border: false,
			top: false,
			bottom: false,
			left: false,
			right: false
		}));

		if (info.valid) {
			const { wordSpan, crossWordSpans } = info;
			const all = [wordSpan, ...crossWordSpans];

			all.forEach(({ coords }) => {
				coords.forEach((coord) => {
					newSquareStates[coord.y][coord.x] = {
						border: true,
						top: true,
						bottom: true,
						left: true,
						right: true
					};
				});
			});
			newSquareStates.forEach((row, y) => {
				row.forEach((_, x) => {
					const state = newSquareStates[y][x];
					if (state.border) {
						if (y > 0 && newSquareStates[y - 1][x].border) state.top = false;
						if (y < newSquareStates.length - 1 && newSquareStates[y + 1][x].border)
							state.bottom = false;
						if (x > 0 && newSquareStates[y][x - 1].border) state.left = false;
						if (x < row.length - 1 && newSquareStates[y][x + 1].border) state.right = false;
					}
				});
			});
		}
		squareStates = newSquareStates;
		// console.log(squareStates);
	}
</script>

<div class="container">
	<div class="board">
		{#each grid as row, y}
			<div class="row">
				{#each row as tile, x}
					{@const state = squareStates[y][x]}
					<div
						class="col"
						class:border={state.border}
						class:top={state.top}
						class:bottom={state.bottom}
						class:left={state.left}
						class:right={state.right}
					>
						<div class="square"></div>
						{#if !tile.isEmpty}
							<Square
								{y}
								{x}
								dnd={false}
								bonus={tile.bonus}
								items={[{ ...tile, id: `${y}-${x}` }]}
							/>
							<!-- <Tile2 letter={tile.tileChar} shadow={false} fitContent={true} /> -->
						{:else}
							<Square {y} {x} bonus={tile.bonus} {onplay} {onmove} />
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div class="tile-rack">
		{#each items as item, index (item.id)}
			<div
				use:draggable={{
					container: index.toString(),
					dragData: item,
					onDragStart,
					onDragEnd
				}}
				use:droppable={{
					container: index.toString(),
					callbacks: {
						onDrop,
						onDragOver
					},
					attributes: {
						draggingClass: '',
						dragOverClass: ''
					}
				}}
			></div>
		{/each}
	</div>
	<!-- <div
		class="tile-rack"
		use:dndzone={options}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
	>
		{#each items as item (`${item.id}${item.empty ? '_empty' : item.isDndShadowItem ? '_shadow' : ''}`)}
			<div
				data-is-dnd-shadow-item-hint={item[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
				class="item"
				class:draggable={!item.empty}
				animate:flip={{ duration: flipDurationMs }}
			>
				{#if !item.empty}
					<Tile2 letter={item.tileChar} />
				{/if}
			</div>
		{/each}
	</div> -->
</div>

<style>
	.item[data-is-dnd-shadow-item-hint] {
		border: 1px solid blue;
	}
	.container,
	.container * {
		user-select: none;
	}

	.container {
		--gap: 1px;
		--highlight-border-width: 2px;
		--no-gap: calc(-1 * var(--highlight-border-width));
		--border-radius: 5px;

		width: 100%;
		height: 100%;
		max-width: 500px;
		margin: auto;
	}
	.board {
		width: calc(100% - 10px);
		padding: 5px;
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		border-radius: calc(-1px + var(--border-radius));
		background-color: #eece93;
		box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.05);
	}
	.row {
		display: flex;
		flex-direction: row;
		/* width: 100%; */
		flex: 1;
		/* border: 1px solid red; */
	}
	.col {
		display: flex;
		/* justify-content: center;
		align-items: center; */
		flex: 1;
		aspect-ratio: 1;
		width: 100%;
		position: relative;
		margin: var(--gap);
		background-color: #e7c286;
		/* 1px 1px 1px #dfba78; */
	}
	.square {
		position: absolute;
		top: 1px;
		right: 1px;
		bottom: 1px;
		left: 1px;
		display: flex;
		border-radius: 2px;
		box-shadow:
			-1px -1px 0px #d5ab6a,
			1px 1px 0px #e2bf81,
			-1px 1px 0px #dcb576,
			1px -1px 0px #dcb576;
	}
	.tile-rack {
		height: 60px;
		margin: 10px 1%;
		display: flex;
	}
	.item {
		width: 13%;
		margin: 0 1%;
		height: 100%;
		outline: none !important;
	}
	.draggable {
		cursor: pointer;
	}
	.border::before {
		content: '';
		position: absolute;
		/* z-index: 2; */
		top: var(--no-gap);
		left: var(--no-gap);
		right: var(--no-gap);
		bottom: var(--no-gap);
		border: 0 solid green;
	}
	.border.top::before {
		border-top-width: var(--highlight-border-width);
	}
	.border.left::before {
		border-left-width: var(--highlight-border-width);
	}
	.border.bottom::before {
		border-bottom-width: var(--highlight-border-width);
	}
	.border.right::before {
		border-right-width: var(--highlight-border-width);
	}
	.border.top.left::before {
		border-top-left-radius: var(--border-radius);
	}
	.border.top.right::before {
		border-top-right-radius: var(--border-radius);
	}
	.border.bottom.left::before {
		border-bottom-left-radius: var(--border-radius);
	}
	.border.bottom.right::before {
		border-bottom-right-radius: var(--border-radius);
	}
</style>
