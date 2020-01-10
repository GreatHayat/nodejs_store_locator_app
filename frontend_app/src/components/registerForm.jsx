import React, { Component } from 'react';
import Joi from 'joi-browser';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import logo from '../static/images/logo.png';
import http from '../services/httpServices';
import config from '../config/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class RegisterForm extends Component {
	state = {
		user: { username: '', email: '', password: '', isAgree: true },
		errors: {},
		error: false,
		error_message: ''
	};
	schema = {
		username: Joi.string().required().label('Username'),
		email: Joi.string().required().email().label('Email'),
		password: Joi.string().min(8).required().label('Password'),
		isAgree: Joi.boolean().required()
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
	componentDidMount() {
		document.body.style.backgroundColor = '#273578';
	}
	handlechange = ({ currentTarget: input }) => {
		const user = { ...this.state.user };
		user[input.name] = input.type === 'checkbox' ? input.checked : input.value;
		this.setState({ user });
	};
	handleSubmit = async (e) => {
		e.preventDefault();
		const errors = this.validate();
		this.setState({ errors: errors || {} });
		if (errors) {
			this.setState({ error: true });
			return;
		}
		const { user } = this.state;
		const data = {
			username: user.username,
			email: user.email,
			password: user.password,
			isAgree: user.isAgree
		};
		try {
			await http.post(`${config.apiEndpoint}/api/users`, data);
			this.props.history.push('/login');
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
			<Container
				component="main"
				maxWidth="xs"
				style={{ backgroundColor: '#fff', marginTop: '10%', padding: '30px', borderRadius: '4px' }}
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
									id="email"
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
									id="email"
									label="Email Address"
									name="email"
									onChange={this.handlechange}
									value={user.email}
									autoComplete="email"
									helperText={errors.email || this.state.error_message}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									error={this.state.error}
									name="password"
									label="Password"
									type="password"
									id="password"
									onChange={this.handlechange}
									value={user.password}
									autoComplete="current-password"
									helperText={errors.password}
								/>
							</Grid>
							<Grid item xs={12}>
								<FormControlLabel
									control={
										<Checkbox
											name="isAgree"
											checked={user.isAgree}
											onChange={this.handlechange}
											color="primary"
										/>
									}
									label="I will agree with terms & conditions"
								/>
							</Grid>
						</Grid>
						<Button type="submit" disabled={!user.isAgree} fullWidth variant="contained" color="primary">
							Sign Up
						</Button>
					</form>
					<Grid container justify="center" className="mt-3">
						<Grid item>
							<Link to="/login">Already have an account? Sign in</Link>
						</Grid>
					</Grid>
				</div>
			</Container>
		);
	}
}

export default RegisterForm;
