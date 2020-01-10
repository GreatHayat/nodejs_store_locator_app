import React, { Component } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import Joi from 'joi-browser';
import jwtDecode from 'jwt-decode';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import logo from '../static/images/logo.png';
import http from '../services/httpServices';
import config from '../config/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashBoardDrawer from './dashboard-drawer';
import marker from '../static/images/marker.png';
class EditStoreForm extends Component {
	state = {
		store: { name: '', address: '' },
		errors: {},
		error: false,
		error_message: ''
	};
	schema = {
		_id: Joi.string(),
		name: Joi.string().required().label('Store Name'),
		address: Joi.string().required().label('Address')
	};

	validate = () => {
		const result = Joi.validate(this.state.store, this.schema, { abortEarly: false });
		if (!result.error) {
			return null;
		}
		const errors = {};
		for (let item of result.error.details) {
			errors[item.path[0]] = item.message;
		}
		return errors;
	};

	async componentDidMount() {
		document.body.style.backgroundColor = '#273578';
		try {
			const response = await http.get(`${config.apiEndpoint}/api/store/${this.props.match.params.id}`, {
				headers: { 'x-auth-token': localStorage.getItem('token') }
			});
			const enc_token = localStorage.getItem('token');
			const token = jwtDecode(enc_token);
			this.setState({ token, store: response.data });
		} catch (ex) {
			window.location = '/login';
		}
	}
	handlechange = ({ currentTarget: input }) => {
		const store = { ...this.state.store };
		store[input.name] = input.value;
		this.setState({ store });
	};
	handleSubmit = async (e) => {
		e.preventDefault();
		const errors = this.validate();
		console.log(errors);
		this.setState({ errors: errors || {} });
		if (errors) {
			this.setState({ error: true });
			return;
		}
		const { store } = this.state;
		const data = {
			name: store.name,
			address: store.address
		};
		try {
			const response = await http.put(`${config.apiEndpoint}/api/store/${this.props.match.params.id}`, data, {
				headers: { 'x-auth-token': localStorage.getItem('token') }
			});
			if (response.status === 200) {
				this.setState({ data: response.data });
				toast.success(`Store Updated Successfully!`);
			}
		} catch (ex) {
			if (ex.response && ex.response.status === 404) {
				this.setState({ error: true, error_message: ex.response.data });
				toast.error(ex.response.data);
			}
		}
	};
	render() {
		const { store, errors, data } = this.state;
		return (
			<div>
				<DashBoardDrawer user={this.state.token}>
					<ToastContainer />
					<React.Fragment>
						<h2 className="h2 text-white text-center mb-5">Edit Your Store</h2>
					</React.Fragment>
					<Container
						component="main"
						maxWidth="xs"
						style={{ backgroundColor: '#fff', marginTop: '', padding: '30px', borderRadius: '4px' }}
					>
						<div className="text-center pb-5">
							<img src={logo} width="300" alt="" />
						</div>
						<CssBaseline />
						<div>
							<form noValidate onSubmit={this.handleSubmit}>
								<Grid
									container
									direction="row"
									justify="flex-start"
									alignItems="flex-start"
									spacing={2}
								>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											error={this.state.error}
											label="Store Name"
											name="name"
											onChange={this.handlechange}
											value={store.name}
											autoComplete="name"
											helperText={errors.name}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											error={this.state.error}
											label="Store Address"
											name="address"
											onChange={this.handlechange}
											value={store.address}
											autoComplete="address"
											helperText={errors.address}
										/>
									</Grid>
								</Grid>
								<Button type="submit" fullWidth variant="contained" color="primary" className="mt-4">
									update store
								</Button>
							</form>
						</div>
					</Container>
					{data && (
						<div className="row mt-5">
							<div className="col-md-12">
								<h2 className="h2 text-white text-center">Your Store Information</h2>
								<table className="table table-bordered text-center">
									<thead className="table-dark">
										<tr>
											<th>Store Name</th>
											<th>City</th>
											<th>Country Code</th>
											<th>State Code</th>
											<th>Zip Code</th>
											<th>Raw Address</th>
											<th>Formated Address</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody style={{ backgroundColor: '#fff' }}>
										<tr>
											<td>{data.name}</td>
											<td>{data.location.city}</td>
											<td>{data.location.countryCode}</td>
											<td>{data.location.stateCode}</td>
											<td>{data.location.zipCode}</td>
											<td>{data.address}</td>
											<td>{data.location.formated_address}</td>
											<td>{data.isApproved === false ? 'Pending' : 'Published'}</td>
										</tr>
										<tr>
											<td colSpan="8">
												<ReactMapGL
													latitude={data.location.coordinates[1]}
													longitude={data.location.coordinates[0]}
													zoom={12}
													width="100%"
													height="500px"
													mapStyle="mapbox://styles/mapbox/streets-v11"
													mapboxApiAccessToken={config.ACCESS_TOKEN}
												>
													<Marker
														latitude={data.location.coordinates[1]}
														longitude={data.location.coordinates[0]}
													>
														<button>
															<img
																src={marker}
																alt="Location Marker Icon"
																width="20"
																height="20"
															/>
														</button>
													</Marker>
												</ReactMapGL>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					)}
				</DashBoardDrawer>
			</div>
		);
	}
}

export default EditStoreForm;
