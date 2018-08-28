import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import nvd3 from '../../libs/nvd3';
import Spinner from '../Spinner/Spinner';

class TemperatureRatioChart extends Component {
	shouldComponentUpdate(nextProps) {
		return nextProps.isLoading !== this.props.isLoading;
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.isLoading && nextProps.temperatureRatioChartData !== this.props.temperatureRatioChartData) {

			this.d3Chart
				.datum(nextProps.temperatureRatioChartData)
				.call(this.nvChart)

			let domain = nextProps.temperatureRatioChartData.length
				&& [
					Math.min(nextProps.temperatureRatioChartData[0].min, nextProps.temperatureRatioChartData[1].min) - 2,
					Math.max(nextProps.temperatureRatioChartData[0].max, nextProps.temperatureRatioChartData[1].max) + 2,
				];

			if (domain) {
				domain = [domain[0].toFixed(), domain[1].toFixed()];

				this.nvChart.yDomain1(domain);
				this.nvChart.yDomain2(domain);
				this.nvChart.update();

				this.whenUpdate(nextProps);
			}
		}
	}

	whenUpdate(nextProps) {
		let y = this.nvChart.yAxis1.scale();
		let getY = function (d) { return d.y }
		let n = 0;
		let x = this.nvChart.xAxis.scale();
		let getX = function (d) { return d.x }

		let series1 = [
			...nextProps.temperatureRatioChartData[0].values,
			...nextProps.temperatureRatioChartData[1].values
		]

		let series = series1.map((d, i) => Math.max(Math.abs(y(getY(d, i)) - y(0)), 1) || 0)

		let len = nextProps.temperatureRatioChartData[0].values.length * 2;

		let k = new Array(len);
		let test = {};

		Array.apply(null, { length: len / 2 })
			.map((item, i) => {
				let s1 = series[i];
				let s2 = series[i + len / 2];

				if (parseInt(series1[i].y) > 0 && parseInt(series1[i + len / 2].y) < 0
					|| parseInt(series1[i].y) < 0 && parseInt(series1[i + len / 2].y) > 0) {

					k[i] = s1;
					k[i + len / 2] = s2;

					return;
				}

				if (s1 < 0) {
					if ((-1 * s1) < (-1 * s2)) {
						k[i] = s1;
						k[i + len / 2] = s2 - (s1 * -1);
					} else {
						k[i] = s1 - (s2 * -1);
						k[i + len / 2] = s2;
					}

				} else {
					if (s1 < s2) {
						k[i] = s1;
						k[i + len / 2] = s2 - s1;

						test[i + len / 2] = series1[i].y < 0 && s1;

					} else {
						k[i] = s1 - s2;
						k[i + len / 2] = s2;

						test[i] = series1[i].y < 0 && s2;
					}
				}
			})

		setTimeout(() => {
			this.d3Chart
				.selectAll('.nv-bar')
				.each(function (el, i) {
					this.setAttribute('height', k[i]);
					if (test[i]) {
						let maxTransform = this.getAttribute('transform').split(',');
						maxTransform[1] = parseFloat(test[i]) + ')';
						this.setAttribute('transform', maxTransform.join(','));
					}
				})
		}, 600);
	}

	componentDidMount() {
		const temperatureRatioChartRef = this.refs['temperature-ratio-chart'];
		const node = ReactDOM.findDOMNode(temperatureRatioChartRef);

		const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май',
			'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'].map(m => m.slice(0, 3));

		nvd3.addGraph(() => {

			const chart = nvd3.models.multiChart()
				.options({
					reduceXTicks: false,
					legendPosition: 'bottom',
					legendRightAxisHint: ''
				})
				.duration(0)
				.noData('Нет данных')
				.margin({
					top: 0,
					right: 40,
					bottom: 60,
					left: 40
				})

				chart.xAxis
				//.ticks(this.props.activeYear === 2018 ? 8 : 12)
				.tickFormat(function (month) {
					return months[month];
				})

			chart.legend
				.alignPos('left')
				.margin({
					top: 115,
					left: 0,
					bottom: -80,
					right: 0
				});

			chart.legend.dispatch.on('legendClick', serie => {
				if (serie.disabled)
					this.whenUpdate(this.props)
			});

			const d3Chart = d3.select(node);

			d3Chart
				.datum(this.props.temperatureRatioChartData)
				.call(chart);


			this.nvChart = chart;
			this.d3Chart = d3Chart;

			return chart;
		});
	}

	renderLocation() {
		return this.props.pointLocation
			&& <Fragment>
				<div>
					<label>Широта:</label>
					<input readOnly value={this.props.pointLocation.lat} />
				</div>
				<div>
					<label>Долгота:</label>
					<input readOnly value={this.props.pointLocation.lng} />
				</div>
			</Fragment>
	}

	render() {
		return <div className="temperature-ratio-chart-container">
			<select onChange={this.props.handleChangeActiveYear} defaultValue={this.props.activeYear}>
				{this.props.years.map((year, i) =>
					<option
						value={year}
						key={i}>
						{year}
					</option>
				)}
			</select>
			<svg width="100%" height="100%" ref="temperature-ratio-chart" />
			<div className="temperature-ratio-chart__location">
				{this.renderLocation()}
			</div>
			<Spinner isShown={this.props.isLoading} />
		</div>
	}
}

export default TemperatureRatioChart;