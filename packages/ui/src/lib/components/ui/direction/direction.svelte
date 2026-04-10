<script lang="ts">
	import { setContext, type Snippet } from "svelte";
	import type { Direction } from "./index.js";

	let {
		ref = $bindable(null),
		direction = "ltr",
		children,
	}: {
		ref?: HTMLDivElement | null;
		direction?: Direction;
		children?: Snippet;
	} = $props();

	setContext<() => Direction>("direction", () => direction);
</script>

<div data-slot="direction" bind:this={ref} dir={direction}>
	{@render children?.()}
</div>
