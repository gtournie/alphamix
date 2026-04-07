<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Resizable from "$lib/components/ui/resizable/index.js";

	const { Story } = defineMeta({
		title: "UI/Resizable",
		component: Resizable.PaneGroup,
		tags: ["autodocs"],
	});
</script>

<Story name="Horizontal">
	{#snippet template()}
		<Resizable.PaneGroup direction="horizontal" class="min-h-48 max-w-md rounded-lg border">
			<Resizable.Pane defaultSize={50}>
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">One</span>
				</div>
			</Resizable.Pane>
			<Resizable.Handle />
			<Resizable.Pane defaultSize={50}>
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">Two</span>
				</div>
			</Resizable.Pane>
		</Resizable.PaneGroup>
	{/snippet}
</Story>

<Story name="Vertical">
	{#snippet template()}
		<Resizable.PaneGroup direction="vertical" class="min-h-48 max-w-md rounded-lg border">
			<Resizable.Pane defaultSize={25}>
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">Header</span>
				</div>
			</Resizable.Pane>
			<Resizable.Handle />
			<Resizable.Pane defaultSize={75}>
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">Content</span>
				</div>
			</Resizable.Pane>
		</Resizable.PaneGroup>
	{/snippet}
</Story>

<Story name="Handle">
	{#snippet template()}
		<Resizable.PaneGroup direction="horizontal" class="min-h-48 max-w-md rounded-lg border">
			<Resizable.Pane defaultSize={50}>
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">Sidebar</span>
				</div>
			</Resizable.Pane>
			<Resizable.Handle withHandle />
			<Resizable.Pane defaultSize={50}>
				<div class="flex h-full items-center justify-center p-6">
					<span class="font-semibold">Content</span>
				</div>
			</Resizable.Pane>
		</Resizable.PaneGroup>
	{/snippet}
</Story>
