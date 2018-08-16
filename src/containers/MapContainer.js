import { connect } from 'react-redux';
import Map from '../components/Map/Map';
import { fetchPointWithYearsTemperatures } from '../store/actions';

const mapDispatchToProps = dispatch => ({
	fetchPointTemperature: (lat, lng) =>
		dispatch(fetchPointWithYearsTemperatures(lat, lng))
});

export default connect(null, mapDispatchToProps)(Map);