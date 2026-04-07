<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Separator } from "$lib/components/ui/separator/index.js";

	const { Story } = defineMeta({
		title: "UI/Separator",
		component: Separator,
		tags: ["autodocs"],
	});
</script>

<Story name="Vertical">
	{#snippet template()}
		<div class="flex h-5 items-center space-x-4 text-sm">
			<span>Blog</span>
			<Separator orientation="vertical" />
			<span>Docs</span>
			<Separator orientation="vertical" />
			<span>Source</span>
		</div>
	{/snippet}
</Story>

<Story name="Menu">
	{#snippet template()}
		<div class="flex items-start gap-4">
			<div>
				<p class="text-sm font-medium">Components</p>
				<p class="text-muted-foreground text-xs">Browse all components</p>
			</div>
			<Separator orientation="vertical" class="h-auto self-stretch" />
			<div>
				<p class="text-sm font-medium">Documentation</p>
				<p class="text-muted-foreground text-xs">Read the docs</p>
			</div>
			<Separator orientation="vertical" class="h-auto self-stretch" />
			<div>
				<p class="text-sm font-medium">Blog</p>
				<p class="text-muted-foreground text-xs">Latest updates</p>
			</div>
		</div>
	{/snippet}
</Story>

<Story name="List">
	{#snippet template()}
		<dl class="w-48 space-y-1 text-sm">
			<div class="flex justify-between">
				<dt class="text-muted-foreground">Status</dt>
				<dd class="font-medium">Active</dd>
			</div>
			<Separator />
			<div class="flex justify-between">
				<dt class="text-muted-foreground">Plan</dt>
				<dd class="font-medium">Pro</dd>
			</div>
			<Separator />
			<div class="flex justify-between">
				<dt class="text-muted-foreground">Members</dt>
				<dd class="font-medium">12</dd>
			</div>
			<Separator />
			<div class="flex justify-between">
				<dt class="text-muted-foreground">Created</dt>
				<dd class="font-medium">Jan 2024</dd>
			</div>
		</dl>
	{/snippet}
</Story>
