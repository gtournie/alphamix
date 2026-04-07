<script module>
	import { defineMeta } from "@storybook/addon-svelte-csf";
	import { NativeSelect } from "$lib/components/ui/native-select/index.js";
	import { Label } from "$lib/components/ui/label/index.js";

	const { Story } = defineMeta({
		title: "UI/NativeSelect",
		component: NativeSelect,
		tags: ["autodocs"],
	});
</script>

<Story name="Basic">
	{#snippet template()}
		<NativeSelect class="w-[200px]">
			<option value="">Choisir...</option>
			<option value="fr">France</option>
			<option value="be">Belgique</option>
			<option value="ch">Suisse</option>
		</NativeSelect>
	{/snippet}
</Story>

<Story name="With Label">
	{#snippet template()}
		<div class="flex w-[200px] flex-col gap-2">
			<Label for="pays">Pays</Label>
			<NativeSelect id="pays">
				<option value="fr">France</option>
				<option value="be">Belgique</option>
				<option value="ch">Suisse</option>
			</NativeSelect>
		</div>
	{/snippet}
</Story>
