<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Skeleton } from "$lib/components/ui/skeleton/index.js";
	import { Card, CardHeader, CardContent } from "$lib/components/ui/card/index.js";

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
		<Card class="w-[350px]">
			<CardHeader>
				<Skeleton class="h-5 w-[200px]" />
				<Skeleton class="h-4 w-[150px]" />
			</CardHeader>
			<CardContent>
				<Skeleton class="aspect-video w-full" />
			</CardContent>
		</Card>
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
			{#each Array.from({ length: 3 }) as _, i (i)}
				<div class="flex gap-4">
					<Skeleton class="h-4 flex-1" />
					<Skeleton class="h-4 w-24" />
					<Skeleton class="h-4 w-20" />
				</div>
			{/each}
		</div>
	{/snippet}
</Story>
