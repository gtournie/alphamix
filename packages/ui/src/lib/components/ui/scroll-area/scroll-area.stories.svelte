<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";

	const tags = Array.from({ length: 50 }, (_, i) => `v1.2.0-beta.${50 - i}`);

	const works = [
		{
			artist: "Ornella Binni",
			art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
		},
		{
			artist: "Tom Byrom",
			art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
		},
		{
			artist: "Vladimir Malyavko",
			art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
		},
	];

	const { Story } = defineMeta({
		title: "UI/ScrollArea",
		component: ScrollArea,
		tags: ["autodocs"],
	});
</script>

<Story name="Vertical">
	{#snippet template()}
		<ScrollArea class="h-72 w-48 rounded-md border">
			<div class="p-4">
				<h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
				{#each tags as tag (tag)}
					<div class="text-sm">{tag}</div>
					<Separator class="my-2" />
				{/each}
			</div>
		</ScrollArea>
	{/snippet}
</Story>

<Story name="Horizontal">
	{#snippet template()}
		<ScrollArea class="w-96 rounded-md border" orientation="horizontal">
			<div class="flex w-max space-x-4 p-4">
				{#each works as artwork (artwork.artist)}
					<figure class="shrink-0">
						<div class="overflow-hidden rounded-md">
							<img
								src={artwork.art}
								alt="Photo by {artwork.artist}"
								class="aspect-3/4 h-50 w-auto object-cover"
							/>
						</div>
						<figcaption class="text-muted-foreground pt-2 text-xs">
							Photo by <span class="text-foreground font-semibold"
								>{artwork.artist}</span
							>
						</figcaption>
					</figure>
				{/each}
			</div>
		</ScrollArea>
	{/snippet}
</Story>
