<script module lang="ts">
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
				<p class="text-sm font-medium">Settings</p>
				<p class="text-muted-foreground text-xs">Manage Preferences</p>
			</div>
			<Separator orientation="vertical" />
			<div>
				<p class="text-sm font-medium">Account</p>
				<p class="text-muted-foreground text-xs">Profile & security</p>
			</div>
			<Separator orientation="vertical" />
			<div>
				<p class="text-sm font-medium">Help</p>
				<p class="text-muted-foreground text-xs">Support & docs</p>
			</div>
		</div>
	{/snippet}
</Story>

<Story name="List">
	{#snippet template()}
		<dl class="divide-y w-48 text-sm [&>div]:py-1">
			<div class="flex justify-between">
				<dt class="text-muted-foreground">Item 1</dt>
				<dd class="font-medium">Value 1</dd>
			</div>
			<div class="flex justify-between">
				<dt class="text-muted-foreground">Item 2</dt>
				<dd class="font-medium">Value 2</dd>
			</div>
			<div class="flex justify-between">
				<dt class="text-muted-foreground">Item 3</dt>
				<dd class="font-medium">Value 3</dd>
			</div>
		</dl>
	{/snippet}
</Story>
