<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Progress } from "$lib/components/ui/progress/index.js";
	import { Slider } from "$lib/components/ui/slider/index.js";

	const { Story } = defineMeta({
		title: "UI/Progress",
		component: Progress,
		tags: ["autodocs"],
	});
</script>

<script>
	let controlledValue = $state(66);
</script>

<Story name="Label">
	{#snippet template()}
		<div class="flex w-full max-w-sm flex-col gap-2">
			<div class="flex justify-between text-sm">
				<span>Upload progress</span>
				<span>66%</span>
			</div>
			<Progress value={66} class="w-full" />
		</div>
	{/snippet}
</Story>

<Story name="Controlled">
	{#snippet template()}
		<div class="flex w-full max-w-sm flex-col gap-4">
			<div class="flex justify-between text-sm">
				<span>Progress</span>
				<span>{controlledValue}%</span>
			</div>
			<Progress value={controlledValue} class="w-full" />
			<Slider
				min={0}
				max={100}
				step={1}
				value={[controlledValue]}
				onValueChange={(v) => (controlledValue = v[0])}
			/>
		</div>
	{/snippet}
</Story>
