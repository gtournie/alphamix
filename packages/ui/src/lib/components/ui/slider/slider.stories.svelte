<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Slider } from "$lib/components/ui/slider/index.js";

	const { Story } = defineMeta({
		title: "UI/Slider",
		component: Slider,
		tags: ["autodocs"],
	});
</script>

<script>
	let controlledValue = $state([0.3, 0.7]);
</script>

<Story name="Range">
	{#snippet template()}
		<Slider type="multiple" value={[25, 75]} max={100} step={5} class="w-full max-w-sm" />
	{/snippet}
</Story>

<Story name="Multiple Thumbs">
	{#snippet template()}
		<Slider type="multiple" value={[10, 40, 80]} max={100} step={10} class="w-full max-w-sm" />
	{/snippet}
</Story>

<Story name="Vertical">
	{#snippet template()}
		<div class="flex items-center gap-6">
			<Slider type="single" value={50} max={100} step={1} orientation="vertical" class="h-40" />
			<Slider type="single" value={25} max={100} step={1} orientation="vertical" class="h-40" />
		</div>
	{/snippet}
</Story>

<Story name="Controlled">
	{#snippet template()}
		<div class="grid w-full max-w-sm gap-3">
			<div class="flex items-center justify-between gap-2">
				<label for="slider-temperature" class="text-sm font-medium">Temperature</label>
				<span class="text-muted-foreground text-sm">{controlledValue.join(", ")}</span>
			</div>
			<Slider
				id="slider-temperature"
				type="multiple"
				bind:value={controlledValue}
				min={0}
				max={1}
				step={0.1}
			/>
		</div>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<Slider type="single" value={50} max={100} step={1} disabled class="w-full max-w-sm" />
	{/snippet}
</Story>
