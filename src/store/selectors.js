import moment from 'moment';

function getTemperatureRatioChartData(state) {
	const activeYear = state.activeYear;
	const previousYear = activeYear - 1;
	const pointTemperaturesGroupedByYear = state.pointTemperaturesGroupedByYear;

	if (!pointTemperaturesGroupedByYear
		|| !pointTemperaturesGroupedByYear[activeYear])
		return [];

	const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май',
		'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'].map(m => m.slice(0, 3));

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
		Object.keys(currentYearAvgSum).reduce(func, []);

	const currentYearAvgSumFunc = (res, month) => {
		let { divider, sumOfAvgTemps } = currentYearAvgSum[month];
		res.push({
			x: months[month],
			y: sumOfAvgTemps / divider
		})

		return res;
	}

	const normYearAvgSumFunc = (res, month) => {
		const divider = currentYearAvgSum[month].divider + previosYearAvgSum[month].divider;
		const sumOfAvgTemps = currentYearAvgSum[month].sumOfAvgTemps + previosYearAvgSum[month].sumOfAvgTemps

		res.push({
			x: months[month],
			y: sumOfAvgTemps / divider
		})

		return res;
	}

	return [{
		key: activeYear,
		color: '#f06b6c',
		values: getSeria(currentYearAvgSumFunc)
	},
	{
		key: 'Среднемесячная норма',
		color: '#f9c4c4',
		values: getSeria(normYearAvgSumFunc)
	}];
};

export {
	getTemperatureRatioChartData
};