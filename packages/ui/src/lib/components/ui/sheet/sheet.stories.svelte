<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Sheet from "$lib/components/ui/sheet/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";

	const sides = /** @type {const} */ (["top", "right", "bottom", "left"]);

	const { Story } = defineMeta({
		title: "UI/Sheet",
		component: Sheet.Root,
		tags: ["autodocs"],
	});
</script>

<script>
	let sideOpen = $state(/** @type {Record<string, boolean>} */ ({}));
</script>

<Story name="Side">
	{#snippet template()}
		<div class="flex flex-wrap gap-2">
			{#each sides as side}
				<Sheet.Root bind:open={sideOpen[side]}>
					<Sheet.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" {...props}>{side}</Button>
						{/snippet}
					</Sheet.Trigger>
					<Sheet.Content
						{side}
						class="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
					>
						<Sheet.Header>
							<Sheet.Title>Edit Profile</Sheet.Title>
							<Sheet.Description>
								Make changes to your profile here. Click save when you're done.
							</Sheet.Description>
						</Sheet.Header>
						<div class="no-scrollbar overflow-y-auto px-4 py-4">
							<Field.Group>
								<Field.Field>
									<Field.Label for="sheet-name-{side}">Name</Field.Label>
									<Input id="sheet-name-{side}" placeholder="Pedro Duarte" />
								</Field.Field>
								<Field.Field>
									<Field.Label for="sheet-username-{side}">Username</Field.Label>
									<Input id="sheet-username-{side}" placeholder="@peduarte" />
								</Field.Field>
							</Field.Group>
						</div>
						<Sheet.Footer>
							<Button>Save changes</Button>
							<Sheet.Close>
								{#snippet child({ props })}
									<Button variant="outline" {...props}>Cancel</Button>
								{/snippet}
							</Sheet.Close>
						</Sheet.Footer>
					</Sheet.Content>
				</Sheet.Root>
			{/each}
		</div>
	{/snippet}
</Story>

<Story name="No Close Button">
	{#snippet template()}
		<Sheet.Root>
			<Sheet.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Open Sheet</Button>
				{/snippet}
			</Sheet.Trigger>
			<Sheet.Content side="right" showCloseButton={false}>
				<Sheet.Header>
					<Sheet.Title>Confirm Action</Sheet.Title>
					<Sheet.Description>
						Please confirm your choice before closing.
					</Sheet.Description>
				</Sheet.Header>
				<Sheet.Footer>
					<Button>Confirm</Button>
					<Sheet.Close>
						{#snippet child({ props })}
							<Button variant="outline" {...props}>Cancel</Button>
						{/snippet}
					</Sheet.Close>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>
	{/snippet}
</Story>
