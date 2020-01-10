import React, { Component } from 'react';
import Joi from 'joi-browser';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../services/httpServices';
import config from '../config/config';
class PasswordResetComplete extends Component {
	state = {
		user: { email: '', password: '' },
		errors: {},
		error: false
	};
	schema = {
		email: Joi.string().required().email().label('Email'),
		password: Joi.string().required().label('Password')
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
			const { data } = await http.get(
				`${config.apiEndpoint}/api/password-reset-done/${this.props.match.params.token}`
			);
			this.setState({ user: { email: data, password: '' } });
		} catch (ex) {
			if (ex.response && ex.response.status === 404) {
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
		this.setState({ errors: errors || {} });
		if (errors) {
			this.setState({ error: true });
			return;
		}
		const { user } = this.state;
		const data = {
			email: user.email,
			password: user.password
		};
		try {
			const response = await http.post(`${config.apiEndpoint}/api/password-reset-complete`, data);
			if (response.status === 200) {
				toast.primary(response.data);
			}
			//this.props.history.push('/login');
		} catch (ex) {
			if (ex.response && ex.response.status === 404) {
				this.setState({ error: true });
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
				<Typography variant="h6" className="text-center mb-3">
					Reset Your Password
				</Typography>
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
									label="Email Address"
									name="email"
									onChange={this.handlechange}
									value={user.email}
									autoComplete="email"
									helperText={errors.email}
									disabled
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
								<Button type="submit" fullWidth variant="contained" color="primary">
									RESET PASSWORD
								</Button>
							</Grid>
						</Grid>
					</form>
					<Grid container justify="center" className="mt-3">
						<Grid item>
							<Link to="/register">Don't have an account? Register</Link>
						</Grid>
					</Grid>
				</div>
			</Container>
		);
	}
}

export default PasswordResetComplete;
