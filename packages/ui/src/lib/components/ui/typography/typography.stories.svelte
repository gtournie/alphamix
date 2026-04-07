<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'UI/Typography',
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component: 'Typography styles applied directly to HTML elements via Tailwind CSS utility classes. No Svelte component — copy the classes directly.',
				},
			},
		},
	});
</script>

<Story name="H1">
	{#snippet template()}
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			Le renard brun rapide
		</h1>
	{/snippet}
</Story>

<Story name="H2">
	{#snippet template()}
		<h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
			L'heure est venue
		</h2>
	{/snippet}
</Story>

<Story name="H3">
	{#snippet template()}
		<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
			Les gens étaient stupéfaits
		</h3>
	{/snippet}
</Story>

<Story name="H4">
	{#snippet template()}
		<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
			Vous pouvez probablement le deviner
		</h4>
	{/snippet}
</Story>

<Story name="Paragraph">
	{#snippet template()}
		<p class="leading-7 not-first:mt-6">
			Le roi, voyant cela, plongea dans l'obscurité. Il se trouva dans une pièce sombre où une seule
			bougie brûlait. Regardant autour de lui, il vit de nombreuses bougies éteintes et quelques
			chandelles presque éteintes. Il se demanda lequel de ces cierges représentait sa vie.
		</p>
		<p class="leading-7 not-first:mt-6">
			Le deuxième paragraphe illustre la marge supérieure ajoutée par <code class="font-mono text-sm">not-first:mt-6</code>.
		</p>
	{/snippet}
</Story>

<Story name="Blockquote">
	{#snippet template()}
		<blockquote class="mt-6 border-l-2 pl-6 italic">
			« Après tout, dit-il à voix basse pour lui-même, tout bien considéré, on peut toujours
			recommencer. »
		</blockquote>
	{/snippet}
</Story>

<Story name="InlineCode">
	{#snippet template()}
		<p class="leading-7">
			Saisissez <code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">npm install</code> pour installer les dépendances.
		</p>
	{/snippet}
</Story>

<Story name="Lead">
	{#snippet template()}
		<p class="text-muted-foreground text-xl">
			Une bibliothèque de composants conçue avec Tailwind CSS et Bits UI.
		</p>
	{/snippet}
</Story>

<Story name="Large">
	{#snippet template()}
		<!-- intentionally a div, matching the shadcn typography recipe -->
		<div class="text-lg font-semibold">Êtes-vous sûr de vouloir effectuer cette action ?</div>
	{/snippet}
</Story>

<Story name="Small">
	{#snippet template()}
		<small class="text-sm leading-none font-medium">Conditions d'utilisation</small>
	{/snippet}
</Story>

<Story name="Muted">
	{#snippet template()}
		<p class="text-muted-foreground text-sm">Entrez votre adresse e-mail.</p>
	{/snippet}
</Story>

<Story name="List">
	{#snippet template()}
		<ul class="my-6 ml-6 list-disc [&>li]:mt-2">
			<li>Premier niveau de pagination</li>
			<li>Permettre la navigation par onglets dans les cellules de liste</li>
			<li>Composants accessibles et stylisés</li>
		</ul>
	{/snippet}
</Story>

<Story name="All">
	{#snippet template()}
		<div class="space-y-6 max-w-prose">
			<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Titre principal
			</h1>
			<h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
				Sous-titre
			</h2>
			<p class="text-muted-foreground text-xl">
				Un texte d'accroche décrivant le contenu de la page.
			</p>
			<p class="leading-7">
				Un paragraphe de texte courant. Le roi, voyant cela, plongea dans l'obscurité.
				Exécutez <code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">bun install</code> pour démarrer.
			</p>
			<blockquote class="border-l-2 pl-6 italic">
				« Une citation inspirante. »
			</blockquote>
			<ul class="ml-6 list-disc [&>li]:mt-2">
				<li>Élément de liste un</li>
				<li>Élément de liste deux</li>
				<li>Élément de liste trois</li>
			</ul>
			<!-- intentionally a div, matching the shadcn typography recipe -->
			<div class="text-lg font-semibold">Texte large important</div>
			<small class="text-sm leading-none font-medium">Texte petit</small>
			<p class="text-muted-foreground text-sm">Note de bas de page.</p>
		</div>
	{/snippet}
</Story>
