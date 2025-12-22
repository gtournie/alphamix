<script>
	import { TILE_SCORE } from 'game-core/src/core/game/const';
	import { fall } from './fall';
	import { onMount } from 'svelte';

	let {
		animDelay = 0,
		letter,
		visible = false,
		rotate = 0,
		left = null,
		right = null,
		top = null,
		bottom = null,
		floating = true,
		fitContent = false
	} = $props();

	let isVisible = $state(visible);
	let div = $state();
	let transform = rotate ? `rotate(${rotate}deg)` : '';
	let fontSize = $state();

	onMount(() => (isVisible = true));

	function onresize() {
		if (!div || !fitContent) return;
		fontSize = 16 * (div.parentNode.offsetWidth / 60) + 'px';
	}

	$effect(() => {
		onresize();
	});

	const animate = (node, args) => {
		if (!args.cond) return fall(node, { rotate, delay: animDelay, fromLeft: left !== null });
	};
</script>

<svelte:window on:resize={onresize} />

{#if isVisible}
	<div
		bind:this={div}
		class="tile"
		class:floating
		style:left="{left}em"
		style:right="{right}em"
		style:top="{top}em"
		style:bottom="{bottom}em"
		style:transform
		style:font-size={fontSize}
		transition:animate={{ cond: visible }}
	>
		<div class="letter">{letter}</div>
		<div class="points">{TILE_SCORE[letter]}</div>
	</div>
{/if}

<style>
	.tile.floating {
		position: absolute;
	}
	.tile {
		position: relative;
		background-color: #f8d795;
		border-radius: 10%;
		box-shadow:
			5px 5px 0px #a46736,
			4px 4px 0px #a46736,
			3px 3px 0px #a46736,
			2px 2px 0px #a46736,
			1px 1px 0px #a46736;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: 'Arial Rounded MT Bold', 'Arial', sans-serif;
		color: var(--tile-color);
		width: 60px;
		height: 60px;
	}

	.letter {
		font-weight: bold;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -52%);
		font-size: 32px;
	}

	.points {
		position: absolute;
		bottom: 1%;
		right: 10%;
		letter-spacing: -2px;
		font-size: 14px;
		font-weight: bold;
	}
</style>
