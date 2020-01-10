import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

class PasswordResetDone extends Component {
	componentDidMount() {
		document.body.style.backgroundColor = '#273578';
	}
	render() {
		return (
			<Container
				component="main"
				maxWidth="xs"
				style={{ backgroundColor: '#fff', marginTop: '10%', padding: '30px', borderRadius: '4px' }}
			>
				<Typography variant="h5" className="text-center mb-3">
					An Email has been sent to your email address, Please confirm that email to reset password
				</Typography>
				<CssBaseline />
				<div>
					<form>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Link to="/login">
									<Button fullWidth variant="contained" color="primary">
										Login
									</Button>
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>
		);
	}
}

export default PasswordResetDone;
