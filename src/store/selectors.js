import moment from 'moment';

function getTemperatureRatioChartData(state) {
	const activeYear = state.activeYear;
	const previousYear = activeYear - 1;
	const pointTemperaturesGroupedByYear = state.pointTemperaturesGroupedByYear;

	if (!pointTemperaturesGroupedByYear
		|| !pointTemperaturesGroupedByYear[activeYear])
		return [];

	function calcAvgTempsGroupedByMonth(res, { properties }) {
		let month = moment(properties.Date).month();

		if (res[month]) {
			res[month].divider++;
			res[month].sumOfAvgTemps += properties.AvgTemp;
		} else {
			res[month] = {
				divider: 1,
				sumOfAvgTemps: properties.AvgTemp
			};
		}

		return res;
	}

	const currentYearAvgSum = pointTemperaturesGroupedByYear[activeYear].reduce(calcAvgTempsGroupedByMonth, {});
	const previosYearAvgSum = pointTemperaturesGroupedByYear[previousYear].reduce(calcAvgTempsGroupedByMonth, {});

	const getSeria = func =>
		Object.keys(currentYearAvgSum).reduce(func, { min: null, max: null, values: [] });

	const currentYearAvgSumFunc = (res, month, i) => {
		let { divider, sumOfAvgTemps } = currentYearAvgSum[month];
		let y = +((sumOfAvgTemps / divider).toFixed(1));

		if (res.min > y || !res.min)
			res.min = y;

		if (res.max < y || !res.max)
			res.max = y;

		res.values.push({
			x: month,
			y: (sumOfAvgTemps / divider).toFixed(1),
		})

		return res;
	}

	const normYearAvgSumFunc = (res, month, i) => {
		const divider = currentYearAvgSum[month].divider + previosYearAvgSum[month].divider;
		const sumOfAvgTemps = currentYearAvgSum[month].sumOfAvgTemps + previosYearAvgSum[month].sumOfAvgTemps;

		let y = +((sumOfAvgTemps / divider).toFixed(1));
	
		if (res.min > y || !res.min)
			res.min = y;

		if (res.max < y || !res.max)
			res.max = y;

		res.values.push({
			x: month,
			y: (sumOfAvgTemps / divider).toFixed(1),
		})

		return res;
	};


	return [{
		key: activeYear,
		color: '#f06b6c',
		yAxis: 1,
		type: 'bar',
		...getSeria(currentYearAvgSumFunc)
	},
	{
		key: 'Среднемесячная норма',
		color: '#f9c4c4',
		type: 'bar',
		yAxis: 2,
		...getSeria(normYearAvgSumFunc)
	}];
};

export {
	getTemperatureRatioChartData
};