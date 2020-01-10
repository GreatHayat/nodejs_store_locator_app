import React from 'react';
import { Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Create from '@material-ui/icons/Create';
import Delete from '@material-ui/icons/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import http from '../services/httpServices';
import config from '../config/config';
const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white
	},
	body: {
		fontSize: 14
	}
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	root: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default
		}
	}
}))(TableRow);

const useStyles = makeStyles({
	table: {
		minWidth: 700,
		textAlign: 'center'
	}
});

export default function StoresTable({ stores, onDelete, handleApproved }) {
	const classes = useStyles();

	return (
		<React.Fragment>
			<ToastContainer />
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="customized table">
					<TableHead>
						<TableRow>
							<StyledTableCell>Store Name</StyledTableCell>
							<StyledTableCell align="center">City</StyledTableCell>
							<StyledTableCell align="center">Country Code</StyledTableCell>
							<StyledTableCell align="center">State Code</StyledTableCell>
							<StyledTableCell align="center">Zip Code</StyledTableCell>
							<StyledTableCell align="center">Address</StyledTableCell>
							<StyledTableCell align="center">Status</StyledTableCell>
							<StyledTableCell align="center" colSpan="2">
								Action (s)
							</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{stores.length > 0 ? (
							stores.map((store) => (
								<StyledTableRow key={store._id}>
									<StyledTableCell component="th" scope="row">
										{store.name}
									</StyledTableCell>
									<StyledTableCell align="center">{store.location.city}</StyledTableCell>
									<StyledTableCell align="center">{store.location.countryCode}</StyledTableCell>
									<StyledTableCell align="center">{store.location.stateCode}</StyledTableCell>
									<StyledTableCell align="center">{store.location.zipCode}</StyledTableCell>
									<StyledTableCell align="center">{store.address}</StyledTableCell>

									{jwtDecode(localStorage.getItem('token')).isAdmin === true ? (
										<StyledTableCell align="center">
											{store.isApproved === true ? (
												'Approved'
											) : (
												<Button
													type="submit"
													onClick={() => handleApproved(store._id)}
													variant="contained"
													color="primary"
													size="small"
												>
													Approved
												</Button>
											)}
										</StyledTableCell>
									) : (
										<StyledTableCell align="center">
											{store.isApproved === true ? 'Approved' : 'Pending'}
										</StyledTableCell>
									)}

									<StyledTableCell align="center">
										<Link to={`/edit-store/${store._id}`}>
											<Create style={{ cursor: 'pointer' }} />
										</Link>
									</StyledTableCell>
									<StyledTableCell align="center">
										<Delete style={{ cursor: 'pointer' }} onClick={() => onDelete(store._id)} />
									</StyledTableCell>
								</StyledTableRow>
							))
						) : (
							<StyledTableRow>
								<StyledTableCell align="center" colSpan={8} component="th" scope="row">
									You have not created a store yet.
									<br />
									<Link to="/add-store">
										<Button type="submit" variant="contained" color="primary" className="mt-4">
											Add Store
										</Button>
									</Link>
								</StyledTableCell>
							</StyledTableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</React.Fragment>
	);
}
