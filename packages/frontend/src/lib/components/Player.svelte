<script lang="ts">
	import Icon from '@iconify/svelte';

	const { name, selectable = false, children = null, ...props } = $props();
</script>

<div class="player" class:selectable {...props}>
	<div class="icon"><Icon icon="ix:user-filled" height="100%" width="100%" /></div>
	<div class="name">{name}</div>
	{#if children}
		<div class="children">{@render children?.()}</div>
	{/if}
</div>

<style>
	.player {
		display: flex;
		gap: 20px;
		padding: 7px 20px;
		line-height: 30px;
		max-height: 30px;
		white-space: nowrap;
		text-overflow: ellipsis;
		border-top: 1px solid #cfbd92;
		border-bottom: 1px solid #cfbd92;
		margin-bottom: -1px;
	}

	.player:first-child {
		border-top: none;
	}

	.selectable {
		cursor: pointer;
	}

	.icon {
		width: 20px;
		height: 20px;
		background-color: #cfbd92;
		border-radius: 50%;
		padding: 5px;
		overflow: hidden;
	}

	.icon :global(svg) {
		color: #808065;
		transform: scale(1.6) translateY(4px);
	}

	.name {
		font-size: 18px;
		font-weight: bold;
	}

	.children {
		margin-left: auto;
	}
</style>
