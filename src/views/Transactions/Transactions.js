import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';

import { TransactionsToolbar, TransactionsTable } from './components';
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
class Transactions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      transactions: [],
      loading: true
    }
  }
  componentDidMount() {
    var db = firebase.firestore();
    db.collection("transactions").onSnapshot((querySnapshot) => {
      let transactions = []
      querySnapshot.forEach((doc) => {
        transactions.push({
          ...doc.data(),
          key: doc.id
        })
      });
      this.setState({ transactions })
    });
  }
  render() {
    const { classes } = this.props
    const { transactions } = this.state
    return (
      <div className={classes.root}>
        <Typography variant="h4" component="h4">
          Transactions
        </Typography>
        <br />
        {/*<TransactionsToolbar />*/}
        <div className={classes.content}>
          <TransactionsTable arbitrations={transactions} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Transactions);
