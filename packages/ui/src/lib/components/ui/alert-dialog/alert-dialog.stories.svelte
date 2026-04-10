<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import {
		Root as AlertDialogRoot,
		Media as AlertDialogMedia,
	} from "$lib/components/ui/alert-dialog/index.js";
	import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
	import { Button } from "../button";

	const { Story } = defineMeta({
		title: "UI/AlertDialog",
		component: AlertDialogRoot,
		tags: ["autodocs"],
		argTypes: {
			size: { control: "select", options: ["default", "sm"] },
		} as Record<string, any>,
	});
</script>

<Story name="Basic" args={{ size: "default" } as Record<string, any>}>
	{#snippet template(args: Record<string, any>)}
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Show Dialog</Button>
				{/snippet}
			</AlertDialog.Trigger>
			<AlertDialog.Content size={args.size}>
				<AlertDialog.Header>
					<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
					<AlertDialog.Description>
						This action cannot be undone. This will permanently delete your
						account from our servers.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action>Continue</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	{/snippet}
</Story>

<Story name="Small">
	{#snippet template()}
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Show Dialog</Button>
				{/snippet}
			</AlertDialog.Trigger>
			<AlertDialog.Content size="sm">
				<AlertDialog.Header>
					<AlertDialog.Title>Allow accessory to connect?</AlertDialog.Title>
					<AlertDialog.Description>
						Do you want to allow the USB accessory to connect to this device?
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Don't allow</AlertDialog.Cancel>
					<AlertDialog.Action>Allow</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	{/snippet}
</Story>

<Story name="Media">
	{#snippet template()}
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Share Project</Button>
				{/snippet}
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialogMedia>
						<AlertCircleIcon />
					</AlertDialogMedia>
					<AlertDialog.Title>Share this project?</AlertDialog.Title>
					<AlertDialog.Description>
						Anyone with the link will be able to view and edit this project.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action>Share</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	{/snippet}
</Story>

<Story name="Small with Media">
	{#snippet template()}
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Show Dialog</Button>
				{/snippet}
			</AlertDialog.Trigger>
			<AlertDialog.Content size="sm">
				<AlertDialog.Header>
					<AlertDialogMedia>
						<AlertCircleIcon />
					</AlertDialogMedia>
					<AlertDialog.Title>Allow accessory to connect?</AlertDialog.Title>
					<AlertDialog.Description>
						Do you want to allow the USB accessory to connect to this device?
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Don't allow</AlertDialog.Cancel>
					<AlertDialog.Action>Allow</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	{/snippet}
</Story>

<Story name="Destructive">
	{#snippet template()}
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				{#snippet child({ props })}
					<Button variant="destructive" {...props}>Delete Chat</Button>
				{/snippet}
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Delete chat?</AlertDialog.Title>
					<AlertDialog.Description>
						This will permanently delete this chat conversation. View{" "}
						<a href="#fake">Settings</a> delete any memories saved during this chat.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel variant="outline">Cancel</AlertDialog.Cancel>
					<AlertDialog.Action variant="destructive">Delete</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	{/snippet}
</Story>
