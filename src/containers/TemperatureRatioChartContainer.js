import { connect } from 'react-redux';
import TemperatureRatioChart from '../components/TemperatureRatioChart/TemperatureRatioChart';
import { getTemperatureRatioChartData } from '../store/selectors';
import { updateActiveYearAndYearsTemperatures } from '../store/actions';

const mapStateToProps = state => ({
	pointID: state.pointID,
	activeYear: state.activeYear,
	isLoading: state.isLoading,
	pointLocation: state.pointLocation,
	temperatureRatioChartData: getTemperatureRatioChartData(state),
	years: [2015, 2016, 2017, 2018]
});

const mapDispatchToProps = dispatch => ({
	updateChart: nextProps => getTemperatureRatioChartData(nextProps),
	handleChangeActiveYear: event =>
		dispatch(updateActiveYearAndYearsTemperatures(Number(event.target.value)))
})

export default connect(mapStateToProps, mapDispatchToProps)(TemperatureRatioChart);