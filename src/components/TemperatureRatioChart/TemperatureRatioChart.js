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
		if (nextProps.temperatureRatioChartData !== this.props.temperatureRatioChartData) {

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
			}
		}
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
				.noData('Нет данных')
				.margin({
					top: 0,
					right: 40,
					bottom: 60,
					left: 40
				})

			chart.xAxis
				.ticks(12)
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

			const d3Chart = d3.select(node);

			d3Chart
				.datum(this.props.temperatureRatioChartData)
				.call(chart);

			nvd3.utils.windowResize(chart.update);

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