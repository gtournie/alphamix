<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as Field from "$lib/components/ui/field/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { Slider } from "$lib/components/ui/slider/index.js";
	import { Switch } from "$lib/components/ui/switch/index.js";

	const { Story } = defineMeta({
		title: "UI/Field",
		component: Field.Field,
		tags: ["autodocs"],
	});
</script>

<script>
	let sliderValue = $state([200, 800]);
</script>

<Story name="Input">
	{#snippet template()}
		<Field.FieldSet class="w-full max-w-xs">
			<Field.FieldGroup>
				<Field.Field>
					<Field.FieldLabel for="username">Username</Field.FieldLabel>
					<Input id="username" type="text" placeholder="Max Leiter" />
					<Field.FieldDescription>
						Choose a unique username for your account.
					</Field.FieldDescription>
				</Field.Field>
				<Field.Field>
					<Field.FieldLabel for="password">Password</Field.FieldLabel>
					<Field.FieldDescription>Must be at least 8 characters long.</Field.FieldDescription>
					<Input id="password" type="password" placeholder="••••••••" />
				</Field.Field>
			</Field.FieldGroup>
		</Field.FieldSet>
	{/snippet}
</Story>

<Story name="Textarea">
	{#snippet template()}
		<Field.FieldSet class="w-full max-w-xs">
			<Field.FieldGroup>
				<Field.Field>
					<Field.FieldLabel for="feedback">Feedback</Field.FieldLabel>
					<Textarea id="feedback" placeholder="Your feedback helps us improve..." rows={4} />
					<Field.FieldDescription>Share your thoughts about our service.</Field.FieldDescription>
				</Field.Field>
			</Field.FieldGroup>
		</Field.FieldSet>
	{/snippet}
</Story>

<Story name="Select">
	{#snippet template()}
		<Field.Field class="w-full max-w-xs">
			<Field.FieldLabel>Department</Field.FieldLabel>
			<Select.Root type="single">
				<Select.Trigger>Choose department</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Item value="engineering">Engineering</Select.Item>
						<Select.Item value="design">Design</Select.Item>
						<Select.Item value="marketing">Marketing</Select.Item>
						<Select.Item value="sales">Sales</Select.Item>
						<Select.Item value="support">Customer Support</Select.Item>
						<Select.Item value="hr">Human Resources</Select.Item>
						<Select.Item value="finance">Finance</Select.Item>
						<Select.Item value="operations">Operations</Select.Item>
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<Field.FieldDescription>Select your department or area of work.</Field.FieldDescription>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Slider">
	{#snippet template()}
		<Field.Field class="w-full max-w-xs">
			<Field.FieldTitle>Price Range</Field.FieldTitle>
			<Field.FieldDescription>
				Set your budget range (${sliderValue[0]} – ${sliderValue[1]}).
			</Field.FieldDescription>
			<Slider
				bind:value={sliderValue}
				max={1000}
				min={0}
				step={10}
				class="mt-2 w-full"
				aria-label="Price Range"
				thumbAriaLabel={(i: number) =>
					i === 0 ? "Minimum price" : "Maximum price"}
			/>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Fieldset">
	{#snippet template()}
		<Field.FieldSet class="w-full max-w-sm">
			<Field.FieldLegend>Address Information</Field.FieldLegend>
			<Field.FieldDescription>We need your address to deliver your order.</Field.FieldDescription>
			<Field.FieldGroup>
				<Field.Field>
					<Field.FieldLabel for="street">Street Address</Field.FieldLabel>
					<Input id="street" type="text" placeholder="123 Main St" />
				</Field.Field>
				<div class="grid grid-cols-2 gap-4">
					<Field.Field>
						<Field.FieldLabel for="city">City</Field.FieldLabel>
						<Input id="city" type="text" placeholder="New York" />
					</Field.Field>
					<Field.Field>
						<Field.FieldLabel for="zip">Postal Code</Field.FieldLabel>
						<Input id="zip" type="text" placeholder="90502" />
					</Field.Field>
				</div>
			</Field.FieldGroup>
		</Field.FieldSet>
	{/snippet}
</Story>

<Story name="Checkbox">
	{#snippet template()}
		<Field.FieldGroup class="w-full max-w-xs">
			<Field.FieldSet>
				<Field.FieldLegend variant="label">Show these items on the desktop</Field.FieldLegend>
				<Field.FieldDescription>
					Select the items you want to show on the desktop.
				</Field.FieldDescription>
				<Field.FieldGroup class="gap-3">
					<Field.Field orientation="horizontal">
						<Checkbox id="finder-pref-hard-disks" checked />
						<Field.FieldLabel for="finder-pref-hard-disks" class="font-normal">
							Hard disks
						</Field.FieldLabel>
					</Field.Field>
					<Field.Field orientation="horizontal">
						<Checkbox id="finder-pref-external-disks" />
						<Field.FieldLabel for="finder-pref-external-disks" class="font-normal">
							External disks
						</Field.FieldLabel>
					</Field.Field>
					<Field.Field orientation="horizontal">
						<Checkbox id="finder-pref-cds-dvds" />
						<Field.FieldLabel for="finder-pref-cds-dvds" class="font-normal">
							CDs, DVDs, and iPods
						</Field.FieldLabel>
					</Field.Field>
					<Field.Field orientation="horizontal">
						<Checkbox id="finder-pref-servers" />
						<Field.FieldLabel for="finder-pref-servers" class="font-normal">
							Connected servers
						</Field.FieldLabel>
					</Field.Field>
				</Field.FieldGroup>
			</Field.FieldSet>
			<Field.FieldSeparator />
			<Field.Field orientation="horizontal">
				<Checkbox id="finder-pref-sync" checked />
				<Field.FieldContent>
					<Field.FieldLabel for="finder-pref-sync">
						Sync Desktop &amp; Documents folders
					</Field.FieldLabel>
					<Field.FieldDescription>
						Your Desktop &amp; Documents folders are being synced with iCloud Drive. You can access
						them from other devices.
					</Field.FieldDescription>
				</Field.FieldContent>
			</Field.Field>
		</Field.FieldGroup>
	{/snippet}
</Story>

<Story name="Radio">
	{#snippet template()}
		<Field.FieldSet class="w-full max-w-xs">
			<Field.FieldLegend variant="label">Subscription Plan</Field.FieldLegend>
			<Field.FieldDescription>
				Yearly and lifetime plans offer significant savings.
			</Field.FieldDescription>
			<RadioGroup.Root value="monthly">
				<Field.Field orientation="horizontal">
					<RadioGroup.Item value="monthly" id="plan-monthly" />
					<Field.FieldLabel for="plan-monthly" class="font-normal">
						Monthly ($9.99/month)
					</Field.FieldLabel>
				</Field.Field>
				<Field.Field orientation="horizontal">
					<RadioGroup.Item value="yearly" id="plan-yearly" />
					<Field.FieldLabel for="plan-yearly" class="font-normal">
						Yearly ($99.99/year)
					</Field.FieldLabel>
				</Field.Field>
				<Field.Field orientation="horizontal">
					<RadioGroup.Item value="lifetime" id="plan-lifetime" />
					<Field.FieldLabel for="plan-lifetime" class="font-normal">
						Lifetime ($299.99)
					</Field.FieldLabel>
				</Field.Field>
			</RadioGroup.Root>
		</Field.FieldSet>
	{/snippet}
</Story>

<Story name="Switch">
	{#snippet template()}
		<Field.Field orientation="horizontal" class="w-fit">
			<Field.FieldLabel for="2fa">Multi-factor authentication</Field.FieldLabel>
			<Switch id="2fa" />
		</Field.Field>
	{/snippet}
</Story>

<Story name="Choice Card">
	{#snippet template()}
		<Field.FieldGroup class="w-full max-w-xs">
			<Field.FieldSet>
				<Field.FieldLegend variant="label">Compute Environment</Field.FieldLegend>
				<Field.FieldDescription>
					Select the compute environment for your cluster.
				</Field.FieldDescription>
				<RadioGroup.Root value="kubernetes">
					<Field.FieldLabel for="kubernetes-r2h">
						<Field.Field orientation="horizontal">
							<Field.FieldContent>
								<Field.FieldTitle>Kubernetes</Field.FieldTitle>
								<Field.FieldDescription>Run GPU workloads on a K8s cluster.</Field.FieldDescription>
							</Field.FieldContent>
							<RadioGroup.Item value="kubernetes" id="kubernetes-r2h" />
						</Field.Field>
					</Field.FieldLabel>
					<Field.FieldLabel for="vm-z4k">
						<Field.Field orientation="horizontal">
							<Field.FieldContent>
								<Field.FieldTitle>Virtual Machine</Field.FieldTitle>
								<Field.FieldDescription>
									Access a cluster to run GPU workloads.
								</Field.FieldDescription>
							</Field.FieldContent>
							<RadioGroup.Item value="vm" id="vm-z4k" />
						</Field.Field>
					</Field.FieldLabel>
				</RadioGroup.Root>
			</Field.FieldSet>
		</Field.FieldGroup>
	{/snippet}
</Story>

<Story name="Field Group">
	{#snippet template()}
		<Field.FieldGroup class="w-full max-w-xs">
			<Field.FieldSet>
				<Field.FieldLabel>Responses</Field.FieldLabel>
				<Field.FieldDescription>
					Get notified when ChatGPT responds to requests that take time, like research or image
					generation.
				</Field.FieldDescription>
				<Field.FieldGroup data-slot="checkbox-group">
					<Field.Field orientation="horizontal">
						<Checkbox id="push" checked disabled />
						<Field.FieldLabel for="push" class="font-normal">Push notifications</Field.FieldLabel>
					</Field.Field>
				</Field.FieldGroup>
			</Field.FieldSet>
			<Field.FieldSeparator />
			<Field.FieldSet>
				<Field.FieldLabel>Tasks</Field.FieldLabel>
				<Field.FieldDescription>
					Get notified when tasks you've created have updates. <a href="https://example.com">Manage tasks</a>
				</Field.FieldDescription>
				<Field.FieldGroup data-slot="checkbox-group">
					<Field.Field orientation="horizontal">
						<Checkbox id="push-tasks" />
						<Field.FieldLabel for="push-tasks" class="font-normal">
							Push notifications
						</Field.FieldLabel>
					</Field.Field>
					<Field.Field orientation="horizontal">
						<Checkbox id="email-tasks" />
						<Field.FieldLabel for="email-tasks" class="font-normal">
							Email notifications
						</Field.FieldLabel>
					</Field.Field>
				</Field.FieldGroup>
			</Field.FieldSet>
		</Field.FieldGroup>
	{/snippet}
</Story>
