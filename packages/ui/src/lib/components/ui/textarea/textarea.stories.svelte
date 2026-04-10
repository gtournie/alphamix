<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import { Button } from "$lib/components/ui/button/index.js";

	const { Story } = defineMeta({
		title: "UI/Textarea",
		component: Textarea,
		tags: ["autodocs"],
	});
</script>

<Story name="Field">
	{#snippet template()}
		<Field.Field>
			<Field.Label for="textarea-message">Message</Field.Label>
			<Field.Description>Enter your message below.</Field.Description>
			<Textarea id="textarea-message" placeholder="Type your message here." />
		</Field.Field>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<Field.Field data-disabled>
			<Field.Label for="textarea-disabled">Message</Field.Label>
			<Textarea id="textarea-disabled" placeholder="Type your message here." disabled />
		</Field.Field>
	{/snippet}
</Story>

<Story name="Invalid">
	{#snippet template()}
		<Field.Field data-invalid>
			<Field.Label for="textarea-invalid">Message</Field.Label>
			<Textarea id="textarea-invalid" placeholder="Type your message here." aria-invalid />
			<Field.Description>Please enter a valid message.</Field.Description>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Button">
	{#snippet template()}
		<div class="grid w-full gap-2">
			<Textarea placeholder="Type your message here." />
			<Button>Send message</Button>
		</div>
	{/snippet}
</Story>
