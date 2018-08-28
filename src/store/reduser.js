import * as types from './types';

export default function reduce(state = {}, action = {}) {
	switch (action.type) {
		case types.UPDATE_STATE:
			return { ...state, ...action.payload }

		default:
			return state;
	}
}