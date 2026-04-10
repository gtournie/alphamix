<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { AspectRatio } from "$lib/components/ui/aspect-ratio/index.js";

	const { Story } = defineMeta({
		title: "UI/AspectRatio",
		component: AspectRatio,
		tags: ["autodocs"],
		argTypes: {
			ratio: {
				control: "number",
				description: "Desired aspect ratio (width / height)",
			},
		},
		args: {
			ratio: 16 / 9,
		},
	});
</script>

<Story name="Basic" args={{ ratio: 16 / 9 }}>
	{#snippet template(args)}
		<div class="w-112.5">
			<AspectRatio class="bg-muted rounded-lg" {...args}>
				<img
					src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
					alt="Gray by Drew Beamer"
					class="size-full  rounded-lg object-cover"
				/>
			</AspectRatio>
		</div>
	{/snippet}
</Story>

<Story name="Square" args={{ ratio: 1 }}>
	{#snippet template(args)}
		<div class="w-75">
			<AspectRatio class="bg-muted rounded-lg" {...args}>
				<img
					src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
					alt="Gray by Drew Beamer"
					class="size-full  rounded-lg object-cover"
				/>
			</AspectRatio>
		</div>
	{/snippet}
</Story>

<Story name="Portrait" args={{ ratio: 9 / 16 }}>
	{#snippet template(args)}
		<div class="w-50">
			<AspectRatio class="bg-muted rounded-lg" {...args}>
				<img
					src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
					alt="Gray by Drew Beamer"
					class="size-full  rounded-lg object-cover"
				/>
			</AspectRatio>
		</div>
	{/snippet}
</Story>
