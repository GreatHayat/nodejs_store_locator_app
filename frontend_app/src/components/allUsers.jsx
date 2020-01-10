import React, { Component } from 'react';
import jwtDecode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../services/httpServices';
import config from '../config/config';
import DashBoardDrawer from './dashboard-drawer';
import UsersTable from './usersTable';

class Users extends Component {
	state = {
		users: []
	};
	async componentDidMount() {
		document.body.style.backgroundColor = '#273578';
		const { data } = await http.get(`${config.apiEndpoint}/api/users`, {
			headers: { 'x-auth-token': localStorage.getItem('token') }
		});
		this.setState({ users: data });
		try {
			const enc_token = localStorage.getItem('token');
			const token = jwtDecode(enc_token);
			this.setState({ token });
		} catch (ex) {
			window.location = '/login';
		}
	}
	handleDelete = async (userId) => {
		try {
			const response = await http.delete(`${config.apiEndpoint}/api/users/${userId}`, {
				headers: { 'x-auth-token': localStorage.getItem('token') }
			});
			if (response.status === 200) {
				const users = this.state.users.filter((user) => user._id !== userId);
				this.setState({ users });
				toast('User deleted Successfully!');
			}
		} catch (ex) {}
	};
	render() {
		return (
			<div>
				<DashBoardDrawer user={this.state.token}>
					<ToastContainer />
					<h2 className="h2 text-center text-white">List of Users</h2>
					<UsersTable users={this.state.users} onDelete={this.handleDelete} />
				</DashBoardDrawer>
			</div>
		);
	}
}

export default Users;
