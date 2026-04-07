<script lang="ts">
	import { type WithElementRef, cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div {...restProps} bind:this={ref} data-slot="range-calendar-month" class={cn("flex flex-col", className)}>
	{@render children?.()}
</div>
