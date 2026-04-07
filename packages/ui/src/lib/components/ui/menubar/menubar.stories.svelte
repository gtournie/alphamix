<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Menubar from "$lib/components/ui/menubar/index.js";
	import BoldIcon from "@lucide/svelte/icons/bold";
	import ItalicIcon from "@lucide/svelte/icons/italic";
	import UnderlineIcon from "@lucide/svelte/icons/underline";
	import CopyIcon from "@lucide/svelte/icons/copy";
	import ScissorsIcon from "@lucide/svelte/icons/scissors";
	import ClipboardIcon from "@lucide/svelte/icons/clipboard";
	import PrinterIcon from "@lucide/svelte/icons/printer";
	import SaveIcon from "@lucide/svelte/icons/save";

	const { Story } = defineMeta({
		title: "UI/Menubar",
		component: Menubar.Root,
		tags: ["autodocs"],
	});
</script>

<script>
	let checkboxBookmarks = $state(true);
	let checkboxFullUrls = $state(false);

	let radioProfile = $state("andy");
</script>

<Story name="Checkbox">
	{#snippet template()}
		<Menubar.Root>
			<Menubar.Menu>
				<Menubar.Trigger>View</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.CheckboxItem bind:checked={checkboxBookmarks}>
						Always Show Bookmarks Bar
					</Menubar.CheckboxItem>
					<Menubar.CheckboxItem bind:checked={checkboxFullUrls}>
						Always Show Full URLs
					</Menubar.CheckboxItem>
					<Menubar.Separator />
					<Menubar.Item>
						Reload
						<Menubar.Shortcut>⌘R</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item disabled>
						Force Reload
						<Menubar.Shortcut>⇧⌘R</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Item>Toggle Fullscreen</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Item>Hide Sidebar</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
	{/snippet}
</Story>

<Story name="Radio">
	{#snippet template()}
		<Menubar.Root>
			<Menubar.Menu>
				<Menubar.Trigger>Profiles</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.RadioGroup bind:value={radioProfile}>
						<Menubar.RadioItem value="andy">Andy</Menubar.RadioItem>
						<Menubar.RadioItem value="benoit">Benoit</Menubar.RadioItem>
						<Menubar.RadioItem value="luis">Luis</Menubar.RadioItem>
					</Menubar.RadioGroup>
					<Menubar.Separator />
					<Menubar.Item>Edit…</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Item>Add Profile…</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
	{/snippet}
</Story>

<Story name="Submenu">
	{#snippet template()}
		<Menubar.Root>
			<Menubar.Menu>
				<Menubar.Trigger>File</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item>
						New Tab
						<Menubar.Shortcut>⌘T</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item>
						New Window
						<Menubar.Shortcut>⌘N</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item disabled>New Incognito Window</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Sub>
						<Menubar.SubTrigger>Share</Menubar.SubTrigger>
						<Menubar.SubContent>
							<Menubar.Item>Email Link</Menubar.Item>
							<Menubar.Item>Messages</Menubar.Item>
							<Menubar.Item>Notes</Menubar.Item>
						</Menubar.SubContent>
					</Menubar.Sub>
					<Menubar.Separator />
					<Menubar.Item>
						Print…
						<Menubar.Shortcut>⌘P</Menubar.Shortcut>
					</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
			<Menubar.Menu>
				<Menubar.Trigger>Edit</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item>
						Undo
						<Menubar.Shortcut>⌘Z</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item>
						Redo
						<Menubar.Shortcut>⇧⌘Z</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Sub>
						<Menubar.SubTrigger>Find</Menubar.SubTrigger>
						<Menubar.SubContent>
							<Menubar.Item>Search the Web</Menubar.Item>
							<Menubar.Separator />
							<Menubar.Item>Find…</Menubar.Item>
							<Menubar.Item>Find Next</Menubar.Item>
							<Menubar.Item>Find Previous</Menubar.Item>
						</Menubar.SubContent>
					</Menubar.Sub>
					<Menubar.Separator />
					<Menubar.Item>Cut</Menubar.Item>
					<Menubar.Item>Copy</Menubar.Item>
					<Menubar.Item>Paste</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
	{/snippet}
</Story>

<Story name="With Icons">
	{#snippet template()}
		<Menubar.Root>
			<Menubar.Menu>
				<Menubar.Trigger>Format</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item>
						<BoldIcon />
						Bold
						<Menubar.Shortcut>⌘B</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item>
						<ItalicIcon />
						Italic
						<Menubar.Shortcut>⌘I</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item>
						<UnderlineIcon />
						Underline
						<Menubar.Shortcut>⌘U</Menubar.Shortcut>
					</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
			<Menubar.Menu>
				<Menubar.Trigger>Edit</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item>
						<ScissorsIcon />
						Cut
						<Menubar.Shortcut>⌘X</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item>
						<CopyIcon />
						Copy
						<Menubar.Shortcut>⌘C</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item>
						<ClipboardIcon />
						Paste
						<Menubar.Shortcut>⌘V</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Item>
						<SaveIcon />
						Save
						<Menubar.Shortcut>⌘S</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item>
						<PrinterIcon />
						Print
						<Menubar.Shortcut>⌘P</Menubar.Shortcut>
					</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
	{/snippet}
</Story>
