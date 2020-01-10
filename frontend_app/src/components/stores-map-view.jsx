import React, { Component } from 'react';
import jwtDecode from 'jwt-decode';
import ReactMapGL, { Marker, FlyToInterpolator, Popup } from 'react-map-gl';
import http from '../services/httpServices';
import config from '../config/config';
import DashBoardDrawer from './dashboard-drawer';
import ListTemplate from './list-template';
import marker from '../static/images/marker.png';
class Mapview extends Component {
	state = {
		map: {
			width: '100%',
			height: '80vh',
			longitude: 4.402771,
			latitude: 51.260197,
			zoom: 2
		},
		selectedStore: null,
		stores: []
	};
	async componentDidMount() {
		document.body.style.backgroundColor = '#273578';
		const { data } = await http.get(`${config.apiEndpoint}/api/store`, {
			headers: { 'x-auth-token': localStorage.getItem('token') }
		});
		this.setState({ stores: data });
		try {
			const enc_token = localStorage.getItem('token');
			const token = jwtDecode(enc_token);
			this.setState({ token });
		} catch (ex) {
			window.location = '/login';
		}
	}
	_onViewportChange = (map) =>
		this.setState({
			map: { ...this.state.map, ...map }
		});
	goToViewport = (store) => {
		this._onViewportChange({
			longitude: store.location.coordinates[0],
			latitude: store.location.coordinates[1],
			width: '100%',
			height: '80vh',
			zoom: 12,
			transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
			transitionDuration: 'auto'
		});
	};
	render() {
		const { selectedStore, stores, map } = this.state;
		return (
			<div>
				<DashBoardDrawer user={this.state.token}>
					<div className="row">
						<div className="col-md-4">
							<ListTemplate stores={stores} onViewportChange={this.goToViewport} />
						</div>
						<div className="col-md-8">
							<ReactMapGL
								{...map}
								onViewportChange={this._onViewportChange}
								mapStyle="mapbox://styles/mapbox/streets-v11"
								mapboxApiAccessToken={config.ACCESS_TOKEN}
							>
								{stores.map((store) => (
									<Marker
										key={store._id}
										latitude={store.location.coordinates[1]}
										longitude={store.location.coordinates[0]}
									>
										<button
											onClick={(e) => {
												e.preventDefault();
												this.setState({ selectedStore: store });
											}}
										>
											<img src={marker} alt="Location Marker Icon" width="20" height="20" />
										</button>
									</Marker>
								))}
								{selectedStore ? (
									<Popup
										latitude={selectedStore.location.coordinates[1]}
										longitude={selectedStore.location.coordinates[0]}
										onClose={() => this.setState({ selectedStore: null })}
										className="p-2"
									>
										<div>
											<div className="card mt-3">
												<div className="card-header text-center">{selectedStore.name}</div>
												<div className="card-body">{selectedStore.address}</div>
											</div>
										</div>
									</Popup>
								) : null}
							</ReactMapGL>
						</div>
					</div>
				</DashBoardDrawer>
			</div>
		);
	}
}

export default Mapview;
