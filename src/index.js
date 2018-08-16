import 'babel-polyfill';
import './index.scss';

import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import MapContainer from './containers/MapContainer';
import TemperatureRatioChartContainer from './containers/TemperatureRatioChartContainer';

ReactDom.render(
	<Provider store={store}>
		<div className="main-layout">
			<main>
				<MapContainer />
				<TemperatureRatioChartContainer />
			</main>
		</div>
	</Provider>,
	document.getElementById('root')
);