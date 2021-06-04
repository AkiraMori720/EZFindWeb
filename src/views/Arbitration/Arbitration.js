import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';

import { ArbitrationsToolbar, ArbitrationsTable } from './components';
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
class Arbitration extends Component {
  constructor(props) {
    super(props)
    this.state = {
      arbitrations: [],
      loading: true
    }
  }
  componentDidMount() {
    var db = firebase.firestore();
    db.collection("arbitrations").onSnapshot((querySnapshot) => {
      let arbitrations = []
      querySnapshot.forEach((doc) => {
        arbitrations.push({
          ...doc.data(),
          key: doc.id
        })
      });
      this.setState({ arbitrations })
    });
  }
  render() {
    const { classes } = this.props
    const { arbitrations } = this.state
    return (
      <div className={classes.root}>
        <Typography variant="h4" component="h4">
          Arbitration Cases
        </Typography>
        <br />
        {/*<ArbitrationsToolbar />*/}
        <div className={classes.content}>
          <ArbitrationsTable arbitrations={arbitrations} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Arbitration);
