<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
	import * as Field from "$lib/components/ui/field/index.js";

	const { Story } = defineMeta({
		title: "UI/RadioGroup",
		component: RadioGroup.Root,
		tags: ["autodocs"],
	});
</script>

<Story name="Description">
	{#snippet template()}
		<RadioGroup.Root value="comfortable" class="w-fit">
			<Field.Field orientation="horizontal">
				<RadioGroup.Item value="default" id="desc-r1" />
				<Field.Content>
					<Field.Label for="desc-r1">Default</Field.Label>
					<Field.Description>
						Standard spacing for most use cases.
					</Field.Description>
				</Field.Content>
			</Field.Field>
			<Field.Field orientation="horizontal">
				<RadioGroup.Item value="comfortable" id="desc-r2" />
				<Field.Content>
					<Field.Label for="desc-r2">Comfortable</Field.Label>
					<Field.Description>More space between elements.</Field.Description>
				</Field.Content>
			</Field.Field>
			<Field.Field orientation="horizontal">
				<RadioGroup.Item value="compact" id="desc-r3" />
				<Field.Content>
					<Field.Label for="desc-r3">Compact</Field.Label>
					<Field.Description>
						Minimal spacing for dense layouts.
					</Field.Description>
				</Field.Content>
			</Field.Field>
		</RadioGroup.Root>
	{/snippet}
</Story>

<Story name="Choice Card">
	{#snippet template()}
		<RadioGroup.Root value="plus" class="max-w-sm">
			<Field.Label for="plus-plan">
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Title>Plus</Field.Title>
						<Field.Description>
							For individuals and small teams.
						</Field.Description>
					</Field.Content>
					<RadioGroup.Item value="plus" id="plus-plan" />
				</Field.Field>
			</Field.Label>
			<Field.Label for="pro-plan">
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Title>Pro</Field.Title>
						<Field.Description>For growing businesses.</Field.Description>
					</Field.Content>
					<RadioGroup.Item value="pro" id="pro-plan" />
				</Field.Field>
			</Field.Label>
			<Field.Label for="enterprise-plan">
				<Field.Field orientation="horizontal">
					<Field.Content>
						<Field.Title>Enterprise</Field.Title>
						<Field.Description>
							For large teams and enterprises.
						</Field.Description>
					</Field.Content>
					<RadioGroup.Item value="enterprise" id="enterprise-plan" />
				</Field.Field>
			</Field.Label>
		</RadioGroup.Root>
	{/snippet}
</Story>

<Story name="Fieldset">
	{#snippet template()}
		<Field.Set class="w-full max-w-xs">
			<Field.Legend variant="label">Subscription Plan</Field.Legend>
			<Field.Description>
				Yearly and lifetime plans offer significant savings.
			</Field.Description>
			<RadioGroup.Root value="monthly">
				<Field.Field orientation="horizontal">
					<RadioGroup.Item value="monthly" id="plan-monthly" />
					<Field.Label for="plan-monthly" class="font-normal">
						Monthly ($9.99/month)
					</Field.Label>
				</Field.Field>
				<Field.Field orientation="horizontal">
					<RadioGroup.Item value="yearly" id="plan-yearly" />
					<Field.Label for="plan-yearly" class="font-normal">
						Yearly ($99.99/year)
					</Field.Label>
				</Field.Field>
				<Field.Field orientation="horizontal">
					<RadioGroup.Item value="lifetime" id="plan-lifetime" />
					<Field.Label for="plan-lifetime" class="font-normal">
						Lifetime ($299.99)
					</Field.Label>
				</Field.Field>
			</RadioGroup.Root>
		</Field.Set>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<RadioGroup.Root value="option2" class="w-fit">
			<Field.Field orientation="horizontal" data-disabled>
				<RadioGroup.Item value="option1" id="disabled-1" disabled />
				<Field.Label for="disabled-1" class="font-normal">
					Disabled
				</Field.Label>
			</Field.Field>
			<Field.Field orientation="horizontal">
				<RadioGroup.Item value="option2" id="disabled-2" />
				<Field.Label for="disabled-2" class="font-normal">
					Option 2
				</Field.Label>
			</Field.Field>
			<Field.Field orientation="horizontal">
				<RadioGroup.Item value="option3" id="disabled-3" />
				<Field.Label for="disabled-3" class="font-normal">
					Option 3
				</Field.Label>
			</Field.Field>
		</RadioGroup.Root>
	{/snippet}
</Story>

<Story name="Invalid">
	{#snippet template()}
		<Field.Set class="w-full max-w-xs">
			<Field.Legend variant="label">Notification Preferences</Field.Legend>
			<Field.Description>
				Choose how you want to receive notifications.
			</Field.Description>
			<RadioGroup.Root value="email">
				<Field.Field orientation="horizontal" data-invalid="true">
					<RadioGroup.Item value="email" id="invalid-email" aria-invalid="true" />
					<Field.Label for="invalid-email" class="font-normal">
						Email only
					</Field.Label>
				</Field.Field>
				<Field.Field orientation="horizontal" data-invalid>
					<RadioGroup.Item value="sms" id="invalid-sms" aria-invalid />
					<Field.Label for="invalid-sms" class="font-normal">
						SMS only
					</Field.Label>
				</Field.Field>
				<Field.Field orientation="horizontal" data-invalid>
					<RadioGroup.Item value="both" id="invalid-both" aria-invalid />
					<Field.Label for="invalid-both" class="font-normal">
						Both Email & SMS
					</Field.Label>
				</Field.Field>
			</RadioGroup.Root>
		</Field.Set>
	{/snippet}
</Story>
