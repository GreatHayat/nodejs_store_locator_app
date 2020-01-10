import React, { Component } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import map from '../static/images/map.jpg';
import http from '../services/httpServices';
import config from '../config/config';
import marker from '../static/images/marker.png';
class Home extends Component {
	state = {
		map: {
			width: '100%',
			height: '50vh',
			longitude: 4.402771,
			latitude: 51.260197,
			zoom: 2
		},
		stores: []
	};

	render() {
		const { stores } = this.state;
		return (
			<div>
				<div className="row">
					<div className="col-md-12" style={{ width: '100%', height: '500px' }}>
						<img src={map} style={{ width: '100%', height: '500px' }} alt="" />
					</div>
				</div>
				<br />
				<div className="container mt-5 mb-5" style={{ marginTop: '4rem' }}>
					<div className="row">
						<div className="col-md-4">
							<ul className="list-group">
								{stores.map((store) => (
									<li className="list-group-item" key={store._id}>
										{store.name}
									</li>
								))}
							</ul>
						</div>
						<div className="col-md-8">
							<ReactMapGL
								{...this.state.map}
								onViewportChange={(map) => this.setState({ map })}
								mapStyle="mapbox://styles/mapbox/streets-v11"
								mapboxApiAccessToken={config.ACCESS_TOKEN}
							>
								{this.state.stores.map((store) => (
									<Marker
										key={store._id}
										latitude={store.location.coordinates[1]}
										longitude={store.location.coordinates[0]}
									>
										<button>
											<img src={marker} alt="Location Marker Icon" width="20" height="20" />
										</button>
									</Marker>
								))}
							</ReactMapGL>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
