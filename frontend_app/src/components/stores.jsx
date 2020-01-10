import React, { Component } from 'react';
import jwtDecode from 'jwt-decode';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DashBoardDrawer from './dashboard-drawer';
import config from '../config/config';
import http from '../services/httpServices';
import StoresTable from './table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Mapview from './stores-map-view';

class AllStores extends Component {
	state = {
		stores: [],
		status: true
	};
	handleChange = (event) => {
		this.setState({ status: event.target.checked });
	};
	async componentDidMount() {
		document.body.style.backgroundColor = '#273578';
		try {
			const { data } = await http.get(`${config.apiEndpoint}/api/store`, {
				headers: { 'x-auth-token': localStorage.getItem('token') }
			});
			const enc_token = localStorage.getItem('token');
			const token = jwtDecode(enc_token);

			this.setState({ stores: data, token });
		} catch (ex) {
			window.location = '/login';
		}
	}
	handleDelete = async (storeId) => {
		try {
			const response = await http.delete(`${config.apiEndpoint}/api/store/${storeId}`, {
				headers: { 'x-auth-token': localStorage.getItem('token') }
			});
			if (response.status === 200) {
				const stores = this.state.stores.filter((store) => store._id !== storeId);
				this.setState({ stores });
				toast('Store deleted Successfully!');
			}
		} catch (ex) {}
	};
	render() {
		return (
			<div>
				<DashBoardDrawer user={this.state.token}>
					<ToastContainer />
					{this.state.stores.length > 0 && (
						<FormControl className="float-right text-white">
							<FormGroup>
								<FormControlLabel
									control={
										<Switch
											checked={this.state.status}
											onChange={this.handleChange}
											value={this.state.status}
											color="secondary"
										/>
									}
									label={this.state.status === true ? 'Map View' : 'List View'}
								/>
							</FormGroup>
						</FormControl>
					)}

					{this.state.status === true ? (
						<StoresTable stores={this.state.stores} onDelete={this.handleDelete} />
					) : (
						<Mapview />
					)}
				</DashBoardDrawer>
			</div>
		);
	}
}

export default AllStores;
