// const dataset = [];

// const url =
// 	'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

let req = new XMLHttpRequest();
req.open(
	'GET',
	'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',
	true
);
req.send();
req.onload = function () {
	dataset = JSON.parse(req.responseText).data;

	console.log(dataset);

	const w = 900;
	const h = 500;
	const padding = 20;

	const svg = d3
		.select('#data')
		.append('svg')
		.attr('width', w)
		.attr('height', h);

	const yScale = d3
		.scaleLinear()
		.domain([d3.min(dataset, d => d[1]), d3.max(dataset, d => d[1])])
		.range([h - padding, padding]);

	svg
		.selectAll('rect')
		.data(dataset)
		.enter()
		.append('rect')
		.attr('x', (d, i) => i * 2)
		.attr('y', d => h - yScale(d[1]))
		.attr('width', 2)
		.attr('height', d => yScale(d[1]))
		.attr('fill', 'blue');
};
