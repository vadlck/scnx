import moment from 'moment';

function groupByMonth(res, { properties }) {
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

function calcAvg(res, month, i) {
	let { divider, sumOfAvgTemps } = res.monthAvg[month];
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

function getSeriaValues(values) {
	return Object.keys(values).reduce(calcAvg, {
		min: null,
		max: null,
		values: [],
		monthAvg: values
	});
}

export function getTemperatureSeria(data, options) {
	let values = data.reduce(groupByMonth, {});
	let sData = getSeriaValues(values);
	
	if(options.key === 2018) {
		for(let i = sData.values.length; i < 12; i++) {
			sData.values.push({x:i, y:null});
		}
	}

	return {
		...options,
		...sData
	};
}