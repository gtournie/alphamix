<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import * as Field from "$lib/components/ui/field/index.js";

	const { Story } = defineMeta({
		title: "UI/Label",
		component: Label,
		tags: ["autodocs"],
	});
</script>

<Story name="With Checkbox">
	{#snippet template()}
		<Field.Field orientation="horizontal">
			<Checkbox id="label-demo-terms" />
			<Label for="label-demo-terms">Accept terms and conditions</Label>
		</Field.Field>
	{/snippet}
</Story>

<Story name="With Input">
	{#snippet template()}
		<Field.Field>
			<Label for="label-demo-username">Username</Label>
			<Input id="label-demo-username" placeholder="Username" />
		</Field.Field>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<Field.Field data-disabled>
			<Label for="label-demo-disabled">Disabled</Label>
			<Input id="label-demo-disabled" placeholder="Disabled" disabled />
		</Field.Field>
	{/snippet}
</Story>

<Story name="With Textarea">
	{#snippet template()}
		<Field.Field>
			<Label for="label-demo-message">Message</Label>
			<Textarea id="label-demo-message" placeholder="Message" />
		</Field.Field>
	{/snippet}
</Story>
