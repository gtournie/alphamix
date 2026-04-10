<script module lang="ts">
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { DirectionProvider } from "$lib/components/ui/direction/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import * as NativeSelect from "$lib/components/ui/native-select/index.js";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";

	const { Story } = defineMeta({
		title: "UI/Direction",
		component: DirectionProvider,
		tags: ["autodocs"],
	});
</script>

<script lang="ts">
	import type { Direction } from "$lib/components/ui/direction/index.js";

	type Lang = "en" | "ar";

	const config: Record<Lang, { direction: Direction; label: string; name: string; email: string; namePlaceholder: string; emailPlaceholder: string; save: string }> = {
		en: {
			direction: "ltr",
			label: "Account settings",
			name: "Full name",
			email: "Email",
			namePlaceholder: "John Doe",
			emailPlaceholder: "john@example.com",
			save: "Save",
		},
		ar: {
			direction: "rtl",
			label: "إعدادات الحساب",
			name: "الاسم الكامل",
			email: "البريد الإلكتروني",
			namePlaceholder: "محمد علي",
			emailPlaceholder: "mohammed@example.com",
			save: "حفظ",
		},
	};

	let lang = $state<Lang>("en");
	const t = $derived(config[lang]);
</script>

<Story name="Basic">
	{#snippet template()}
		<div class="flex flex-col items-start gap-6">
			<Field.Field class="w-40">
				<Field.Label for="lang-select">Language</Field.Label>
				<NativeSelect.Root id="lang-select" bind:value={lang}>
					<option value="en">English</option>
					<option value="ar">Arabic</option>
				</NativeSelect.Root>
			</Field.Field>

			<DirectionProvider direction={t.direction}>
				<Card.Root class="w-72">
					<Card.Header>
						<Card.Title>{t.label}</Card.Title>
					</Card.Header>
					<Card.Content>
						<Field.Group>
							<Field.Field>
								<Field.Label for="dir-name">{t.name}</Field.Label>
								<Input id="dir-name" placeholder={t.namePlaceholder} />
							</Field.Field>
							<Field.Field>
								<Field.Label for="dir-email">{t.email}</Field.Label>
								<Input id="dir-email" type="email" placeholder={t.emailPlaceholder} />
							</Field.Field>
						</Field.Group>
					</Card.Content>
					<Card.Footer>
						<Button class="ms-auto">
							{t.save}
							<ChevronRightIcon class="rtl:rotate-180" />
						</Button>
					</Card.Footer>
				</Card.Root>
			</DirectionProvider>
		</div>
	{/snippet}
</Story>
