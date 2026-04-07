<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Plus } from "@lucide/svelte";
	import * as Avatar from "$lib/components/ui/avatar/index.js";

	const { Story } = defineMeta({
		title: "UI/Avatar",
		component: Avatar.Root,
		tags: ["autodocs"],
		argTypes: {
			size: {
				control: "select",
				options: ["default", "sm", "lg"],
				description: "Avatar size",
				table: {
					defaultValue: { summary: "default" },
				},
			},
			loadingStatus: {
				control: false,
				description:
					"Bindable loading status of the image (managed automatically by bits-ui).",
			},
			class: {
				control: "text",
				description:
					"Additional Tailwind classes merged onto the root element.",
			},
		},
		args: { size: "default" },
	});
</script>

<Story
	name="Basic"
	parameters={{
		docs: {
			description: {
				story: "A basic avatar component with an image and a fallback.",
			},
		},
	}}
>
	{#snippet template(args)}
		<Avatar.Root {...args}>
			<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
	{/snippet}
</Story>

<Story
	name="Badge"
	parameters={{
		controls: { disable: true },
		docs: {
			description: {
				story:
					"Use the `AvatarBadge` component to add a badge to the avatar. The badge is positioned at the bottom right of the avatar. This example overrides the default `bg-primary` with a custom status color via the `class` prop.",
			},
		},
	}}
>
	{#snippet template()}
		<Avatar.Root>
			<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
			<Avatar.Fallback>CN</Avatar.Fallback>
			<Avatar.Badge class="bg-green-600 dark:bg-green-800" />
		</Avatar.Root>
	{/snippet}
</Story>

<Story
	name="Badge with Icon"
	parameters={{
		controls: { disable: true },
		docs: {
			description: {
				story:
					'You can also use an icon inside `<AvatarBadge>`. The avatar must use `size="lg"` for the icon to be visible; the badge suppresses SVG children at smaller sizes.',
			},
		},
	}}
>
	{#snippet template()}
		<Avatar.Root>
			<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
			<Avatar.Fallback>CN</Avatar.Fallback>
			<Avatar.Badge aria-label="Add">
				<Plus aria-hidden="true" />
			</Avatar.Badge>
		</Avatar.Root>
	{/snippet}
</Story>

<Story
	name="Avatar Group"
	parameters={{
		controls: { disable: true },
		docs: {
			description: {
				story: "Use the `AvatarGroup` component to add a group of avatars.",
			},
		},
	}}
>
	{#snippet template()}
		<Avatar.Group>
			<Avatar.Root>
				<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
				<Avatar.Fallback>CN</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Image src="https://github.com/leerob.png" alt="@leerob" />
				<Avatar.Fallback>LR</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Image
					src="https://github.com/evilrabbit.png"
					alt="@evilrabbit"
				/>
				<Avatar.Fallback>ER</Avatar.Fallback>
			</Avatar.Root>
		</Avatar.Group>
	{/snippet}
</Story>

<Story
	name="Avatar Group Count"
	parameters={{
		controls: { disable: true },
		docs: {
			description: {
				story: "Use `<AvatarGroupCount>` to add a count to the group.",
			},
		},
	}}
>
	{#snippet template()}
		<Avatar.Group>
			<Avatar.Root>
				<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
				<Avatar.Fallback>CN</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Image src="https://github.com/leerob.png" alt="@leerob" />
				<Avatar.Fallback>LR</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Image
					src="https://github.com/evilrabbit.png"
					alt="@evilrabbit"
				/>
				<Avatar.Fallback>ER</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.GroupCount>+3</Avatar.GroupCount>
		</Avatar.Group>
	{/snippet}
</Story>

<Story
	name="Avatar Group Count with Icon"
	parameters={{
		controls: { disable: true },
		docs: {
			description: {
				story: "You can also use an icon inside `<AvatarGroupCount>`.",
			},
		},
	}}
>
	{#snippet template()}
		<Avatar.Group>
			<Avatar.Root>
				<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
				<Avatar.Fallback>CN</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Image src="https://github.com/leerob.png" alt="@leerob" />
				<Avatar.Fallback>LR</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Image
					src="https://github.com/evilrabbit.png"
					alt="@evilrabbit"
				/>
				<Avatar.Fallback>ER</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.GroupCount aria-label="Add members">
				<Plus aria-hidden="true" />
			</Avatar.GroupCount>
		</Avatar.Group>
	{/snippet}
</Story>

<Story
	name="Sizes"
	parameters={{
		controls: { disable: true },
		docs: {
			description: {
				story: "Use the `size` prop to change the size of the avatar.",
			},
		},
	}}
>
	{#snippet template()}
		<div class="flex items-center gap-4">
			<Avatar.Root size="sm">
				<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
				<Avatar.Fallback>CN</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root size="default">
				<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
				<Avatar.Fallback>CN</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root size="lg">
				<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
				<Avatar.Fallback>CN</Avatar.Fallback>
			</Avatar.Root>
		</div>
	{/snippet}
</Story>
