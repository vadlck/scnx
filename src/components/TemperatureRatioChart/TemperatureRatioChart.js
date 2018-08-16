import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import nvd3 from 'nvd3';
import d3 from 'd3';
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
		}
	}

	componentDidMount() {
		const temperatureRatioChartRef = this.refs['temperature-ratio-chart'];
		const node = ReactDOM.findDOMNode(temperatureRatioChartRef);

		nvd3.addGraph(() => {
			const chart = nvd3.models.multiBarChart()
				.margin({
					top: 40,
					right: 30,
					bottom: 0,
					left: 30
				})
				.reduceXTicks(false)
				.showControls(false)
				.stacked(true)
				.legendPosition('bottom')
				.forceY([-50, 50])
				.groupSpacing(0.1);

			chart.yAxis
				.tickValues([-50, -25, 0, 25, 50])
				.tickFormat(v => v.toFixed())

			chart.legend.rightAlign(false)
				.margin({
					top: 0,
					left: 0,
					bottom: 10,
				});

			chart.tooltip.contentGenerator(function (point) {
				return `<div style="background-color: #eff4f7;">
					<h2>${point.data.key}:${point.data.y.toFixed(4)}</h2>
				</div>`;
			})

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