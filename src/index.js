const url =
	'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const getData = async () => {
	const dataset = [];
	const response = await fetch(url);
	const data = await response.json();
	dataset.push(...data.data);
	return dataset;
};

const renderData = async () => {
	const dataset = await getData();

	const w = 900;
	const h = 500;
	const padding = 100;

	const renderTooltip = (date, money) => {
		const month = new Date(date).getMonth();
		const year = new Date(date).getFullYear();
		let quarter;

		month <= 3
			? (quarter = 'Q1')
			: month <= 6
			? (quarter = 'Q2')
			: month <= 9
			? (quarter = 'Q3')
			: (quarter = 'Q4');

		return `${year} ${quarter} <br /> $${money} Billion`;
	};

	// Scales
	const xScale = d3
		.scaleTime()
		.domain([
			d3.min(dataset, d => new Date(d[0])),
			d3.max(dataset, d => new Date(d[0])),
		])
		.range([padding, w - padding]);

	const yScale = d3
		.scaleLinear()
		.domain([0, d3.max(dataset, d => d[1])])
		.range([h - padding, padding]);

	// SVG Container
	const svg = d3
		.select('.svg-container')
		.append('svg')
		.attr('viewBox', `0 0 ${w} ${h}`)
		.classed('svg-content', true);

	// Title
	svg
		.append('text')
		.attr('id', 'title')
		.attr('x', w / 2)
		.attr('text-anchor', 'middle')
		.attr('y', padding / 2)
		.text('US Gross Domestic Product: 1947 - 2015');

	// Tooltip
	const tooltip = d3
		.select('.svg-container')
		.append('div')
		.attr('id', 'tooltip')
		.attr('class', 'tooltip')
		.style('opacity', 0);

	// Bars
	svg
		.selectAll('rect')
		.data(dataset)
		.enter()
		.append('rect')
		.classed('bar', true)
		.attr('data-date', d => d[0])
		.attr('data-gdp', d => d[1])
		.attr('x', d => xScale(new Date(d[0])))
		.attr('y', d => yScale(d[1]))
		.attr('width', 3)
		.attr('height', d => h - yScale(d[1]) - padding)
		.on('mouseover', d => {
			tooltip.transition().duration(200).style('opacity', 0.9);
			tooltip
				.html(renderTooltip(d[0], d[1]))
				.attr('data-date', d[0])
				.style('left', `${d3.event.pageX - 34}px`)
				.style('top', '60%');
		})
		.on('mouseout', d => {
			tooltip.transition().duration(200).style('opacity', 0);
		});

	// x-axis
	const xAxis = d3.axisBottom(xScale);

	svg
		.append('g')
		.attr('id', 'x-axis')
		.attr('transform', `translate(0, ${h - padding})`)
		.call(xAxis);

	// x-axis Label
	svg
		.append('text')
		.attr('class', 'axis-label')
		.attr('text-anchor', 'middle')
		.attr('x', w / 2)
		.attr('y', h - padding / 2.5)
		.text('Year');

	// y-axis
	const yAxis = d3.axisLeft(yScale);

	svg
		.append('g')
		.attr('id', 'y-axis')
		.attr('transform', `translate(${padding}, 0)`)
		.call(yAxis);

	// y-axis Label
	svg
		.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('text-anchor', 'middle')
		.attr('class', 'axis-label')
		.attr('x', 0 - h / 2)
		.attr('y', padding / 2)
		.text('GDP ($, Billion)');
};

renderData();
