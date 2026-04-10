<script module lang="ts">
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


<Story name="Description">
	{#snippet template()}
		<Field.Field orientation="horizontal" class="max-w-sm">
			<Field.Content>
				<Field.Label id="switch-focus-mode-label" htmlFor="switch-focus-mode">
					Share across devices
				</Field.Label>
				<Field.Description>
					Focus is shared across devices, and turns off when you leave the app.
				</Field.Description>
			</Field.Content>
			<Switch
				id="switch-focus-mode"
				aria-labelledby="switch-focus-mode-label"
			/>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Choice Card">
	{#snippet template()}
		<Field.Group class="w-full max-w-sm">
			<Field.Label htmlFor="switch-share">
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Title id="switch-share-title">
							Share across devices
						</Field.Title>
						<Field.Description>
							Focus is shared across devices, and turns off when you leave the
							app.
						</Field.Description>
					</Field.Content>
					<Switch id="switch-share" aria-labelledby="switch-share-title" />
				</Field.Field>
			</Field.Label>
			<Field.Label htmlFor="switch-notifications">
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Title id="switch-notifications-title">
							Enable notifications
						</Field.Title>
						<Field.Description>
							Receive notifications when focus mode is enabled or disabled.
						</Field.Description>
					</Field.Content>
					<Switch
						id="switch-notifications"
						checked
						aria-labelledby="switch-notifications-title"
					/>
				</Field.Field>
			</Field.Label>
		</Field.Group>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<Field.Field orientation="horizontal" data-disabled class="w-fit">
			<Switch
				id="switch-disabled-unchecked"
				disabled
				aria-labelledby="switch-disabled-label"
			/>
			<Field.Label
				id="switch-disabled-label"
				htmlFor="switch-disabled-unchecked"
			>
				Disabled
			</Field.Label>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Invalid">
	{#snippet template()}
		<Field.Field orientation="horizontal" class="max-w-sm" data-invalid>
			<Field.Content>
				<Field.Label id="switch-terms-label" htmlFor="switch-terms">
					Accept terms and conditions
				</Field.Label>
				<Field.Description>
					You must accept the terms and conditions to continue.
				</Field.Description>
			</Field.Content>
			<Switch
				id="switch-terms"
				aria-invalid
				aria-labelledby="switch-terms-label"
			/>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Size">
	{#snippet template()}
		<Field.Group class="w-full max-w-[10rem]">
			<Field.Field orientation="horizontal">
				<Switch
					id="switch-size-sm"
					size="sm"
					aria-labelledby="switch-size-sm-label"
				/>
				<Field.Label id="switch-size-sm-label" htmlFor="switch-size-sm">
					Small
				</Field.Label>
			</Field.Field>
			<Field.Field orientation="horizontal">
				<Switch
					id="switch-size-default"
					size="default"
					aria-labelledby="switch-size-default-label"
				/>
				<Field.Label
					id="switch-size-default-label"
					htmlFor="switch-size-default"
				>
					Default
				</Field.Label>
			</Field.Field>
		</Field.Group>
	{/snippet}
</Story>
