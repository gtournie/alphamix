<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Switch } from "$lib/components/ui/switch/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import * as Card from "$lib/components/ui/card/index.js";

	const { Story } = defineMeta({
		title: "UI/Switch",
		component: Switch,
		tags: ["autodocs"],
	});
</script>

<script>
	let choiceChecked = $state(false);
</script>

<Story name="Description">
	{#snippet template()}
		<Field.Field orientation="horizontal">
			<Field.Content>
				<Field.Title>Share across devices</Field.Title>
				<Field.Description>
					Focus is shared across devices, and turns off when you leave the app.
				</Field.Description>
			</Field.Content>
			<Switch id="switch-focus-mode" />
		</Field.Field>
	{/snippet}
</Story>

<Story name="Choice Card">
	{#snippet template()}
		<Card.Root class="w-full max-w-sm">
			<Card.Content>
				<label
					class="flex cursor-pointer items-center justify-between gap-4"
					for="switch-choice"
				>
					<div class="flex flex-col gap-1">
						<span class="text-sm font-medium">Airplane Mode</span>
						<span class="text-muted-foreground text-xs">
							Disable all wireless connections.
						</span>
					</div>
					<Switch id="switch-choice" bind:checked={choiceChecked} />
				</label>
			</Card.Content>
		</Card.Root>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<div class="flex flex-col gap-4">
			<Field.Field orientation="horizontal">
				<Switch id="switch-dis-unchecked" disabled />
				<Field.Label for="switch-dis-unchecked">Disabled (Unchecked)</Field.Label>
			</Field.Field>
			<Field.Field orientation="horizontal">
				<Switch id="switch-dis-checked" checked disabled />
				<Field.Label for="switch-dis-checked">Disabled (Checked)</Field.Label>
			</Field.Field>
		</div>
	{/snippet}
</Story>

<Story name="Invalid">
	{#snippet template()}
		<Field.Field orientation="horizontal" data-invalid="true">
			<Switch id="switch-invalid" aria-invalid="true" />
			<Field.Content>
				<Field.Label for="switch-invalid">Marketing emails</Field.Label>
				<Field.Error>You must accept to continue.</Field.Error>
			</Field.Content>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Size">
	{#snippet template()}
		<div class="flex flex-col gap-4">
			<Field.Field orientation="horizontal">
				<Switch id="switch-sm" size="sm" />
				<Field.Label for="switch-sm">Small</Field.Label>
			</Field.Field>
			<Field.Field orientation="horizontal">
				<Switch id="switch-default" size="default" />
				<Field.Label for="switch-default">Default</Field.Label>
			</Field.Field>
		</div>
	{/snippet}
</Story>
