<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as HoverCard from "$lib/components/ui/hover-card/index.js";
	import { Button } from "$lib/components/ui/button/index.js";

	const sides = /** @type {const} */ (["left", "top", "bottom", "right"]);

	const { Story } = defineMeta({
		title: "UI/HoverCard",
		component: HoverCard.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Basic">
	{#snippet template()}
		<HoverCard.Root openDelay={10} closeDelay={100}>
			<HoverCard.Trigger>
				{#snippet child({ props })}
					<Button variant="link" {...props}>Hover Here</Button>
				{/snippet}
			</HoverCard.Trigger>
			<HoverCard.Content class="flex w-64 flex-col gap-0.5">
				<div class="font-semibold">@nextjs</div>
				<div>The React Framework – created and maintained by @vercel.</div>
				<div class="text-muted-foreground mt-1 text-xs">
					Joined December 2021
				</div>
			</HoverCard.Content>
		</HoverCard.Root>
	{/snippet}
</Story>

<Story name="Sides">
	{#snippet template()}
		<div class="flex flex-wrap justify-center gap-2 pt-25">
			{#each sides as side}
				<HoverCard.Root openDelay={100} closeDelay={100}>
					<HoverCard.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" class="capitalize" {...props}
								>{side}</Button
							>
						{/snippet}
					</HoverCard.Trigger>
					<HoverCard.Content {side}>
						<div class="flex flex-col gap-1">
							<h4 class="font-medium">Hover Card</h4>
							<p>This hover card appears on the {side} side of the trigger.</p>
						</div>
					</HoverCard.Content>
				</HoverCard.Root>
			{/each}
		</div>
	{/snippet}
</Story>
