<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Menubar from "$lib/components/ui/menubar/index.js";
	import FileIcon from "@lucide/svelte/icons/file";
	import FolderIcon from "@lucide/svelte/icons/folder";
	import HelpCircleIcon from "@lucide/svelte/icons/help-circle";
	import SaveIcon from "@lucide/svelte/icons/save";
	import SettingsIcon from "@lucide/svelte/icons/settings";
	import TrashIcon from "@lucide/svelte/icons/trash";

	const { Story } = defineMeta({
		title: "UI/Menubar",
		component: Menubar.Root,
		tags: ["autodocs"],
	});
</script>

<script>
	let checkboxBookmarks = $state(false);
	let checkboxFullUrls = $state(true);
	let checkboxStrikethrough = $state(true);
	let checkboxCode = $state(false);
	let checkboxSuperscript = $state(false);

	let radioProfile = $state("benoit");
	let radioTheme = $state("system");
</script>

<Story name="Checkbox">
	{#snippet template()}
		<Menubar.Root class="w-72">
			<Menubar.Menu>
				<Menubar.Trigger>View</Menubar.Trigger>
				<Menubar.Content class="w-64">
					<Menubar.CheckboxItem bind:checked={checkboxBookmarks}>
						Always Show Bookmarks Bar
					</Menubar.CheckboxItem>
					<Menubar.CheckboxItem bind:checked={checkboxFullUrls}>
						Always Show Full URLs
					</Menubar.CheckboxItem>
					<Menubar.Separator />
					<Menubar.Item inset>
						Reload <Menubar.Shortcut>⌘R</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item disabled inset>
						Force Reload <Menubar.Shortcut>⇧⌘R</Menubar.Shortcut>
					</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
			<Menubar.Menu>
				<Menubar.Trigger>Format</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.CheckboxItem bind:checked={checkboxStrikethrough}>Strikethrough</Menubar.CheckboxItem>
					<Menubar.CheckboxItem bind:checked={checkboxCode}>Code</Menubar.CheckboxItem>
					<Menubar.CheckboxItem bind:checked={checkboxSuperscript}>Superscript</Menubar.CheckboxItem>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
	{/snippet}
</Story>

<Story name="Radio">
	{#snippet template()}
		<Menubar.Root class="w-72">
			<Menubar.Menu>
				<Menubar.Trigger>Profiles</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.RadioGroup bind:value={radioProfile}>
						<Menubar.RadioItem value="andy">Andy</Menubar.RadioItem>
						<Menubar.RadioItem value="benoit">Benoit</Menubar.RadioItem>
						<Menubar.RadioItem value="luis">Luis</Menubar.RadioItem>
					</Menubar.RadioGroup>
					<Menubar.Separator />
					<Menubar.Item inset>Edit...</Menubar.Item>
					<Menubar.Item inset>Add Profile...</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
			<Menubar.Menu>
				<Menubar.Trigger>Theme</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.RadioGroup bind:value={radioTheme}>
						<Menubar.RadioItem value="light">Light</Menubar.RadioItem>
						<Menubar.RadioItem value="dark">Dark</Menubar.RadioItem>
						<Menubar.RadioItem value="system">System</Menubar.RadioItem>
					</Menubar.RadioGroup>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
	{/snippet}
</Story>

<Story name="Submenu">
	{#snippet template()}
		<Menubar.Root class="w-72">
			<Menubar.Menu>
				<Menubar.Trigger>File</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Sub>
						<Menubar.SubTrigger>Share</Menubar.SubTrigger>
						<Menubar.SubContent>
							<Menubar.Item>Email link</Menubar.Item>
							<Menubar.Item>Messages</Menubar.Item>
							<Menubar.Item>Notes</Menubar.Item>
						</Menubar.SubContent>
					</Menubar.Sub>
					<Menubar.Separator />
					<Menubar.Item>
						Print... <Menubar.Shortcut>⌘P</Menubar.Shortcut>
					</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
			<Menubar.Menu>
				<Menubar.Trigger>Edit</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item>
						Undo <Menubar.Shortcut>⌘Z</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item>
						Redo <Menubar.Shortcut>⇧⌘Z</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Sub>
						<Menubar.SubTrigger>Find</Menubar.SubTrigger>
						<Menubar.SubContent>
							<Menubar.Item>Find...</Menubar.Item>
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
		<Menubar.Root class="w-72">
			<Menubar.Menu>
				<Menubar.Trigger>File</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item>
						<FileIcon />
						New File <Menubar.Shortcut>⌘N</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item>
						<FolderIcon />
						Open Folder
					</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Item>
						<SaveIcon />
						Save <Menubar.Shortcut>⌘S</Menubar.Shortcut>
					</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
			<Menubar.Menu>
				<Menubar.Trigger>More</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item>
						<SettingsIcon />
						Settings
					</Menubar.Item>
					<Menubar.Item>
						<HelpCircleIcon />
						Help
					</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Item variant="destructive">
						<TrashIcon />
						Delete
					</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
	{/snippet}
</Story>
