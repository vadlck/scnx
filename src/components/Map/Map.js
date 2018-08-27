import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import leaflet from 'leaflet';

class Map extends Component {
	componentDidMount() {
		this.loadMap();
	}

	shouldComponentUpdate() {
		return false;
	}

	loadMap() {
		const mapRef = this.refs.map;
		const node = ReactDOM.findDOMNode(mapRef);

		this.map = leaflet.map(node).setView([47.75, 37.61], 4);

		leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidmFkaW1lIiwiYSI6ImNqa3ZuZDUxNzBxMHEzcW51bGtlajJ5cW8ifQ.iwOemPwzmrDx1ba7PSfwTQ', {
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			maxZoom: 18,
			id: 'mapbox.streets',
			accessToken: 'pk.eyJ1IjoidmFkaW1lIiwiYSI6ImNqa3ZuZDUxNzBxMHEzcW51bGtlajJ5cW8ifQ.iwOemPwzmrDx1ba7PSfwTQ'
		}).addTo(this.map);

		this.map.on('click', event => {
			let lat = event.latlng.lat;
			let lng = event.latlng.lng;

			this.activeMarker && this.map.removeLayer(this.activeMarker);
			this.activeMarker = leaflet.marker([lat, lng], {
				icon: leaflet.icon({
					iconUrl: 'marker-icon.png',
				})
			}).addTo(this.map);

			function formatter(loc) {
				const locs = loc.toFixed(2).split('.');
				const rightPart = Math.round(locs[1] / 25) * 25;

				return rightPart === 100
					? ++locs[0]
					: +`${locs[0]}.${rightPart}`;
			}
			this.props.fetchPointTemperature(formatter(lat), formatter(lng));
		})
	}

	render() {
		return <div ref="map" className="map-container" />
	}
}

export default Map;