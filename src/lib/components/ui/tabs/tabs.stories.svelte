<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import AppWindowIcon from "@lucide/svelte/icons/app-window";
	import CodeIcon from "@lucide/svelte/icons/code";

	const { Story } = defineMeta({
		title: "UI/Tabs",
		component: Tabs.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Line">
	{#snippet template()}
		<Tabs.Root defaultValue="overview">
			<Tabs.List variant="line">
				<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
				<Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
				<Tabs.Trigger value="reports">Reports</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	{/snippet}
</Story>

<Story name="Vertical">
	{#snippet template()}
		<Tabs.Root defaultValue="account" orientation="vertical">
			<Tabs.List>
				<Tabs.Trigger value="account">Account</Tabs.Trigger>
				<Tabs.Trigger value="password">Password</Tabs.Trigger>
				<Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<Tabs.Root defaultValue="home">
			<Tabs.List>
				<Tabs.Trigger value="home">Home</Tabs.Trigger>
				<Tabs.Trigger value="settings" disabled>Disabled</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	{/snippet}
</Story>

<Story name="Icons">
	{#snippet template()}
		<Tabs.Root defaultValue="preview">
			<Tabs.List>
				<Tabs.Trigger value="preview">
					<AppWindowIcon />
					Preview
				</Tabs.Trigger>
				<Tabs.Trigger value="code">
					<CodeIcon />
					Code
				</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	{/snippet}
</Story>
