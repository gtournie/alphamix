<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Kbd } from "$lib/components/ui/kbd/index.js";
	import SaveIcon from "@lucide/svelte/icons/save";

	const sides = /** @type {const} */ (["left", "top", "bottom", "right"]);

	const { Story } = defineMeta({
		title: "UI/Tooltip",
		component: Tooltip.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Side">
	{#snippet template()}
		<div class="flex flex-wrap items-center justify-center gap-2 pt-25">
			{#each sides as side}
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" class="w-fit capitalize" {...props}
								>{side}</Button
							>
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

<Story name="With Keyboard Shortcut">
	{#snippet template()}
		<div class="flex flex-wrap items-center justify-center gap-2 pt-25">
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
					<span class="inline-flex items-center gap-1"
						>Save Changes <Kbd>S</Kbd></span
					>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	{/snippet}
</Story>

<Story name="Disabled Button">
	{#snippet template()}
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<span {...props}>
						<Button disabled>Disabled</Button>
					</span>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>You don't have permission to do this.</p>
			</Tooltip.Content>
		</Tooltip.Root>
	{/snippet}
</Story>
