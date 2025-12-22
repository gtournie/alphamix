<script module lang="ts">
	const flipDurationMs = 100;

	const transformDraggedElement = (draggedEl, data, index) => {
		const elt = draggedEl.querySelector(':scope > *:first-child');
		elt.style.opacity = 0.5;
	};
</script>

<script>
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME, TRIGGERS } from 'svelte-dnd-action';
	import Tile from '$lib/components/Tile.svelte';
	import { boardState } from './board-state.svelte';

	let {
		bonus,
		x,
		y,
		dnd = true,
		onplay = null,
		onreset = null,
		items: originalItems = []
	} = $props();
	let bonusClass = $derived(bonus.type);
	let conditionalDnd = $derived(dnd ? dndzone : () => {});

	let node = $state();

	let items = $derived(!dnd ? originalItems : boardState.squareItems[y][x]);

	let options = $derived({
		dropFromOthersDisabled: items.length,
		items,
		dropTargetStyle: {},
		flipDurationMs,
		transformDraggedElement
	});

	function handleDnd(e) {
		const { trigger } = e.detail.info;
		// console.log(trigger);
		if (trigger === TRIGGERS.DRAG_STARTED && onreset) {
			let index = boardState.userTiles.findIndex((t) => t.y === y && t.x === x);
			if (index >= 0) {
				boardState.userTiles.splice(index, 1);
				// boardState.userTiles = boardState.userTiles;
			}
			onreset();
		}
		if (
			(trigger === TRIGGERS.DROPPED_OUTSIDE_OF_ANY || trigger === TRIGGERS.DROPPED_INTO_ANOTHER) &&
			onplay
		) {
			onplay();
		}
		if (trigger === TRIGGERS.DROPPED_INTO_ZONE) {
			const item = e.detail.items[0];
			if (!item.isDndShadowItem && !item.empty) {
				boardState.userTiles.push({ char: item.tileChar, y, x, key: item.key, node });
				if (onplay) onplay();
			}
		}
		items = e.detail.items;
		// console.log(items);
	}
</script>

<div
	bind:this={node}
	class={bonusClass}
	class:square={true}
	class:star={y === 7 && x === 7}
	style={items.some((tile) => tile[SHADOW_ITEM_MARKER_PROPERTY_NAME])
		? 'background: rgba(0, 0, 0, 0.1)'
		: ''}
	use:conditionalDnd={options}
	onconsider={handleDnd}
	onfinalize={handleDnd}
>
	{#if items.length}
		{#each items as item (item.id)}
			<Tile key={item.key} letter={item.tileChar} shadow={false} fitContent={true} />
		{/each}
	{:else}
		{bonus.txt}
	{/if}
</div>

<style>
	.square {
		width: calc(100% - 4px);
		height: calc(100% - 4px);
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ead6b4;
		font-family: sans-serif;
		font-weight: normal;
		font-size: 11px;
		padding: 2px;
		background-color: #e7c286;
		background-clip: content-box;
	}
	.star {
		color: transparent;
	}
	.star::before {
		content: '';
		position: absolute;
		inset: 3px;
		background: #eece93;
		clip-path: polygon(50% 0, 79% 90%, 2% 35%, 98% 35%, 21% 90%);
	}
	.W3 {
		background-color: #d86d58;
	}
	.W2 {
		background-color: #e0996e;
	}
	.L3 {
		background-color: hsl(95, 11%, 57%);
	}
	.L2 {
		background-color: #a9b4a1;
	}
</style>
