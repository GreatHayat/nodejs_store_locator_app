import React, { Component } from 'react';
import jwtDecode from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../services/httpServices';
import config from '../config/config';
import DashBoardDrawer from './dashboard-drawer';
import StoresTable from './table';

class UserStoresList extends Component {
	state = {
		stores: [],
		status: true
	};
	async componentDidMount() {
		document.body.style.backgroundColor = '#273578';
		try {
			const enc_token = localStorage.getItem('token');
			const token = jwtDecode(enc_token);
			const { data } = await http.get(
				`${config.apiEndpoint}/api/store/user_stores/${this.props.match.params.id}`,
				{
					headers: { 'x-auth-token': localStorage.getItem('token') }
				}
			);
			console.log(data);
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
				toast.success('Store deleted Successfully!');
			}
		} catch (ex) {}
	};
	render() {
		return (
			<div>
				<DashBoardDrawer user={this.state.token}>
					<ToastContainer />
					<h2 className="h2 text-white text-center mb-4">User Stores List</h2>
					<StoresTable stores={this.state.stores} onDelete={this.handleDelete} />
				</DashBoardDrawer>
			</div>
		);
	}
}

export default UserStoresList;
