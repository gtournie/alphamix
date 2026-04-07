<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card-footer"
	class={cn("bg-muted rounded-b-lg px-4 py-4 group-data-[size=sm]/card:px-3 group-data-[size=sm]/card:py-3 flex flex-wrap items-center gap-2", className)}
	{...restProps}
>
	{@render children?.()}
</div>
