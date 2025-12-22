<script lang="ts">
	const {
		background = 'var(--button-background)',
		color = 'var(--button-color)',
		depthColor = 'var(--button-depth-color)',
		active = false,
		inline = false,
		children = null,
		prepend = null,
		append = null,
		style = '',
		...rest
	} = $props();
</script>

<button
	class="button"
	class:active
	style:width={inline ? 'auto' : '100%'}
	style:background
	style:color
	style="{style}; box-shadow: 0 4px 0 {depthColor}, 0 4px var(--left-shadow, 10px) rgba(0, 0, 0, 0.25);"
	{...rest}
>
	{#if prepend}
		<div class="icon">{@render prepend()}</div>
	{/if}
	{#if children}
		<span class="text">{@render children()}</span>
	{/if}
	{#if append}
		<div class="icon">{@render append()}</div>
	{/if}
</button>

<style>
	.button {
		--default-radius: 12px;

		display: flex;
		align-items: center;
		padding: 8px 0;
		margin: 0 0 4px;
		clip-path: var(--clip-path, none);
		border-radius: var(--border-top-left-radius, var(--default-radius))
			var(--border-top-right-radius, var(--default-radius))
			var(--border-bottom-right-radius, var(--default-radius))
			var(--border-bottom-left-radius, var(--default-radius));
		line-height: 30px;
		border: none;
		/* border: 1px solid  */
		cursor: pointer;
		/* font-size: 18px; */
		font-weight: bold;
		transition: all 0.2s ease;
		/* height: 54px; */
		/* position: relative; */
		overflow: hidden;
	}

	.button.new {
		background-color: #315e90;
		color: #f7e7cd;
		box-shadow:
			0 4px 0 #284465,
			0 4px 10px rgba(0, 0, 0, 0.25);
	}

	.button:hover,
	.button:active {
		transform: translateY(1px);
		box-shadow: none !important;
	}

	.active {
		transform: translateY(4px) !important;
		box-shadow: none !important;
		filter: brightness(95%);
	}

	.icon {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		width: 30px;
		height: 30px;
		margin-left: 20px;
		margin-right: 15px;
		/* font-size: 22px; */
		font-weight: bold;
	}

	.text {
		flex-grow: 1;
		/* text-align: left; */
		font-size: 18px;
	}

	.icon + .text {
		padding-right: 60px;
	}

	.text + .icon {
		padding-left: 60px;
	}
</style>
