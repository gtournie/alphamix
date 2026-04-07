<script lang="ts">
	import { type WithElementRef, cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<div {...restProps} bind:this={ref} data-slot="calendar-month" class={cn("flex w-full flex-col gap-4", className)}>
	{@render children?.()}
</div>
