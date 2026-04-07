<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import * as Field from "$lib/components/ui/field/index.js";

	const { Story } = defineMeta({
		title: "UI/Textarea",
		component: Textarea,
		tags: ["autodocs"],
	});
</script>

<Story name="Basic">
	{#snippet template()}
		<Textarea placeholder="Type your message here." />
	{/snippet}
</Story>

<Story name="Invalid">
	{#snippet template()}
		<Textarea placeholder="Type your message here." aria-invalid="true" />
	{/snippet}
</Story>

<Story name="With Label">
	{#snippet template()}
		<Field.Field>
			<Field.Label for="textarea-message">Message</Field.Label>
			<Textarea id="textarea-message" placeholder="Type your message here." rows={6} />
		</Field.Field>
	{/snippet}
</Story>

<Story name="With Description">
	{#snippet template()}
		<Field.Field>
			<Field.Label for="textarea-message-2">Message</Field.Label>
			<Textarea id="textarea-message-2" placeholder="Type your message here." rows={6} />
			<Field.Description>Type your message and press enter to send.</Field.Description>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<Field.Field>
			<Field.Label for="textarea-disabled">Message</Field.Label>
			<Textarea id="textarea-disabled" placeholder="Type your message here." disabled />
		</Field.Field>
	{/snippet}
</Story>
