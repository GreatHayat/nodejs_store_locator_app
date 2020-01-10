import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper
	},
	nested: {
		paddingLeft: theme.spacing(4)
	}
}));

export default function ListTemplate({ stores, onViewportChange, history }) {
	const classes = useStyles();

	return (
		<List
			component="nav"
			aria-labelledby="nested-list-subheader"
			subheader={
				<ListSubheader component="div" id="nested-list-subheader">
					Nested List Items
				</ListSubheader>
			}
			className={classes.root}
		>
			{stores.map((store) => (
				<ListItem button key={store._id} onClick={() => onViewportChange(store)}>
					<ListItemText primary={store.name} />
					<ListItemSecondaryAction>
						<Link to={`/edit-store/${store._id}`}>
							<IconButton edge="end" aria-label="delete">
								<Edit />
							</IconButton>
						</Link>
					</ListItemSecondaryAction>
				</ListItem>
			))}
		</List>
	);
}
