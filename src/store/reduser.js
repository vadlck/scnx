import * as types from './types';

const initialState = {
	pointLocation: null,
	pointTemperaturesGroupedByYear: null,
	pointID: null,
	activeYear: 2018,
	isLoading: false
}

export default function reduce(state = initialState, action = {}) {
	switch (action.type) {
		// case types.UPDATE_POINT_ID:
		// 	return { ...state, pointID: action.pointID };

		// case types.UPDATE_ACTIVE_YEAR:
		// 	return { ...state, activeYear: action.activeYear };

		// case types.UPDATE_POINT_LOCATION:
		// 	return { ...state, pointLocation: action.pointLocation };

		// case types.UPDATE_POINT_TEMPERATURES_GROUPED_BY_YEAR_AND_ACTIVE_YEAR:
		// 	return { 
		// 		...state,
		// 		activeYear: action.activeYear, 
		// 		pointTemperaturesGroupedByYear: action.pointTemperaturesGroupedByYear 
		// 	};

		case types.UPDATE_STATE:
			return { ...state, ...action.payload }

		default:
			return state;
	}
}