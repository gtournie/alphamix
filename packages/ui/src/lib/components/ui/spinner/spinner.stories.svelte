<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Spinner } from "$lib/components/ui/spinner/index.js";

	const { Story } = defineMeta({
		title: "UI/Spinner",
		component: Spinner,
		tags: ["autodocs"],
	});
</script>

<Story name="Basic">
	{#snippet template()}
		<Spinner />
	{/snippet}
</Story>

<Story name="Sizes">
	{#snippet template()}
		<div class="flex items-center gap-4">
			<Spinner class="size-3" />
			<Spinner class="size-4" />
			<Spinner class="size-6" />
			<Spinner class="size-8" />
		</div>
	{/snippet}
</Story>
