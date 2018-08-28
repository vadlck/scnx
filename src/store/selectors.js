import { getTemperatureSeria } from '../services/temperatureCharts';

function getTemperatureRatioChartData(state) {
	const activeYear = state.activeYear;
	const pointTemperaturesGroupedByYear = state.pointTemperaturesGroupedByYear;

	if (!pointTemperaturesGroupedByYear
		|| !pointTemperaturesGroupedByYear[activeYear])
		return [];


	const currentYearAvgSum = getTemperatureSeria(pointTemperaturesGroupedByYear[activeYear], {
		key: activeYear,
		color: '#f06b6c',
		yAxis: 1,
		type: 'bar',
	});

	const normYearAvg = getTemperatureSeria(
		Object.keys(pointTemperaturesGroupedByYear).reduce((res, year) => res.concat(pointTemperaturesGroupedByYear[year]), []), {
			key: 'Среднемесячная норма',
			color: '#f9c4c4',
			type: 'bar',
			yAxis: 2
		});

	return [currentYearAvgSum, normYearAvg]
};

export {
	getTemperatureRatioChartData
};