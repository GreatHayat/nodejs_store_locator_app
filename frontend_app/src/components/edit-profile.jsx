import React, { Component } from 'react';
import Joi from 'joi-browser';
import jwtDecode from 'jwt-decode';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import logo from '../static/images/logo.png';
import http from '../services/httpServices';
import config from '../config/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashBoardDrawer from './dashboard-drawer';

class EditProfile extends Component {
	state = {
		user: { username: '', first_name: '', last_name: '', company: '' },
		errors: {},
		error: false,
		error_message: ''
	};
	schema = {
		_id: Joi.string(),
		username: Joi.string().required().label('Username'),
		email: Joi.string(),
		password: Joi.string(),
		first_name: Joi.string().label('First Name'),
		last_name: Joi.string().label('Last Name'),
		company: Joi.string().label('Company'),
		isAdmin: Joi.boolean(),
		isAgree: Joi.boolean(),
		__v: Joi.number().integer()
	};

	validate = () => {
		const result = Joi.validate(this.state.user, this.schema, { abortEarly: false });
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
			const response = await http.get(`${config.apiEndpoint}/api/users/${this.props.match.params.id}`, {
				headers: { 'x-auth-token': localStorage.getItem('token') }
			});
			if (response.status === 200) {
				this.setState({ user: response.data });
			}
			const enc_token = localStorage.getItem('token');
			const token = jwtDecode(enc_token);
			this.setState({ token });
		} catch (ex) {
			if (ex.response && ex.response.status === 404) {
				console.log(ex.response.data);
				this.props.history.push('/login');
			}
		}
	}
	handlechange = ({ currentTarget: input }) => {
		const user = { ...this.state.user };
		user[input.name] = input.value;
		this.setState({ user });
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
		const { user } = this.state;
		const data = {
			username: user.username,
			first_name: user.first_name,
			last_name: user.last_name,
			company: user.company
		};
		try {
			const response = await http.put(`${config.apiEndpoint}/api/users/${this.props.match.params.id}`, data);
			if (response.status === 200) {
				toast.success('Profile updated successfully');
			}
			//this.props.history.push('/dashboard');
		} catch (ex) {
			if (ex.response && ex.response.status === 400) {
				this.setState({ error: true, error_message: ex.response.data });
				toast.error(ex.response.data);
			}
		}
	};
	render() {
		const { user, errors } = this.state;
		return (
			<div>
				<DashBoardDrawer user={this.state.token}>
					<Container
						component="main"
						maxWidth="xs"
						style={{ backgroundColor: '#fff', marginTop: '', padding: '30px', borderRadius: '4px' }}
					>
						<ToastContainer />
						<div className="text-center pb-5">
							<img src={logo} width="300" alt="" />
						</div>
						<CssBaseline />
						<div>
							<form noValidate onSubmit={this.handleSubmit}>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											error={this.state.error}
											id="username"
											label="Username"
											name="username"
											onChange={this.handlechange}
											value={user.username}
											autoComplete="username"
											helperText={errors.username}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											error={this.state.error}
											id="first_name"
											label="First Name"
											name="first_name"
											onChange={this.handlechange}
											value={user.first_name}
											autoComplete="first_name"
											helperText={errors.first_name || this.state.error_message}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											error={this.state.error}
											id="last_name"
											label="Last Name"
											name="last_name"
											onChange={this.handlechange}
											value={user.last_name}
											autoComplete="last_name"
											helperText={errors.last_name}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant="outlined"
											required
											fullWidth
											error={this.state.error}
											name="company"
											label="Company"
											id="company"
											onChange={this.handlechange}
											value={user.company}
											autoComplete="company"
											helperText={errors.company}
										/>
									</Grid>
								</Grid>
								<Button type="submit" fullWidth variant="contained" color="primary" className="mt-4">
									update
								</Button>
							</form>
						</div>
					</Container>
				</DashBoardDrawer>
			</div>
		);
	}
}

export default EditProfile;
