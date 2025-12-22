<script lang="ts">
	const {
		active = false,
		items,
		currentIndex = 0,
		depthColor = 'var(--button-depth-color)',
		...rest
	} = $props();

	let cur = $state(currentIndex);
	let Component = $derived(items[cur].comp);
</script>

<div class="players-section" {...rest}>
	<div class="tabs">
		{#each items as item, index}
			<button class="tab-button" class:active={cur === index} onclick={() => (cur = index)}>
				{item.name}
			</button>
		{/each}
	</div>

	<div class="component">
		<div class="component-content" style="box-shadow: 0 4px 0 {depthColor};">
			<Component />
		</div>
	</div>
</div>

<style>
	:root {
		--primary-bg: #687851;
		/* --light-tan: #e6d3a3; */
		--light-tan: #edc479;
		--brown: #5e4b35;
		--active-tab-bg: var(--light-tan);
		--inactive-tab-bg: var(--dark-green);
	}

	.players-section {
		/* overflow: hidden; */
		margin-bottom: 20px;
		display: flex;
		flex-direction: column;
		/* margin: 0 0 4px; */
		/* overflow: hidden; */
	}

	.tabs {
		display: flex;
		margin: 0 15px;
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
		overflow: hidden;
	}

	.tab-button {
		flex: 1;
		/* background: none; */
		border: none;
		background: var(--light-tan);
		padding: 10px 0;
		font-size: 18px;
		font-weight: bold;
		cursor: pointer;
	}

	.tab-button.active {
		background-color: var(--light-tan);
		/* color: var(--button-background); */
		cursor: default;
	}

	.tab-button:not(.active) {
		background-color: var(--button-background);
		/* color: var(--light-tan); */
	}

	.component {
		/* background-color: var(--light-tan); */
		background: linear-gradient(var(--light-tan), #e8bd73);
		border-radius: 10px;
		/* border: 2px solid black; */
		margin: 0 0 4px;
		/* overflow: hidden; */
		/* overflow-y: auto; */
		box-shadow: 0 4px var(--left-shadow, 10px) rgba(0, 0, 0, 0.25);
		flex: 1;
		position: relative;
	}

	.component-content {
		/* flex: 1; */
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		overflow: hidden;
		overflow-y: auto;
		border-radius: 10px;
		margin: 0 0 4px;
	}
</style>
