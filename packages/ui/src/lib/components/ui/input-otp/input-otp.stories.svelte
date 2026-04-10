<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import * as InputOTP from "$lib/components/ui/input-otp/index.js";

	const REGEXP_ONLY_DIGITS = "^\\d+$";
	const REGEXP_ONLY_DIGITS_AND_CHARS = "^[a-zA-Z0-9]+$";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import RefreshCwIcon from "@lucide/svelte/icons/refresh-cw";

	const { Story } = defineMeta({
		title: "UI/InputOTP",
		component: InputOTP.Root,
		tags: ["autodocs"],
	});
</script>

<script>
	let controlledValue = $state("");
	let invalidValue = $state("000000");
</script>

<Story name="Separator">
	{#snippet template()}
		<InputOTP.Root maxlength={6} aria-label="One-time password">
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells.slice(0, 2) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
				<InputOTP.Separator />
				<InputOTP.Group>
					{#each cells.slice(2, 4) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
				<InputOTP.Separator />
				<InputOTP.Group>
					{#each cells.slice(4, 6) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
	{/snippet}
</Story>

<Story name="Disabled">
	{#snippet template()}
		<InputOTP.Root maxlength={6} value="123456" disabled aria-label="One-time password (disabled)">
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells.slice(0, 3) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
				<InputOTP.Separator />
				<InputOTP.Group>
					{#each cells.slice(3, 6) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
	{/snippet}
</Story>

<Story name="Controlled">
	{#snippet template()}
		<div class="flex flex-col items-center gap-2">
			<InputOTP.Root maxlength={6} bind:value={controlledValue} aria-label="One-time password">
				{#snippet children({ cells })}
					<InputOTP.Group>
						{#each cells as cell (cell)}
							<InputOTP.Slot {cell} />
						{/each}
					</InputOTP.Group>
				{/snippet}
			</InputOTP.Root>
			<div class="text-sm">
				{#if controlledValue === ""}
					Enter your one-time password.
				{:else}
					You entered: {controlledValue}
				{/if}
			</div>
		</div>
	{/snippet}
</Story>

<Story name="Invalid">
	{#snippet template()}
		<InputOTP.Root maxlength={6} bind:value={invalidValue} aria-label="One-time password">
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells.slice(0, 2) as cell (cell)}
						<InputOTP.Slot {cell} aria-invalid={true} />
					{/each}
				</InputOTP.Group>
				<InputOTP.Separator />
				<InputOTP.Group>
					{#each cells.slice(2, 4) as cell (cell)}
						<InputOTP.Slot {cell} aria-invalid={true} />
					{/each}
				</InputOTP.Group>
				<InputOTP.Separator />
				<InputOTP.Group>
					{#each cells.slice(4, 6) as cell (cell)}
						<InputOTP.Slot {cell} aria-invalid={true} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
	{/snippet}
</Story>

<Story name="Four Digits">
	{#snippet template()}
		<InputOTP.Root maxlength={4} pattern={REGEXP_ONLY_DIGITS} inputmode="numeric" aria-label="One-time password">
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
	{/snippet}
</Story>

<Story name="Alphanumeric">
	{#snippet template()}
		<InputOTP.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} inputmode="text" aria-label="One-time password">
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells.slice(0, 3) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
				<InputOTP.Separator />
				<InputOTP.Group>
					{#each cells.slice(3, 6) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
	{/snippet}
</Story>

<Story name="Form">
	{#snippet template()}
		<Card.Root class="mx-auto w-fit max-w-md">
			<Card.Header>
				<Card.Title>Verify your login</Card.Title>
				<Card.Description>
					Enter the verification code we sent to your email address:
					<span class="font-medium">m@example.com</span>.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Field.Field>
					<div class="flex items-center justify-between">
						<Field.FieldLabel for="otp-verification"
							>Verification code</Field.FieldLabel
						>
						<Button variant="outline" size="xs">
							<RefreshCwIcon />
							Resend Code
						</Button>
					</div>
					<InputOTP.Root maxlength={6} id="otp-verification" required aria-label="Verification code">
						{#snippet children({ cells })}
							<InputOTP.Group>
								{#each cells.slice(0, 3) as cell (cell)}
									<InputOTP.Slot {cell} class="h-12 w-11 text-xl" />
								{/each}
							</InputOTP.Group>
							<InputOTP.Separator class="mx-2" />
							<InputOTP.Group>
								{#each cells.slice(3, 6) as cell (cell)}
									<InputOTP.Slot {cell} class="h-12 w-11 text-xl" />
								{/each}
							</InputOTP.Group>
						{/snippet}
					</InputOTP.Root>
					<Field.FieldDescription>
						<a href="https://example.com"
							>I no longer have access to this email address.</a
						>
					</Field.FieldDescription>
				</Field.Field>
			</Card.Content>
			<Card.Footer class="flex-col items-start gap-4">
				<Button type="button" class="w-full">Verify</Button>
				<div class="text-muted-foreground text-sm">
					Having trouble signing in?
					<a
						href="https://example.com"
						class="underline underline-offset-4 transition-colors hover:text-primary"
					>
						Contact support
					</a>
				</div>
			</Card.Footer>
		</Card.Root>
	{/snippet}
</Story>
