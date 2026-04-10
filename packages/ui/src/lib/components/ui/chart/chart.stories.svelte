<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { ChartContainer, ChartTooltip } from '$lib/components/ui/chart/index.js';
	import { BarChart, LineChart, AreaChart } from 'layerchart';

	const monthlyData = [
		{ month: 'Jan', desktop: 186, mobile: 80 },
		{ month: 'Fév', desktop: 305, mobile: 200 },
		{ month: 'Mar', desktop: 237, mobile: 120 },
		{ month: 'Avr', desktop: 73, mobile: 190 },
		{ month: 'Mai', desktop: 209, mobile: 130 },
		{ month: 'Juin', desktop: 214, mobile: 140 },
	];

	const chartConfig = {
		desktop: { label: 'Bureau', color: 'var(--chart-1)' },
		mobile: { label: 'Mobile', color: 'var(--chart-2)' },
	};

	const { Story } = defineMeta({
		title: 'UI/Chart',
		component: ChartContainer,
		tags: ['autodocs'],
		argTypes: {
			// config is a required prop, not suitable for live editing
			config: { control: false, description: 'ChartConfig — series label and color map' },
			class: { control: 'text' },
		},
		args: {
			class: 'min-h-48 w-full',
		},
	});
</script>

<Story name="Bar">
	{#snippet template(args)}
		<ChartContainer {...args} config={chartConfig}>
			<BarChart
				data={monthlyData}
				x="month"
				series={[
					{ key: 'desktop', label: 'Bureau', color: 'var(--chart-1)' },
					{ key: 'mobile', label: 'Mobile', color: 'var(--chart-2)' },
				]}
				seriesLayout="group"
			>
				{#snippet tooltip()}
					<ChartTooltip />
				{/snippet}
			</BarChart>
		</ChartContainer>
	{/snippet}
</Story>

<Story name="Line">
	{#snippet template(args)}
		<ChartContainer {...args} config={chartConfig}>
			<LineChart
				data={monthlyData}
				x="month"
				series={[
					{ key: 'desktop', label: 'Bureau', color: 'var(--chart-1)' },
					{ key: 'mobile', label: 'Mobile', color: 'var(--chart-2)' },
				]}
			>
				{#snippet tooltip()}
					<ChartTooltip />
				{/snippet}
			</LineChart>
		</ChartContainer>
	{/snippet}
</Story>

<Story name="Area">
	{#snippet template(args)}
		<ChartContainer {...args} config={chartConfig}>
			<AreaChart
				data={monthlyData}
				x="month"
				series={[
					{ key: 'desktop', label: 'Bureau', color: 'var(--chart-1)' },
					{ key: 'mobile', label: 'Mobile', color: 'var(--chart-2)' },
				]}
			>
				{#snippet tooltip()}
					<ChartTooltip />
				{/snippet}
			</AreaChart>
		</ChartContainer>
	{/snippet}
</Story>

<Story name="Bar Stacked">
	{#snippet template(args)}
		<ChartContainer {...args} config={chartConfig}>
			<BarChart
				data={monthlyData}
				x="month"
				series={[
					{ key: 'desktop', label: 'Bureau', color: 'var(--chart-1)' },
					{ key: 'mobile', label: 'Mobile', color: 'var(--chart-2)' },
				]}
				seriesLayout="stack"
			>
				{#snippet tooltip()}
					<ChartTooltip />
				{/snippet}
			</BarChart>
		</ChartContainer>
	{/snippet}
</Story>
