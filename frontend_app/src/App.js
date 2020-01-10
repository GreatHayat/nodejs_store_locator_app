import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Navbar from './components/navbar';
import RegisterForm from './components/registerForm';
import LoginForm from './components/login';
import PasswordResetForm from './components/password-reset';
import PasswordResetDone from './components/password-reset-done';
import PasswordResetComplete from './components/password-reset-complete';
import DashBoard from './components/dashboard';
import ProfileEditForm from './components/edit-profile';
import AddStoreForm from './components/addStore';
import Stores from './components/stores-list';
import EditStoreForm from './components/editStore';
import Mapview from './components/stores-map-view';
import PrivateRoute from './commons/privateRoute';
import Logout from './components/logout';
import Users from './components/allUsers';
import UserStoresList from './components/userStoresList';
import AllStores from './components/stores';
import PendingStores from './components/approvalRequests';
import Home from './components/home';

class App extends Component {
	state = {};
	componentDidMount() {
		try {
			const token = localStorage.getItem('token');
			const user = jwtDecode(token);
			this.setState({ user });
		} catch (ex) {}
	}
	render() {
		return (
			<div style={{ overflow: 'hidden' }}>
				<Navbar user={this.state.user} />
				<Switch>
					<Route path="/register" component={RegisterForm} />
					<Route path="/login" component={LoginForm} />
					<PrivateRoute path="/logout" component={Logout} />
					<PrivateRoute path="/dashboard" component={DashBoard} />
					<PrivateRoute path="/edit_profile/:id" component={ProfileEditForm} />
					<Route path="/password-reset" component={PasswordResetForm} />
					<Route path="/password-reset-done" component={PasswordResetDone} />
					<Route path="/password-reset-complete/:token" component={PasswordResetComplete} />
					<PrivateRoute path="/add-store" component={AddStoreForm} />
					<PrivateRoute path="/edit-store/:id" component={EditStoreForm} />
					<PrivateRoute path="/stores" component={Stores} />
					<PrivateRoute path="/all_stores" component={AllStores} />
					<PrivateRoute path="/approval_requests" component={PendingStores} />
					<PrivateRoute path="/users" component={Users} />
					<PrivateRoute path="/user_stores/:id" component={UserStoresList} />
					<Route path="/map_view" component={Mapview} />
					<Route path="/" component={Home} />
				</Switch>
			</div>
		);
	}
}

export default App;
