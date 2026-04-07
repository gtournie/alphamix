<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import { cn } from "$lib/utils.js";
	import { buttonVariants } from "../button/index.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: PaginationPrimitive.PrevButtonProps = $props();
</script>

{#snippet Fallback()}
	<ChevronLeftIcon class="size-4" />
	<span class="hidden sm:block">Previous</span>
{/snippet}

<PaginationPrimitive.PrevButton
	bind:ref
	data-slot="pagination-previous"
	class={cn(buttonVariants({ variant: "ghost" }), "pl-2!", className)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		{@render Fallback()}
	{/if}
</PaginationPrimitive.PrevButton>
