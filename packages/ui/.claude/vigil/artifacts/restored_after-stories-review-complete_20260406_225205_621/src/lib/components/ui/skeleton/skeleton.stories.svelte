<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Skeleton } from "$lib/components/ui/skeleton/index.js";
	import * as Card from "$lib/components/ui/card/index.js";

	const { Story } = defineMeta({
		title: "UI/Skeleton",
		component: Skeleton,
		tags: ["autodocs"],
	});
</script>

<Story name="Avatar">
	{#snippet template()}
		<div class="flex w-fit items-center gap-4">
			<Skeleton class="size-10 shrink-0 rounded-full" />
			<div class="grid gap-2">
				<Skeleton class="h-4 w-[150px]" />
				<Skeleton class="h-4 w-[100px]" />
			</div>
		</div>
	{/snippet}
</Story>

<Story name="Card">
	{#snippet template()}
		<Card.Root class="w-full max-w-xs">
			<Card.Header>
				<Skeleton class="h-4 w-2/3" />
				<Skeleton class="h-4 w-1/2" />
			</Card.Header>
			<Card.Content>
				<Skeleton class="aspect-video w-full" />
			</Card.Content>
		</Card.Root>
	{/snippet}
</Story>

<Story name="Text">
	{#snippet template()}
		<div class="flex w-full max-w-xs flex-col gap-2">
			<Skeleton class="h-4 w-full" />
			<Skeleton class="h-4 w-full" />
			<Skeleton class="h-4 w-3/4" />
		</div>
	{/snippet}
</Story>

<Story name="Form">
	{#snippet template()}
		<div class="flex w-full max-w-xs flex-col gap-7">
			<div class="flex flex-col gap-3">
				<Skeleton class="h-4 w-20" />
				<Skeleton class="h-8 w-full" />
			</div>
			<div class="flex flex-col gap-3">
				<Skeleton class="h-4 w-24" />
				<Skeleton class="h-8 w-full" />
			</div>
			<Skeleton class="h-8 w-24" />
		</div>
	{/snippet}
</Story>

<Story name="Table">
	{#snippet template()}
		<div class="flex w-full max-w-sm flex-col gap-2">
			{#each Array.from({ length: 5 }) as _, index (index)}
				<div class="flex gap-4">
					<Skeleton class="h-4 flex-1" />
					<Skeleton class="h-4 w-24" />
					<Skeleton class="h-4 w-20" />
				</div>
			{/each}
		</div>
	{/snippet}
</Story>
