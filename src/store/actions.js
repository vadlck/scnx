import axios from 'axios';
import * as types from './types';
import initialState from './initialState';

async function getLocationPointID(lat, lng) {
	const urlOfGetPointIDByLocation = `https://maps.kosmosnimki.ru/rest/ver1/layers/35FB2C338FED4B64B7A326FBFE54BE73/
		search?query=%22lat%22=${lat}and%22lon%22=${lng}&apikey=6Q81IXBUQ7&WrapStyle=json`;

	return axios.get(urlOfGetPointIDByLocation);
}

async function getDayTemperaturesOfYearsByPointID(activeYear, pointID) {
	const getYearURL = year =>
		`https://maps.kosmosnimki.ru/rest/ver1/layers/11A381497B4A4AE4A4ED6580E1674B72/search?
			query=year(%22date%22)=${year}%20and%20%22gridpoint_id%22=${pointID}&apikey=6Q81IXBUQ7`;

	const years = await Promise.all(initialState.defaultYears.map(year => axios.get(getYearURL(year))));
	const getFeatures = response => response.data ? response.data.features : [];

	let temperaturesGroupedByYear = {
		...years.reduce((res, year, i) => {
			res[initialState.defaultYears[i]] = getFeatures(year);
			return res;
		}, {})
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