import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import firebase from 'firebase'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 'fit-content',
    margin: theme.spacing(2)
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: theme.spacing(2)
  },
  name: {
    color: 'gray',
  }
}));

const Profile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [user, setUser] = React.useState(null);
  var db = firebase.firestore();
  const current_user = firebase.auth().currentUser
  if (current_user && current_user.uid) {
    db.collection("users").doc(current_user.uid).get().then(res => {
      if (res) setUser(res.data())
    })
  }
  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        src={user && user.avatar}
        to="/settings"
      />
      <div>
        <Typography
          className={classes.name}
          variant="h5"
        >
          Welcome
        </Typography>
        <Typography className={classes.name} variant="body2">{user && user.name}</Typography>
      </div>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
