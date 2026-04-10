<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Kbd } from "$lib/components/ui/kbd/index.js";
	import SaveIcon from "@lucide/svelte/icons/save";

	const sides = ["left", "top", "bottom", "right"] as const;

	const { Story } = defineMeta({
		title: "UI/Tooltip",
		component: Tooltip.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Side">
	{#snippet template()}
		<div class="flex flex-wrap justify-center gap-2">
			{#each sides as side (side)}
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

<Story name="With Keyboard Shortcut">
	{#snippet template()}
		<div class="flex justify-center">
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<Button
							variant="outline"
							size="icon-sm"
							aria-label="Save changes"
							{...props}
						>
							<SaveIcon />
						</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>
					Save Changes <Kbd>S</Kbd>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	{/snippet}
</Story>

<Story name="Disabled Button">
	{#snippet template()}
		<div class="flex justify-center">
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<span class="inline-block w-fit" {...props}>
							<Button variant="outline" disabled>Disabled</Button>
						</span>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>This feature is currently unavailable</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	{/snippet}
</Story>
