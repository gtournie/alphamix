<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Progress } from "$lib/components/ui/progress/index.js";
	import { Slider } from "$lib/components/ui/slider/index.js";

	const { Story } = defineMeta({
		title: "UI/Progress",
		component: Progress,
		tags: ["autodocs"],
	});
</script>

<script lang="ts">
	let controlledValue = $state(66);
</script>

<Story name="Label">
	{#snippet template()}
		<div class="flex w-full max-w-sm flex-col gap-2">
			<div class="flex justify-between text-sm">
				<span id="progress-label-upload">Upload progress</span>
				<span>66%</span>
			</div>
			<Progress
				value={66}
				class="w-full"
				aria-labelledby="progress-label-upload"
			/>
		</div>
	{/snippet}
</Story>

<Story name="Controlled">
	{#snippet template()}
		<div class="flex w-full max-w-sm flex-col gap-4">
			<div class="flex justify-between text-sm">
				<span id="progress-label-controlled">Progress</span>
				<span>{controlledValue}%</span>
			</div>
			<Progress
				value={controlledValue}
				class="w-full"
				aria-labelledby="progress-label-controlled"
			/>
			<Slider
				type="single"
				min={0}
				max={100}
				step={1}
				value={controlledValue}
				onValueChange={(v: number) => (controlledValue = v)}
				aria-label="Adjust progress value"
				thumbAriaLabel="Progress value"
			/>
		</div>
	{/snippet}
</Story>
