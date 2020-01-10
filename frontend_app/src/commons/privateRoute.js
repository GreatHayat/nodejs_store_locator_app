import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
const token = localStorage.getItem('token');

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) => {
			if (token) {
				return <Component {...props} />;
			} else if (jwtDecode(token).isAdmin) {
				return <Redirect to="/map_view" />;
			} else {
				return <Redirect to="/login" />;
			}
		}}
	/>
);
export default PrivateRoute;
