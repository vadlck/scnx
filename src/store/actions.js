import axios from 'axios';
import * as types from './types';

async function getLocationPointID(lat, lng) {
	const urlOfGetPointIDByLocation = `http://maps.kosmosnimki.ru/rest/ver1/layers/35FB2C338FED4B64B7A326FBFE54BE73/
		search?query=%22lat%22=${lat}and%22lon%22=${lng}&apikey=6Q81IXBUQ7&WrapStyle=json`;

	return axios.get(urlOfGetPointIDByLocation);
}

async function getDayTemperaturesOfYearsByPointID(activeYear, pointID) {
	const getUrlOfPointDayTemperaturesByYear = year =>
		`http://maps.kosmosnimki.ru/rest/ver1/layers/11A381497B4A4AE4A4ED6580E1674B72/search?
			query=year(%22date%22)=${year}%20and%20%22gridpoint_id%22=${pointID}&apikey=6Q81IXBUQ7`;

	const previousYear = activeYear - 1;

	const urlOfGetActiveYearPointDayTemperatures = getUrlOfPointDayTemperaturesByYear(activeYear);
	const urlOfPreviousYearPointDayTemperatures = getUrlOfPointDayTemperaturesByYear(previousYear);

	const [previousYearTemperatures, activeYearTemperatures] =
		await Promise.all([
			axios.get(urlOfPreviousYearPointDayTemperatures),
			axios.get(urlOfGetActiveYearPointDayTemperatures)
		]);

	const getFeatures = data =>
		data ? data.features : [];

	let temperaturesGroupedByYear = {
		[activeYear]: getFeatures(activeYearTemperatures.data),
		[previousYear]: getFeatures(previousYearTemperatures.data)
	}

	return temperaturesGroupedByYear;
}

export function fetchPointWithYearsTemperatures(lat, lng) {
	return async (dispatch, getState) => {
		dispatch(updateState({ isLoading: true }))
		const { data } = await getLocationPointID(lat, lng);

		const pointID = data.features
			&& data.features[0]
			&& data.features[0].properties['gmx_id'];

		if (pointID) {
			const activeYear = getState().activeYear;
			let pointTemperaturesGroupedByYear = await getDayTemperaturesOfYearsByPointID(activeYear, pointID);
			dispatch(updateState({
				pointID,
				pointTemperaturesGroupedByYear,
				isLoading: false,
				pointLocation: {
					lat,
					lng
				}
			}))
		} else {
			dispatch(updateState({
				pointID: null,
				pointTemperaturesGroupedByYear: null,
				isLoading: false,
				pointLocation: {
					lat,
					lng
				}
			}))
		}
	}
}

export function updateActiveYearAndYearsTemperatures(activeYear) {
	return async (dispatch, getState) => {
		const pointID = getState().pointID;
		const pointTemperaturesGroupedByYear = await getDayTemperaturesOfYearsByPointID(activeYear, pointID);

		dispatch(updateState({
			pointTemperaturesGroupedByYear,
			activeYear
		}));
	}
}

export function updateState(payload) {
	return {
		type: types.UPDATE_STATE,
		payload
	}
}