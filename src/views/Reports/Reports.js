import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';

import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import firebase from 'firebase'
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionActions from '@material-ui/core/AccordionActions';
import Divider from '@material-ui/core/Divider';

const styles = {
  root: {
    padding: 40,
    paddingTop: 60,
  },
  content: {
    backgroundColor: '#F7FCFD'
  },
  listitem: {
    padding: "20px 40px",
  },
  listitemtext: {
    borderBottom: 'gray solid 1px',
    padding: "10px 0px",
  },
  heading: {
    fontSize: 15,
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: 15,
    color: 'gray',
  },
};

class Reports extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reports: [],
      loading: true
    }
  }
  componentDidMount() {
    var db = firebase.firestore();
    db.collection("feedbacks").onSnapshot((querySnapshot) => {
      let reports = []
      querySnapshot.forEach((doc) => {
        reports.push({
          ...doc.data(),
          key: doc.id
        })
      });
      this.setState({ reports })
    });
  }
  render() {
    const { classes } = this.props
    const { reports } = this.state
    
    return (
      <div className={classes.root}>
        <Typography variant="h4" component="h4">
          Today
      </Typography>
        <br />
        <div className={classes.content}>
          {
            reports.map(item => {
              return (
                <Accordion key={item.key}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography className={classes.heading}>{item.subject}</Typography>
                    <Typography className={classes.secondaryHeading}>{item.name}</Typography>
                  </AccordionSummary>
                  <Divider />
                  <AccordionDetails>
                    <Typography>
                      {item.message}
                    </Typography>
                  </AccordionDetails>
                  <Divider />
                  <AccordionActions>
                    <Typography className={classes.secondaryHeading}>{item.email}</Typography>
                  </AccordionActions>
                </Accordion>
              )
            })
          }
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(Reports);