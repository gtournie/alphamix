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
		<div class="flex items-center space-x-4">
			<Skeleton class="size-12 rounded-full" />
			<div class="space-y-2">
				<Skeleton class="h-4 w-[250px]" />
				<Skeleton class="h-4 w-[200px]" />
			</div>
		</div>
	{/snippet}
</Story>

<Story name="Card">
	{#snippet template()}
		<Card.Root class="w-[350px]">
			<Card.Header>
				<Skeleton class="h-5 w-[200px]" />
				<Skeleton class="h-4 w-[150px]" />
			</Card.Header>
			<Card.Content class="space-y-3">
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-3/4" />
			</Card.Content>
		</Card.Root>
	{/snippet}
</Story>

<Story name="Text">
	{#snippet template()}
		<div class="space-y-2">
			<Skeleton class="h-4 w-full" />
			<Skeleton class="h-4 w-full" />
			<Skeleton class="h-4 w-3/4" />
		</div>
	{/snippet}
</Story>

<Story name="Form">
	{#snippet template()}
		<div class="w-[350px] space-y-4">
			<div class="space-y-2">
				<Skeleton class="h-4 w-[100px]" />
				<Skeleton class="h-10 w-full rounded-md" />
			</div>
			<div class="space-y-2">
				<Skeleton class="h-4 w-[100px]" />
				<Skeleton class="h-10 w-full rounded-md" />
			</div>
			<Skeleton class="h-10 w-[120px] rounded-md" />
		</div>
	{/snippet}
</Story>

<Story name="Table">
	{#snippet template()}
		<div class="w-[400px] space-y-2">
			{#each Array.from({ length: 3 }) as _}
				<div class="flex gap-4">
					<Skeleton class="h-4 flex-1" />
					<Skeleton class="h-4 flex-1" />
					<Skeleton class="h-4 flex-1" />
				</div>
			{/each}
		</div>
	{/snippet}
</Story>
