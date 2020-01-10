import React from 'react';
import { Link, Redirect } from 'react-router-dom';
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
import Visibility from '@material-ui/icons/Visibility';
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

export default function UsersTable({ users, onDelete }) {
	const classes = useStyles();

	return (
		<TableContainer component={Paper}>
			<Table className={classes.table} aria-label="customized table">
				<TableHead>
					<TableRow>
						<StyledTableCell>Email</StyledTableCell>
						<StyledTableCell align="center">Username</StyledTableCell>
						<StyledTableCell align="center">First Name</StyledTableCell>
						<StyledTableCell align="center">Last Name</StyledTableCell>
						<StyledTableCell align="center">Company</StyledTableCell>
						<StyledTableCell align="center">User Status</StyledTableCell>
						<StyledTableCell align="center">Stores</StyledTableCell>
						<StyledTableCell align="center" colSpan="2">
							Action (s)
						</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{users ? (
						users.map((user) => (
							<StyledTableRow key={user._id}>
								<StyledTableCell component="th" scope="row">
									{user.email}
								</StyledTableCell>
								<StyledTableCell align="center">{user.username}</StyledTableCell>
								<StyledTableCell align="center">{user.first_name}</StyledTableCell>
								<StyledTableCell align="center">{user.last_name}</StyledTableCell>
								<StyledTableCell align="center">{user.company}</StyledTableCell>
								<StyledTableCell align="center">
									{user.isAdmin === true ? 'Admin' : 'Standard'}
								</StyledTableCell>
								<StyledTableCell align="center">
									<Link to={`/user_stores/${user._id}`}>
										<Visibility style={{ cursor: 'pointer' }} />
									</Link>
								</StyledTableCell>
								<StyledTableCell align="center">
									<Link to={`/edit_profile/${user._id}`}>
										<Create style={{ cursor: 'pointer' }} />
									</Link>
								</StyledTableCell>
								<StyledTableCell align="center">
									<Delete
										style={{ cursor: 'pointer', color: 'red' }}
										onClick={() => onDelete(user._id)}
									/>
								</StyledTableCell>
							</StyledTableRow>
						))
					) : (
						<StyledTableRow>
							<StyledTableCell align="center" colSpan={8} component="th" scope="row">
								There are no users data to show
							</StyledTableCell>
						</StyledTableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
