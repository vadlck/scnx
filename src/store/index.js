import { createStore, applyMiddleware } from 'redux';
import initialState from './initialState';
import reduser from './reduser';
import thunk from 'redux-thunk';

export default createStore(
	reduser,
	initialState,
	applyMiddleware(thunk)
);