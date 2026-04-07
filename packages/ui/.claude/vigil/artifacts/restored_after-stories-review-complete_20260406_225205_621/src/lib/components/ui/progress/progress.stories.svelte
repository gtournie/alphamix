<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Progress } from "$lib/components/ui/progress/index.js";
	import { Slider } from "$lib/components/ui/slider/index.js";
	import * as Field from "$lib/components/ui/field/index.js";

	const { Story } = defineMeta({
		title: "UI/Progress",
		component: Progress,
		tags: ["autodocs"],
	});
</script>

<script>
	let sliderValue = $state(50);
</script>

<Story name="Label">
	{#snippet template()}
		<Field.Field class="w-full max-w-sm">
			<Field.Label for="progress-upload">
				<span>Upload progress</span>
				<span class="ml-auto">66%</span>
			</Field.Label>
			<Progress value={66} id="progress-upload" />
		</Field.Field>
	{/snippet}
</Story>

<Story name="Controlled">
	{#snippet template()}
		<div class="flex w-full max-w-sm flex-col gap-4">
			<Progress value={sliderValue} />
			<Slider
				type="single"
				bind:value={sliderValue}
				min={0}
				max={100}
				step={1}
			/>
		</div>
	{/snippet}
</Story>
