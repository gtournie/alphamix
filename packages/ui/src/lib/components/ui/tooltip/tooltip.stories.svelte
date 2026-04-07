<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Kbd } from "$lib/components/ui/kbd/index.js";
	import InfoIcon from "@lucide/svelte/icons/info";
	import SaveIcon from "@lucide/svelte/icons/save";
	// Tooltip.Root already wraps TooltipProvider internally — no need for explicit Provider wrapper

	const sides = /** @type {const} */ (["top", "right", "bottom", "left"]);

	const { Story } = defineMeta({
		title: "UI/Tooltip",
		component: Tooltip.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Basic">
	{#snippet template()}
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" class="w-fit" {...props}>Show Tooltip</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Add to library</p>
			</Tooltip.Content>
		</Tooltip.Root>
	{/snippet}
</Story>

<Story name="Sides">
	{#snippet template()}
		<div class="flex flex-wrap gap-2">
			{#each sides as side}
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" class="w-fit capitalize" {...props}>{side}</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content {side}>
						<p>Add to library</p>
					</Tooltip.Content>
				</Tooltip.Root>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="With Icon">
	{#snippet template()}
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button variant="ghost" size="icon" {...props}>
						<InfoIcon />
						<span class="sr-only">Info</span>
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Additional information</p>
			</Tooltip.Content>
		</Tooltip.Root>
	{/snippet}
</Story>

<Story name="Long Content">
	{#snippet template()}
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" class="w-fit" {...props}>Show Tooltip</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>To learn more about how this works, check out the docs. If you have any questions, please
				reach out to us.</p>
			</Tooltip.Content>
		</Tooltip.Root>
	{/snippet}
</Story>

<Story name="With Keyboard Shortcut">
	{#snippet template()}
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" size="icon" {...props}>
						<SaveIcon />
						<span class="sr-only">Save</span>
					</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<span class="inline-flex items-center gap-1">Save Changes <Kbd>S</Kbd></span>
			</Tooltip.Content>
		</Tooltip.Root>
	{/snippet}
</Story>

<Story name="On Link">
	{#snippet template()}
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<a
						href="#"
						class="w-fit text-sm text-primary underline-offset-4 hover:underline"
						onclick={(e) => e.preventDefault()}
						{...props}
					>
						Learn more
					</a>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Click to read the documentation</p>
			</Tooltip.Content>
		</Tooltip.Root>
	{/snippet}
</Story>

<Story name="Formatted Content">
	{#snippet template()}
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" class="w-fit" {...props}>Status</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<div class="flex flex-col gap-1">
					<p class="font-semibold">Active</p>
					<p class="text-xs opacity-80">Last updated 2 hours ago</p>
				</div>
			</Tooltip.Content>
		</Tooltip.Root>
	{/snippet}
</Story>
