import { createStore, applyMiddleware } from 'redux';
import initialState from './initialState';
import reduser from './reduser';
import thunk from 'redux-thunk';

const store = createStore(
	reduser,
	initialState,
	applyMiddleware(thunk)
);

export default store;