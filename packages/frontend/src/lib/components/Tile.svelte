<script>
	import { TILE_SCORE } from 'game-core/src/core/game/const';
	import { onMount } from 'svelte';

	let { letter, shadow = true, key = null, fitContent = false } = $props();

	let node = $state();
	let fontSize = $state();
	// let offsetWidth = $state(0);

	// onMount(() => {
	// 	const position = div.style.position;
	// 	div.style.position = 'absolute';
	// 	offsetWidth = div.offsetWidth;
	// 	div.style.position = position;
	// 	const cs = getComputedStyle(div.parentNode);
	// 	console.log(offsetWidth, cs.margin, cs.padding, cs.borderWidth);
	// });

	const onresize = () => {
		if (!node || !fitContent) return;
		fontSize =
			16 *
				((node.parentNode.offsetWidth - parseInt(getComputedStyle(node.parentNode).padding) * 2) /
					63) +
			'px';
	};

	$effect(onresize);
</script>

<svelte:window on:resize={onresize} />

<div
	class="tile"
	data-key={key}
	class:shadow
	class:fitContent
	bind:this={node}
	style:font-size={fontSize}
>
	<div class="letter">{letter}</div>
	<div class="points">{TILE_SCORE[letter]}</div>
</div>

<style>
	.tile {
		position: relative;
		background-color: #f8d795;
		border-radius: 10%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: 'Arial Rounded MT Bold', 'Arial', sans-serif;
		color: var(--tile-color);
		width: 58px;
		height: 58px;
		outline: none !important;
		border: 1px solid #a46736;
	}
	.fitContent {
		position: absolute;
	}
	.shadow {
		border: none;
		box-shadow:
			5px 5px 0px #a46736,
			4px 4px 0px #a46736,
			3px 3px 0px #a46736,
			2px 2px 0px #a46736,
			1px 1px 0px #a46736;
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
