<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Alert from "$lib/components/ui/alert/index.js";
	import * as Button from "$lib/components/ui/button/index.js";
	import CheckCircle2Icon from "@lucide/svelte/icons/circle-check";
	import AlertCircleIcon from "@lucide/svelte/icons/circle-alert";

	const { Story } = defineMeta({
		title: "UI/Alert",
		component: Alert.Root,
		tags: ["autodocs"],
		argTypes: {
			variant: {
				control: "select",
				options: ["default", "destructive"],
			},
			role: {
				control: "select",
				options: ["alert", "status"],
				description:
					'ARIA live region role. Defaults to "status" for non-urgent messages, "alert" for destructive.',
			},
		},
	});
</script>

<Story name="Basic" args={{ variant: "default" }}>
	{#snippet template(args)}
		<div class="w-125">
			<Alert.Root {...args}>
				<CheckCircle2Icon />
				<Alert.Title>Account updated successfully</Alert.Title>
				<Alert.Description>
					Your profile information has been saved. Changes will be reflected
					immediately.
				</Alert.Description>
			</Alert.Root>
		</div>
	{/snippet}
</Story>

<Story name="Destructive" args={{ variant: "destructive" }}>
	{#snippet template(args)}
		<div class="w-125">
			<Alert.Root {...args}>
				<AlertCircleIcon />
				<Alert.Title>Payment failed</Alert.Title>
				<Alert.Description>
					Your payment could not be processed. Please check your payment method
					and try again.
				</Alert.Description>
			</Alert.Root>
		</div>
	{/snippet}
</Story>

<Story name="Action" args={{ variant: "default" }}>
	{#snippet template(args)}
		<div class="w-125">
			<Alert.Root {...args}>
				<Alert.Title>Dark mode is now available</Alert.Title>
				<Alert.Description>
					Enable it under your profile settings to get started.
				</Alert.Description>
				<Alert.Action>
					<Button.Root variant="outline">Enable</Button.Root>
				</Alert.Action>
			</Alert.Root>
		</div>
	{/snippet}
</Story>

<Story name="Custom Color" args={{ variant: "default" }}>
	{#snippet template(args)}
		<div class="w-125">
			<Alert.Root
				class=" border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50"
				{...args}
			>
				<AlertCircleIcon />
				<Alert.Title>Your subscription will expire in 3 days.</Alert.Title>
				<Alert.Description>
					Renew now to avoid service interruption or upgrade to a paid plan to
					continue using the service.
				</Alert.Description>
			</Alert.Root>
		</div>
	{/snippet}
</Story>
