<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import { ButtonGroup } from "$lib/components/ui/button-group/index.js";
	import InfoIcon from "@lucide/svelte/icons/info";

	const { Story } = defineMeta({
		title: "UI/Input",
		component: Input,
		tags: ["autodocs"],
	});
</script>

<Story name="Basic">
	{#snippet template()}
		<Input placeholder="Enter text" />
	{/snippet}
</Story>

<Story name="Field">
	{#snippet template()}
		<Field.Field>
			<Field.FieldLabel for="input-field-username">Username</Field.FieldLabel>
			<Input id="input-field-username" type="text" placeholder="Enter your username" />
			<Field.FieldDescription>Choose a unique username for your account.</Field.FieldDescription>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Field Group">
	{#snippet template()}
		<Field.FieldGroup>
			<Field.Field>
				<Field.FieldLabel for="fieldgroup-name">Name</Field.FieldLabel>
				<Input id="fieldgroup-name" placeholder="Jordan Lee" />
			</Field.Field>
			<Field.Field>
				<Field.FieldLabel for="fieldgroup-email">Email</Field.FieldLabel>
				<Input id="fieldgroup-email" type="email" placeholder="name@example.com" />
				<Field.FieldDescription>We'll send updates to this address.</Field.FieldDescription>
			</Field.Field>
			<Field.Field orientation="horizontal">
				<Button type="reset" variant="outline">Reset</Button>
				<Button type="submit">Submit</Button>
			</Field.Field>
		</Field.FieldGroup>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<Field.Field data-disabled>
			<Field.FieldLabel for="input-demo-disabled">Email</Field.FieldLabel>
			<Input id="input-demo-disabled" type="email" placeholder="Email" disabled />
			<Field.FieldDescription>This field is currently disabled.</Field.FieldDescription>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Invalid">
	{#snippet template()}
		<Field.Field data-invalid>
			<Field.FieldLabel for="input-invalid">Invalid Input</Field.FieldLabel>
			<Input id="input-invalid" placeholder="Error" aria-invalid="true" />
			<Field.FieldDescription>This field contains validation errors.</Field.FieldDescription>
		</Field.Field>
	{/snippet}
</Story>

<Story name="File">
	{#snippet template()}
		<Field.Field>
			<Field.FieldLabel for="picture">Picture</Field.FieldLabel>
			<Input id="picture" type="file" />
			<Field.FieldDescription>Select a picture to upload.</Field.FieldDescription>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Inline">
	{#snippet template()}
		<Field.Field orientation="horizontal">
			<Input type="search" placeholder="Search..." />
			<Button>Search</Button>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Grid">
	{#snippet template()}
		<Field.FieldGroup class="grid max-w-sm grid-cols-2">
			<Field.Field>
				<Field.FieldLabel for="first-name">First Name</Field.FieldLabel>
				<Input id="first-name" placeholder="Jordan" />
			</Field.Field>
			<Field.Field>
				<Field.FieldLabel for="last-name">Last Name</Field.FieldLabel>
				<Input id="last-name" placeholder="Lee" />
			</Field.Field>
		</Field.FieldGroup>
	{/snippet}
</Story>

<Story name="Required">
	{#snippet template()}
		<Field.Field>
			<Field.FieldLabel for="input-required">
				Required Field <span class="text-destructive">*</span>
			</Field.FieldLabel>
			<Input id="input-required" placeholder="This field is required" required />
			<Field.FieldDescription>This field must be filled out.</Field.FieldDescription>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Badge">
	{#snippet template()}
		<Field.Field>
			<Field.FieldLabel for="input-badge">
				Webhook URL
				<Badge variant="secondary" class="ml-auto">Beta</Badge>
			</Field.FieldLabel>
			<Input id="input-badge" type="url" placeholder="https://api.example.com/webhook" />
		</Field.Field>
	{/snippet}
</Story>

<Story name="Input Group">
	{#snippet template()}
		<Field.Field>
			<Field.FieldLabel for="input-group-url">Website URL</Field.FieldLabel>
			<InputGroup.Root>
				<InputGroup.Input id="input-group-url" placeholder="example.com" />
				<InputGroup.Addon>
					<InputGroup.Text>https://</InputGroup.Text>
				</InputGroup.Addon>
				<InputGroup.Addon align="inline-end">
					<InfoIcon />
				</InputGroup.Addon>
			</InputGroup.Root>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Button Group">
	{#snippet template()}
		<Field.Field>
			<Field.FieldLabel for="input-button-group">Search</Field.FieldLabel>
			<ButtonGroup>
				<Input id="input-button-group" placeholder="Type to search..." />
				<Button variant="outline">Search</Button>
			</ButtonGroup>
		</Field.Field>
	{/snippet}
</Story>

<Story name="Form">
	{#snippet template()}
		<form class="w-full max-w-sm">
			<Field.FieldGroup>
				<Field.Field>
					<Field.FieldLabel for="form-name">Name</Field.FieldLabel>
					<Input id="form-name" type="text" placeholder="Evil Rabbit" required />
				</Field.Field>
				<Field.Field>
					<Field.FieldLabel for="form-email">Email</Field.FieldLabel>
					<Input id="form-email" type="email" placeholder="john@example.com" />
					<Field.FieldDescription>We'll never share your email with anyone.</Field.FieldDescription>
				</Field.Field>
				<div class="grid grid-cols-2 gap-4">
					<Field.Field>
						<Field.FieldLabel for="form-phone">Phone</Field.FieldLabel>
						<Input id="form-phone" type="tel" placeholder="+1 (555) 123-4567" />
					</Field.Field>
					<Field.Field>
						<Field.FieldLabel id="label-form-country">Country</Field.FieldLabel>
						<Select.Root type="single" value="us">
							<Select.Trigger aria-labelledby="label-form-country">United States</Select.Trigger>
							<Select.Content>
								<Select.Item value="us">United States</Select.Item>
								<Select.Item value="uk">United Kingdom</Select.Item>
								<Select.Item value="ca">Canada</Select.Item>
							</Select.Content>
						</Select.Root>
					</Field.Field>
				</div>
				<Field.Field>
					<Field.FieldLabel for="form-address">Address</Field.FieldLabel>
					<Input id="form-address" type="text" placeholder="123 Main St" />
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Button type="button" variant="outline">Cancel</Button>
					<Button type="submit">Submit</Button>
				</Field.Field>
			</Field.FieldGroup>
		</form>
	{/snippet}
</Story>
