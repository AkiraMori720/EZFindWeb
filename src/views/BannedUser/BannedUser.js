import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';

import { UsersToolbar, UsersTable } from './components';
import Typography from '@material-ui/core/Typography';
import firebase from 'firebase'

const styles = {
  root: {
    padding: 40,
    paddingTop: 60,
  },
  content: {
    marginTop: 20
  }
};
class UserList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      loading: true
    }
  }
  componentDidMount() {
    var db = firebase.firestore();
    db.collection("users").where('type','in',['buyer', 'seller']).onSnapshot((querySnapshot) => {
      let users = []
      querySnapshot.forEach((doc) => {
        const user = doc.data()
        if (user && user.disabled) {
          users.push({
            ...doc.data(),
            key: doc.id
          })
        }
        else {
          
        }
      });
      this.setState({ users })
    });
  }
  render() {
    const { classes } = this.props
    const { users } = this.state
    return (
      <div className={classes.root}>
        <Typography variant="h4" component="h4">
          Banned Users
        </Typography>
        <br />
        {/*<UsersToolbar />*/}
        <div className={classes.content}>
          <UsersTable users={users} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(UserList);
