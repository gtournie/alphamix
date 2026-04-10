<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
	import CopyIcon from "@lucide/svelte/icons/copy";
	import ScissorsIcon from "@lucide/svelte/icons/scissors";
	import ClipboardPasteIcon from "@lucide/svelte/icons/clipboard-paste";
	import TrashIcon from "@lucide/svelte/icons/trash";
	import PencilIcon from "@lucide/svelte/icons/pencil";
	import ShareIcon from "@lucide/svelte/icons/share";

	const { Story } = defineMeta({
		title: "UI/ContextMenu",
		component: ContextMenu.Root,
		tags: ["autodocs"],
	});
</script>

<script>
	let checkboxesBookmarks = $state(true);
	let checkboxesFullUrls = $state(false);
	let checkboxesDevTools = $state(true);

	let radioUser = $state("pedro");
	let radioTheme = $state("light");
</script>

<Story name="Basic">
	{#snippet template()}
		<ContextMenu.Root>
			<ContextMenu.Trigger
				class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
			>
				Right click here
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Item>
					Back
					<ContextMenu.Shortcut>⌘[</ContextMenu.Shortcut>
				</ContextMenu.Item>
				<ContextMenu.Item disabled>
					Forward
					<ContextMenu.Shortcut>⌘]</ContextMenu.Shortcut>
				</ContextMenu.Item>
				<ContextMenu.Item>
					Reload
					<ContextMenu.Shortcut>⌘R</ContextMenu.Shortcut>
				</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>
	{/snippet}
</Story>

<Story name="Submenu">
	{#snippet template()}
		<ContextMenu.Root>
			<ContextMenu.Trigger
				class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
			>
				Right click here
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Group>
					<ContextMenu.Item>
						Copy
						<ContextMenu.Shortcut>⌘C</ContextMenu.Shortcut>
					</ContextMenu.Item>
					<ContextMenu.Item>
						Cut
						<ContextMenu.Shortcut>⌘X</ContextMenu.Shortcut>
					</ContextMenu.Item>
				</ContextMenu.Group>
				<ContextMenu.Sub>
					<ContextMenu.SubTrigger>More Tools</ContextMenu.SubTrigger>
					<ContextMenu.SubContent>
						<ContextMenu.Group>
							<ContextMenu.Item>Save Page...</ContextMenu.Item>
							<ContextMenu.Item>Create Shortcut...</ContextMenu.Item>
							<ContextMenu.Item>Name Window...</ContextMenu.Item>
						</ContextMenu.Group>
						<ContextMenu.Separator />
						<ContextMenu.Group>
							<ContextMenu.Item>Developer Tools</ContextMenu.Item>
						</ContextMenu.Group>
						<ContextMenu.Separator />
						<ContextMenu.Group>
							<ContextMenu.Item variant="destructive">Delete</ContextMenu.Item>
						</ContextMenu.Group>
					</ContextMenu.SubContent>
				</ContextMenu.Sub>
			</ContextMenu.Content>
		</ContextMenu.Root>
	{/snippet}
</Story>

<Story name="Shortcuts">
	{#snippet template()}
		<ContextMenu.Root>
			<ContextMenu.Trigger
				class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
			>
				Right click here
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Group>
					<ContextMenu.Item>
						Back
						<ContextMenu.Shortcut>⌘[</ContextMenu.Shortcut>
					</ContextMenu.Item>
					<ContextMenu.Item disabled>
						Forward
						<ContextMenu.Shortcut>⌘]</ContextMenu.Shortcut>
					</ContextMenu.Item>
					<ContextMenu.Item>
						Reload
						<ContextMenu.Shortcut>⌘R</ContextMenu.Shortcut>
					</ContextMenu.Item>
				</ContextMenu.Group>
				<ContextMenu.Separator />
				<ContextMenu.Group>
					<ContextMenu.Item>
						Save
						<ContextMenu.Shortcut>⌘S</ContextMenu.Shortcut>
					</ContextMenu.Item>
					<ContextMenu.Item>
						Save As...
						<ContextMenu.Shortcut>⇧⌘S</ContextMenu.Shortcut>
					</ContextMenu.Item>
				</ContextMenu.Group>
			</ContextMenu.Content>
		</ContextMenu.Root>
	{/snippet}
</Story>

<Story name="Groups">
	{#snippet template()}
		<ContextMenu.Root>
			<ContextMenu.Trigger
				class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
			>
				Right click here
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Group>
					<ContextMenu.Label>File</ContextMenu.Label>
					<ContextMenu.Item>
						New File
						<ContextMenu.Shortcut>⌘N</ContextMenu.Shortcut>
					</ContextMenu.Item>
					<ContextMenu.Item>
						Open File
						<ContextMenu.Shortcut>⌘O</ContextMenu.Shortcut>
					</ContextMenu.Item>
					<ContextMenu.Item>
						Save
						<ContextMenu.Shortcut>⌘S</ContextMenu.Shortcut>
					</ContextMenu.Item>
				</ContextMenu.Group>
				<ContextMenu.Separator />
				<ContextMenu.Group>
					<ContextMenu.Label>Edit</ContextMenu.Label>
					<ContextMenu.Item>
						Undo
						<ContextMenu.Shortcut>⌘Z</ContextMenu.Shortcut>
					</ContextMenu.Item>
					<ContextMenu.Item>
						Redo
						<ContextMenu.Shortcut>⇧⌘Z</ContextMenu.Shortcut>
					</ContextMenu.Item>
				</ContextMenu.Group>
				<ContextMenu.Separator />
				<ContextMenu.Group>
					<ContextMenu.Item>
						Cut
						<ContextMenu.Shortcut>⌘X</ContextMenu.Shortcut>
					</ContextMenu.Item>
					<ContextMenu.Item>
						Copy
						<ContextMenu.Shortcut>⌘C</ContextMenu.Shortcut>
					</ContextMenu.Item>
					<ContextMenu.Item>
						Paste
						<ContextMenu.Shortcut>⌘V</ContextMenu.Shortcut>
					</ContextMenu.Item>
				</ContextMenu.Group>
				<ContextMenu.Separator />
				<ContextMenu.Group>
					<ContextMenu.Item variant="destructive">
						Delete
						<ContextMenu.Shortcut>⌫</ContextMenu.Shortcut>
					</ContextMenu.Item>
				</ContextMenu.Group>
			</ContextMenu.Content>
		</ContextMenu.Root>
	{/snippet}
</Story>

<Story name="Icons">
	{#snippet template()}
		<ContextMenu.Root>
			<ContextMenu.Trigger
				class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
			>
				Right click here
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Group>
					<ContextMenu.Item>
						<CopyIcon />
						Copy
					</ContextMenu.Item>
					<ContextMenu.Item>
						<ScissorsIcon />
						Cut
					</ContextMenu.Item>
					<ContextMenu.Item>
						<ClipboardPasteIcon />
						Paste
					</ContextMenu.Item>
				</ContextMenu.Group>
				<ContextMenu.Separator />
				<ContextMenu.Group>
					<ContextMenu.Item variant="destructive">
						<TrashIcon />
						Delete
					</ContextMenu.Item>
				</ContextMenu.Group>
			</ContextMenu.Content>
		</ContextMenu.Root>
	{/snippet}
</Story>

<Story name="Checkboxes">
	{#snippet template()}
		<ContextMenu.Root>
			<ContextMenu.Trigger
				class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
			>
				Right click here
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Group>
					<ContextMenu.CheckboxItem bind:checked={checkboxesBookmarks}>
						Show Bookmarks Bar
					</ContextMenu.CheckboxItem>
					<ContextMenu.CheckboxItem bind:checked={checkboxesFullUrls}>
						Show Full URLs
					</ContextMenu.CheckboxItem>
					<ContextMenu.CheckboxItem bind:checked={checkboxesDevTools}>
						Show Developer Tools
					</ContextMenu.CheckboxItem>
				</ContextMenu.Group>
			</ContextMenu.Content>
		</ContextMenu.Root>
	{/snippet}
</Story>

<Story name="Radio">
	{#snippet template()}
		<ContextMenu.Root>
			<ContextMenu.Trigger
				class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
			>
				Right click here
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Group>
					<ContextMenu.Label>People</ContextMenu.Label>
					<ContextMenu.RadioGroup bind:value={radioUser}>
						<ContextMenu.RadioItem value="pedro">Pedro Duarte</ContextMenu.RadioItem>
						<ContextMenu.RadioItem value="colm">Colm Tuite</ContextMenu.RadioItem>
					</ContextMenu.RadioGroup>
				</ContextMenu.Group>
				<ContextMenu.Separator />
				<ContextMenu.Group>
					<ContextMenu.Label>Theme</ContextMenu.Label>
					<ContextMenu.RadioGroup bind:value={radioTheme}>
						<ContextMenu.RadioItem value="light">Light</ContextMenu.RadioItem>
						<ContextMenu.RadioItem value="dark">Dark</ContextMenu.RadioItem>
						<ContextMenu.RadioItem value="system">System</ContextMenu.RadioItem>
					</ContextMenu.RadioGroup>
				</ContextMenu.Group>
			</ContextMenu.Content>
		</ContextMenu.Root>
	{/snippet}
</Story>

<Story name="Destructive">
	{#snippet template()}
		<ContextMenu.Root>
			<ContextMenu.Trigger
				class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
			>
				Right click here
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Group>
					<ContextMenu.Item>
						<PencilIcon />
						Edit
					</ContextMenu.Item>
					<ContextMenu.Item>
						<ShareIcon />
						Share
					</ContextMenu.Item>
				</ContextMenu.Group>
				<ContextMenu.Separator />
				<ContextMenu.Group>
					<ContextMenu.Item variant="destructive">
						<TrashIcon />
						Delete
					</ContextMenu.Item>
				</ContextMenu.Group>
			</ContextMenu.Content>
		</ContextMenu.Root>
	{/snippet}
</Story>
