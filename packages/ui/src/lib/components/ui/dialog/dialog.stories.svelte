<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";

	const { Story } = defineMeta({
		title: "UI/Dialog",
		component: Dialog.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Custom Close Button">
	{#snippet template()}
		<Dialog.Root>
			<Dialog.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Share</Button>
				{/snippet}
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-md">
				<Dialog.Header>
					<Dialog.Title>Share link</Dialog.Title>
					<Dialog.Description>
						Anyone who has this link will be able to view this.
					</Dialog.Description>
				</Dialog.Header>
				<div class="flex items-center gap-2">
					<div class="grid flex-1 gap-2">
						<Label for="link" class="sr-only">Link</Label>
						<Input id="link" value="https://ui.shadcn.com/docs/installation" readonly />
					</div>
				</div>
				<Dialog.Footer class="sm:justify-start">
					<Dialog.Close>
						{#snippet child({ props })}
							<Button type="button" {...props}>Close</Button>
						{/snippet}
					</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	{/snippet}
</Story>

<Story name="No Close Button">
	{#snippet template()}
		<Dialog.Root>
			<Dialog.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>No Close Button</Button>
				{/snippet}
			</Dialog.Trigger>
			<Dialog.Content showCloseButton={false}>
				<Dialog.Header>
					<Dialog.Title>No Close Button</Dialog.Title>
					<Dialog.Description>
						This dialog doesn't have a close button in the top-right corner.
					</Dialog.Description>
				</Dialog.Header>
			</Dialog.Content>
		</Dialog.Root>
	{/snippet}
</Story>

<Story name="Sticky Footer">
	{#snippet template()}
		<Dialog.Root>
			<Dialog.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Sticky Footer</Button>
				{/snippet}
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Sticky Footer</Dialog.Title>
					<Dialog.Description>
						This dialog has a sticky footer that stays visible while the content scrolls.
					</Dialog.Description>
				</Dialog.Header>
				<div class="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
					{#each Array.from({ length: 10 }) as _}
						<p class="mb-4 leading-normal">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
							exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
							dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
							Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
							mollit anim id est laborum.
						</p>
					{/each}
				</div>
				<Dialog.Footer>
					<Dialog.Close>
						{#snippet child({ props })}
							<Button variant="outline" {...props}>Close</Button>
						{/snippet}
					</Dialog.Close>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	{/snippet}
</Story>

<Story name="Scrollable Content">
	{#snippet template()}
		<Dialog.Root>
			<Dialog.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Scrollable Content</Button>
				{/snippet}
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Scrollable Content</Dialog.Title>
					<Dialog.Description>
						This is a dialog with scrollable content.
					</Dialog.Description>
				</Dialog.Header>
				<div class="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
					{#each Array.from({ length: 10 }) as _}
						<p class="mb-4 leading-normal">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
							incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
							exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
							dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
							Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
							mollit anim id est laborum.
						</p>
					{/each}
				</div>
			</Dialog.Content>
		</Dialog.Root>
	{/snippet}
</Story>
