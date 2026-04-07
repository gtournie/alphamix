<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Switch } from "$lib/components/ui/switch/index.js";
	import * as Field from "$lib/components/ui/field/index.js";

	const { Story } = defineMeta({
		title: "UI/Switch",
		component: Switch,
		tags: ["autodocs"],
	});
</script>

<Story name="Description">
	{#snippet template()}
		<Field.Field orientation="horizontal" class="max-w-sm">
			<Field.Content>
				<Field.Label for="switch-focus-mode">Share across devices</Field.Label>
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
		<Field.Group class="w-full max-w-sm">
			<Field.Label for="switch-share">
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Title>Share across devices</Field.Title>
						<Field.Description>
							Focus is shared across devices, and turns off when you leave the app.
						</Field.Description>
					</Field.Content>
					<Switch id="switch-share" />
				</Field.Field>
			</Field.Label>
			<Field.Label for="switch-notifications">
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Title>Enable notifications</Field.Title>
						<Field.Description>
							Receive notifications when focus mode is enabled or disabled.
						</Field.Description>
					</Field.Content>
					<Switch id="switch-notifications" checked />
				</Field.Field>
			</Field.Label>
		</Field.Group>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<Field.Field orientation="horizontal" data-disabled="true" class="w-fit">
			<Switch id="switch-disabled-unchecked" disabled />
			<Field.Label for="switch-disabled-unchecked">Disabled</Field.Label>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Invalid">
	{#snippet template()}
		<Field.Field orientation="horizontal" class="max-w-sm" data-invalid="true">
			<Field.Content>
				<Field.Label for="switch-terms">Accept terms and conditions</Field.Label>
				<Field.Description>
					You must accept the terms and conditions to continue.
				</Field.Description>
			</Field.Content>
			<Switch id="switch-terms" aria-invalid />
		</Field.Field>
	{/snippet}
</Story>

<Story name="Size">
	{#snippet template()}
		<Field.Group class="w-full max-w-[10rem]">
			<Field.Field orientation="horizontal">
				<Switch id="switch-size-sm" size="sm" />
				<Field.Label for="switch-size-sm">Small</Field.Label>
			</Field.Field>
			<Field.Field orientation="horizontal">
				<Switch id="switch-size-default" size="default" />
				<Field.Label for="switch-size-default">Default</Field.Label>
			</Field.Field>
		</Field.Group>
	{/snippet}
</Story>
