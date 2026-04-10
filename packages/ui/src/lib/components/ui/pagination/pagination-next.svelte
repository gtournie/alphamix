<script lang="ts">
	import { Pagination as PaginationPrimitive } from "bits-ui";
	import type { Pagination } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { buttonVariants } from "../button/index.js";
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: Pagination.NextButtonProps = $props();
</script>

{#snippet Fallback()}
	<span class="hidden sm:block">Next</span>
	<ChevronRightIcon class="size-4" />
{/snippet}

<PaginationPrimitive.NextButton
	bind:ref
	aria-label="Go to next page"
	data-slot="pagination-next"
	class={cn(buttonVariants({ variant: "ghost", size: "default" }), "pr-1.5!", className)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		{@render Fallback()}
	{/if}
</PaginationPrimitive.NextButton>
