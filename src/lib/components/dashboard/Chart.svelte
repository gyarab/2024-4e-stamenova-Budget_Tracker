<script>
	import * as d3 from 'd3';
	export let chartData, type;

	let width = 620;
	let height = 480;
	let margin = { top: 30, right: 100, bottom: 0, left: 120 };

	$: innerWidth = width - margin.left - margin.right;
	let innerHeight = height - margin.top - margin.bottom;

	$: xScale = d3
		.scaleLinear()
		.domain([0, d3.max(chartData, (d) => d.amount) || 1])
		.range([0, innerWidth]);

	const yScale = d3
		.scaleBand()
		.domain(chartData.map((d) => d.source))
		.range([innerHeight, 0])
		.padding(0.25);

	$: colorScale = d3
		.scaleLinear()
		.domain([d3.min(chartData, (d) => d.amount) || 0, d3.max(chartData, (d) => d.amount) || 1])
		.range(['#b3cde0', '#005b96']);
</script>

{#if chartData.length < 2}
	<div class="chart-container thumbnail">
		<p class="chart-header">📊 Nedostatek dat</p>
		<p class="chart-text">
			Pro zobrazení grafu <strong>{type === 'income' ? 'příjmů' : 'výdajů'}</strong> potřebujeme alespoň
			2 transakce za poslední 2 měsíce.
		</p>
	</div>
{:else}
	<div class="chart-container">
		<h3 class="chart-header">
			📈 Přehled TOP10 {type === 'income' ? 'příjmů' : 'výdajů'} za poslední 2 měsíce
		</h3>

		<svg {width} {height}>
			<g transform={`translate(${margin.left}, ${margin.top})`}>
				{#each chartData as entry}
					<text
						text-anchor="end"
						x={-10}
						y={yScale(entry.source) + yScale.bandwidth() / 2}
						dy=".35em"
					>
						{entry.source.length > 13 ? entry.source.slice(0, 10) + '...' : entry.source}
					</text>
					<rect
						x={0}
						y={yScale(entry.source)}
						width={xScale(entry.amount)}
						height={yScale.bandwidth()}
						fill={colorScale(entry.amount)}
					/>
					<text
						text-anchor="start"
						x={xScale(entry.amount)}
						dx="10"
						y={yScale(entry.source) + yScale.bandwidth() / 2}
						dy=".35em"
					>
						{d3.format(',.0f')(entry.amount)} CZK
					</text>
				{/each}
			</g>
		</svg>
	</div>
{/if}

<style>
	.chart-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		max-width: 930px;
		margin-block: 1rem;
		background-color: white;
		border-radius: 0.5rem;
		padding: 1rem;
	}

	.chart-header {
		font-family: 'Merriweather', serif;
		font-size: 18px;
		font-weight: 700;
		margin-bottom: 10px;
	}

	.chart-text {
		font-size: 14px;
		color: #666;
		text-align: center;
	}

	rect {
		stroke: #333;
		stroke-width: 1px;
	}

	.thumbnail {
		background-color: #f5f5f5;
		border: 2px dashed #999;
	}
</style>
