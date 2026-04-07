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
		<div class="flex h-5 items-center gap-4 text-sm">
			<div>Blog</div>
			<Separator orientation="vertical" />
			<div>Docs</div>
			<Separator orientation="vertical" />
			<div>Source</div>
		</div>
	{/snippet}
</Story>

<Story name="Menu">
	{#snippet template()}
		<div class="flex items-center gap-2 text-sm md:gap-4">
			<div class="flex flex-col gap-1">
				<span class="font-medium">Settings</span>
				<span class="text-muted-foreground text-xs">Manage preferences</span>
			</div>
			<Separator orientation="vertical" />
			<div class="flex flex-col gap-1">
				<span class="font-medium">Account</span>
				<span class="text-muted-foreground text-xs">Profile &amp; security</span>
			</div>
			<Separator orientation="vertical" class="hidden md:block" />
			<div class="hidden flex-col gap-1 md:flex">
				<span class="font-medium">Help</span>
				<span class="text-muted-foreground text-xs">Support &amp; docs</span>
			</div>
		</div>
	{/snippet}
</Story>

<Story name="List">
	{#snippet template()}
		<div class="flex w-full max-w-sm flex-col gap-2 text-sm">
			<dl class="flex items-center justify-between">
				<dt>Item 1</dt>
				<dd class="text-muted-foreground">Value 1</dd>
			</dl>
			<Separator />
			<dl class="flex items-center justify-between">
				<dt>Item 2</dt>
				<dd class="text-muted-foreground">Value 2</dd>
			</dl>
			<Separator />
			<dl class="flex items-center justify-between">
				<dt>Item 3</dt>
				<dd class="text-muted-foreground">Value 3</dd>
			</dl>
		</div>
	{/snippet}
</Story>
