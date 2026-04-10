<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import type { Pagination } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { buttonVariants } from "../button/index.js";
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: Pagination.PrevButtonProps = $props();
</script>

{#snippet Fallback()}
	<ChevronLeftIcon class="size-4" />
	<span class="hidden sm:block">Previous</span>
{/snippet}

<PaginationPrimitive.PrevButton
	bind:ref
	aria-label="Go to previous page"
	data-slot="pagination-previous"
	class={cn(buttonVariants({ variant: "ghost", size: "default" }), "pl-1.5!", className)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		{@render Fallback()}
	{/if}
</PaginationPrimitive.PrevButton>
