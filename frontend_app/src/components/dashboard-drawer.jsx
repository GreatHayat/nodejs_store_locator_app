import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Edit from '@material-ui/icons/Edit';
import Room from '@material-ui/icons/Room';
import Home from '@material-ui/icons/Home';
import Store from '@material-ui/icons/Store';
import Fingerprint from '@material-ui/icons/Fingerprint';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Reorder from '@material-ui/icons/Reorder';
import People from '@material-ui/icons/People';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create([ 'width', 'margin' ], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create([ 'width', 'margin' ], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	menuButton: {
		marginRight: 36
	},
	hide: {
		display: 'none'
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap'
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		overflowX: 'hidden',
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9) + 1
		}
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 1),
		...theme.mixins.toolbar
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		marginTop: '-2rem'
	}
}));

export default function DashBoardDrawer(props) {
	const classes = useStyles();
	const theme = useTheme();
	const [ open, setOpen ] = React.useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open
				})}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						className={clsx(classes.menuButton, {
							[classes.hide]: open
						})}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap>
						{props.user && `Welcome ${props.user.username}`}
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: open,
					[classes.drawerClose]: !open
				})}
				classes={{
					paper: clsx({
						[classes.drawerOpen]: open,
						[classes.drawerClose]: !open
					})
				}}
			>
				<div className={classes.toolbar}>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
					</IconButton>
				</div>
				<Divider />
				<List>
					{props.user && (
						<React.Fragment>
							{!props.user.isAdmin && (
								<Link to={`/edit_profile/${props.user._id}`}>
									<ListItem button>
										<ListItemIcon>
											<Edit />
										</ListItemIcon>
										<ListItemText primary="Edit Profile" />
									</ListItem>
								</Link>
							)}
							{props.user.isAdmin && (
								<React.Fragment>
									<Link to="/users">
										<ListItem button>
											<ListItemIcon>
												<People />
											</ListItemIcon>
											<ListItemText primary="All Users" />
										</ListItem>
									</Link>
									<Link to="/all_stores">
										<ListItem button>
											<ListItemIcon>
												<Store />
											</ListItemIcon>
											<ListItemText primary="All Stores" />
										</ListItem>
									</Link>
									<Link to="/approval_requests">
										<ListItem button>
											<ListItemIcon>
												<Fingerprint />
											</ListItemIcon>
											<ListItemText primary="Pending Requests" />
										</ListItem>
									</Link>
								</React.Fragment>
							)}
							<Link to="/add-store">
								<ListItem button>
									<ListItemIcon>
										<Room />
									</ListItemIcon>
									<ListItemText primary="Add Store" />
								</ListItem>
							</Link>
							<Link to="/stores">
								<ListItem button>
									<ListItemIcon>
										<Reorder />
									</ListItemIcon>
									<ListItemText primary="My Stores" />
								</ListItem>
							</Link>
						</React.Fragment>
					)}
				</List>
				<Divider />
				<List>
					{props.user && (
						<React.Fragment>
							{props.user.isAdmin && (
								<Link to={`/edit_profile/${props.user._id}`}>
									<ListItem button>
										<ListItemIcon>
											<Edit />
										</ListItemIcon>
										<ListItemText primary="Edit Profile" />
									</ListItem>
								</Link>
							)}

							<ListItem button onClick={() => (window.location = '/')}>
								<ListItemIcon>
									<Home />
								</ListItemIcon>
								<ListItemText primary="Home" />
							</ListItem>

							<Link to="/logout">
								<ListItem button>
									<ListItemIcon>
										<ExitToApp />
									</ListItemIcon>
									<ListItemText primary="Logout" />
								</ListItem>
							</Link>
						</React.Fragment>
					)}
				</List>
			</Drawer>
			<main className={classes.content}>
				<div className={classes.toolbar} />
				{props.children}
			</main>
		</div>
	);
}
