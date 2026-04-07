<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Accordion from "$lib/components/ui/accordion/index.js";

	const { Story } = defineMeta({
		title: "UI/Accordion",
		component: Accordion.Root,
		tags: ["autodocs"],
		argTypes: {
			type: { control: "select", options: ["single", "multiple"] },
			value: {
				control: "text",
				description:
					"Pre-open item value (single mode only). Must match an item's `value` prop exactly.",
				if: { arg: "type", eq: "single" },
			},
			orientation: { control: "select", options: ["vertical", "horizontal"] },
			disabled: { control: "boolean" },
			loop: { control: "boolean" },
		},
		args: {
			type: "single",
			orientation: "vertical",
			disabled: false,
			loop: false,
		},
	});
</script>

<Story name="Basic" args={{ value: "item-1" }}>
	{#snippet template(args)}
		<div class="flex justify-center p-8">
			<div class="w-full max-w-sm">
				<Accordion.Root {...args}>
					<Accordion.Item value="item-1">
						<Accordion.Trigger>How do I reset my password?</Accordion.Trigger>
						<Accordion.Content
							>Click on 'Forgot Password' on the login page, enter your email
							address, and we'll send you a link to reset your password. The
							link will expire in 24 hours.</Accordion.Content
						>
					</Accordion.Item>
					<Accordion.Item value="item-2">
						<Accordion.Trigger
							>Can I change my subscription plan?</Accordion.Trigger
						>
						<Accordion.Content
							>Yes, you can upgrade or downgrade your plan at any time from your
							account settings. Changes will be reflected in your next billing
							cycle.</Accordion.Content
						>
					</Accordion.Item>
					<Accordion.Item value="item-3">
						<Accordion.Trigger
							>What payment methods do you accept?</Accordion.Trigger
						>
						<Accordion.Content
							>We accept all major credit cards, PayPal, and bank transfers. All
							payments are processed securely through our payment partners.</Accordion.Content
						>
					</Accordion.Item>
				</Accordion.Root>
			</div>
		</div>
	{/snippet}
</Story>

<Story name="Multiple" parameters={{ controls: { disable: true } }}>
	{#snippet template()}
		<div class="flex justify-center p-8">
			<div class="w-full max-w-sm">
				<Accordion.Root type="multiple" value={["item-1", "item-2"]}>
					<Accordion.Item value="item-1">
						<Accordion.Trigger>Notification Settings</Accordion.Trigger>
						<Accordion.Content
							>Manage how you receive notifications. You can enable email alerts
							for updates or push notifications for mobile devices.</Accordion.Content
						>
					</Accordion.Item>
					<Accordion.Item value="item-2">
						<Accordion.Trigger>Privacy & Security</Accordion.Trigger>
						<Accordion.Content
							>Control your privacy settings and security preferences. Enable
							two-factor authentication, manage connected devices, review active
							sessions, and configure data sharing preferences. You can also
							download your data or delete your account.</Accordion.Content
						>
					</Accordion.Item>
					<Accordion.Item value="item-3">
						<Accordion.Trigger>Billing & Subscription</Accordion.Trigger>
						<Accordion.Content
							>View your current plan, payment history, and upcoming invoices.
							Update your payment method, change your subscription tier, or
							cancel your subscription.</Accordion.Content
						>
					</Accordion.Item>
				</Accordion.Root>
			</div>
		</div>
	{/snippet}
</Story>

<Story name="Disabled" parameters={{ controls: { disable: true } }}>
	{#snippet template()}
		<div class="flex justify-center p-8">
			<div class="w-full max-w-sm">
				<Accordion.Root type="single">
					<Accordion.Item value="item-1">
						<Accordion.Trigger
							>Can I access my account history?</Accordion.Trigger
						>
						<Accordion.Content
							>Yes, you can view your complete account history including all
							transactions, plan changes, and support tickets in the Account
							History section of your dashboard.</Accordion.Content
						>
					</Accordion.Item>
					<Accordion.Item value="item-2" disabled>
						<Accordion.Trigger>Premium feature information</Accordion.Trigger>
						<Accordion.Content
							>This section contains information about premium features. Upgrade
							your plan to access this content.</Accordion.Content
						>
					</Accordion.Item>
					<Accordion.Item value="item-3">
						<Accordion.Trigger
							>How do I update my email address?</Accordion.Trigger
						>
						<Accordion.Content
							>You can update your email address in your account settings.
							You'll receive a verification email at your new address to confirm
							the change.</Accordion.Content
						>
					</Accordion.Item>
				</Accordion.Root>
			</div>
		</div>
	{/snippet}
</Story>
