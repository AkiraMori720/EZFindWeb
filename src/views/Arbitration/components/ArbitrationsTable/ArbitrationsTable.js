import React, { Component } from 'react';
import clsx from 'clsx';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withStyles } from '@material-ui/styles';
import {
  Card,
  Grid,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  TextField,
  Snackbar,
  Chip
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
import firebase from 'firebase'

const create_refund_url = 'https://us-central1-the-shuk-marketplace.cloudfunctions.net/createRefund'

const FINAL_PAYOUTS = ['none', 'payout to buyer', 'payout to seller', 'processing']
const styles = {
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: '20px'
  },
  actions: {
    justifyContent: 'flex-end'
  },
  card_header: {
    margin: "20px 0px"
  },
  arbitration_box: {
    border: '1px solid #eeeeee',
    padding: '10px 30px',
    borderRadius: '5px',
    marginTop: '20px'
  }
};
class ArbitrationsTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rowsPerPage: 10,
      page: 0,
      openItem: null,
      loading: false,
      details: null,
      buyer: null,
      seller: null,

      final_payout: 0,
      admin_reply: '',
      openBar: false,
      error: ''
    }
  }
  handlePageChange = (event, page) => {
    this.setState({ page })
  };

  handleRowsPerPageChange = event => {
    this.setState({ rowsPerPage: event.target.value })
  };
  openRow(row) {
    this.setState({ openItem: row.key, loading: true, final_payout: row.final_payout != null ? FINAL_PAYOUTS.indexOf(row.final_payout) : 0, admin_reply: row.admin_reply != null ? row.admin_reply : '' })
    var db = firebase.firestore();
    db.collection("transactions").doc(row.transaction).onSnapshot(async (doc) => {
      const transaction = doc.data();
      if (transaction) {
        var db = firebase.firestore();
        const buyer = await db.collection("users").doc(transaction.buyer).get()
        const seller = await db.collection("users").doc(transaction.createdby).get()
        this.setState({ details: transaction, loading: false, buyer: buyer && buyer.data(), seller: seller && seller.data() })
      } else {
        this.setState({ details: null, loading: false, buyer: null, seller: null })
      }
    });
  }
  async onSubmit(arbitration, transaction) {
    const { final_payout, admin_reply } = this.state
    if (admin_reply && admin_reply.length > 0) {
      if (transaction && transaction.in_transaction && final_payout == 0) {
        this.setState({ openBar: true, error: 'please select final payout option' })
        return
      }
      this.setState({ loading: true })
      var refund_id = null
      if (final_payout == 1 && transaction && transaction.in_transaction) {
        const result = await fetch(create_refund_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ charge_id: transaction.in_transaction.id })
        })
        const resp = await result.json()
        if (resp.status != "succeeded") {
          this.setState({ loading: false, openBar: true, error: resp.raw && resp.raw.message ? resp.raw.message : 'failed refund' })
          return
        }
        refund_id = resp && resp.id
      }
      var db = firebase.firestore();
      db.collection('arbitrations').doc(arbitration.key).update({
        pending: false,
        final_payout: FINAL_PAYOUTS[final_payout],
        admin_reply,
        refund_id
      }).then(res => {
        this.setState({ loading: false })
      })
    } else this.setState({ openBar: true, error: 'please fill out Reply field.' })
  }
  renderRow(row) {
    const { openItem, loading, details, buyer, seller, final_payout, admin_reply } = this.state
    const { classes } = this.props
    const open = openItem === row.key

    return (
      <React.Fragment key={row.key}>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => {
              if (open) this.setState({ openItem: null })
              else this.openRow(row)
            }}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{row.name || '---'}</TableCell>
          <TableCell>{row.yourcase}</TableCell>
          <TableCell>{row.outcome}</TableCell>
          <TableCell>
            {row.transaction}
          </TableCell>
          <TableCell>
            <Chip
              style={{ backgroundColor: row.pending ? 'red' : 'blue', color: row.pending ? 'white' : 'white' }}
              label={row.pending ? 'PENDING' : 'CLOSED'}
            />
          </TableCell>
          <TableCell>
            {moment(new Date(+row.createdat)).format('DD/MM/YYYY')}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                {
                  loading ? <div style={{ textAlign: 'center', width: '100%' }}>
                    <CircularProgress size={20} />
                  </div> :
                    <div>
                      {
                        details ?
                          <div style={{ width: '100%' }}>
                            <Card style={{ maxWidth: 700, margin: 'auto' }}>
                              <CardContent>
                                <Typography variant="h5" color="error" className={classes.card_header}>
                                  {`ARBITRATION REQUESTED BY: ${row.name ? row.name : ' ---'}`}
                                </Typography>
                                <Grid
                                  container
                                >
                                  <Grid item xs={12} sm={4}>
                                    <img
                                      alt="product image"
                                      src={details.photo && details.photo.length > 0 && details.photo[0]}
                                      style={{ maxHeight: 150 }}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={8}>
                                    <Typography variant="h3" color="error" className={classes.card_header}>
                                      {`${details.title}`}
                                    </Typography>
                                    <Typography variant="h5">
                                      {`Item Number: ${details.product_id}`}
                                    </Typography>
                                    <Grid
                                      container
                                      className={classes.card_header}
                                    >
                                      <Grid item xs={6}>
                                        <Typography variant="h6" color="error">
                                          {`Seller: ${seller && seller.name}`}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={6}>
                                        <Typography variant="h6" color="error">
                                          {`Buyer: ${buyer && buyer.name}`}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Divider />
                                <List>
                                  <ListItem>
                                    <ListItemText
                                      primary={"Price"}
                                    />
                                    <ListItemSecondaryAction>
                                      <Typography variant="h6" color="primary">
                                        {`$${details.price}`}
                                      </Typography>
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                  <ListItem>
                                    <ListItemText
                                      primary={"Processing Fee"}
                                    />
                                    <ListItemSecondaryAction>
                                      <Typography variant="h6" color="primary">
                                        {`$${(details.price * 0.1).toFixed(2)}`}
                                      </Typography>
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                  <ListItem>
                                    <ListItemText
                                      primary={'Pay Out'}
                                    />
                                    <ListItemSecondaryAction>
                                      <Typography variant="h6" color="primary">
                                        {`$${(details.price * 0.9).toFixed(2)}`}
                                      </Typography>
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                </List>
                                <Divider />
                                <Box className={classes.arbitration_box}>
                                  <Typography variant="h6" color="error" className={classes.card_header}>
                                    {`Buyer Case`}
                                  </Typography>
                                  <Typography variant="h6" color="textPrimary">
                                    {`${row.yourcase}`}
                                  </Typography>
                                  <Typography variant="h6" color="error" className={classes.card_header}>
                                    {`Buyer Preferred Outcome`}
                                  </Typography>
                                  <Typography variant="h6" color="textPrimary">
                                    {`${row.outcome}`}
                                  </Typography>
                                  <Grid
                                    container
                                    className={classes.card_header}
                                  >
                                    {
                                      row.photo && row.photo.length > 0 ?
                                        row.photo.map(image => {
                                          return (
                                            <Grid item key={image} xs={12} sm={6}>
                                              <img
                                                alt="product image"
                                                src={image}
                                                style={{ maxHeight: 200 }}
                                              />
                                            </Grid>
                                          )
                                        })
                                        : null
                                    }
                                  </Grid>
                                </Box>
                                <Typography variant="h6" color="error" className={classes.card_header}>
                                  {`ADMIN REPLY TO BOTH PARTIES`}
                                </Typography>
                                <TextField
                                  id="filled-full-width"
                                  style={{ margin: 8 }}
                                  placeholder="Enter text here..."
                                  //helperText="Full width!"
                                  fullWidth
                                  margin="normal"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  multiline
                                  rows={4}
                                  variant="outlined"
                                  value={admin_reply}
                                  onChange={(e) => this.setState({ admin_reply: e.target.value })}
                                  disabled={!row.pending}
                                />
                                {
                                  details && details.in_transaction &&
                                  <>
                                    <Typography variant="h6" color="error" className={classes.card_header}>
                                      {`FINAL PAYOUT`}
                                    </Typography>
                                    <Grid
                                      container
                                    >
                                      <Grid item sm={4} style={{ textAlign: 'center' }}>
                                        <Button
                                          color={final_payout == 1 ? 'primary' : "default"}
                                          variant="contained"
                                          onClick={() => { row.pending && this.setState({ final_payout: 1 }) }}
                                        >
                                          {'Payout to Buyer'}
                                        </Button>
                                      </Grid>
                                      <Grid item sm={4} style={{ textAlign: 'center' }}>
                                        <Button
                                          color={final_payout == 2 ? 'primary' : "default"}
                                          variant="contained"
                                          onClick={() => { row.pending && this.setState({ final_payout: 2 }) }}
                                        >
                                          {'Payout to Seller'}
                                        </Button>
                                      </Grid>
                                      <Grid item sm={4} style={{ textAlign: 'center' }}>
                                        <Button
                                          color={final_payout == 3 ? 'primary' : "default"}
                                          variant="contained"
                                          onClick={() => { row.pending && this.setState({ final_payout: 3 }) }}
                                        >
                                          {'Processing'}
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  </>
                                }
                                {
                                  row.pending &&
                                  <div style={{ width: '100%', textAlign: 'right' }} className={classes.card_header}>
                                    <Button
                                      color="primary"
                                      variant="contained"
                                      onClick={() => {
                                        this.onSubmit(row, details)
                                      }}
                                    >
                                      {'Submit'}
                                    </Button>
                                  </div>
                                }
                              </CardContent>
                            </Card>
                          </div> :
                          <Typography variant="h6" gutterBottom color="error">
                            There is no transaction
                          </Typography>
                      }
                    </div>
                }
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
  render() {
    const { classes, className, arbitrations } = this.props
    const { rowsPerPage, page, openBar, error } = this.state
    return (
      <Card
        className={clsx(classes.root, className)}
      >
        <CardContent className={classes.content}>
          <PerfectScrollbar>
            <div className={classes.inner}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>YOURCASE</TableCell>
                    <TableCell>OUTCOME</TableCell>
                    <TableCell>Transaction</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Create date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {arbitrations.slice(0, rowsPerPage).map(arbitration => {
                    return this.renderRow(arbitration)
                  })}
                </TableBody>
              </Table>
            </div>
          </PerfectScrollbar>
        </CardContent>
        <CardActions className={classes.actions}>
          <TablePagination
            component="div"
            count={arbitrations.length}
            onChangePage={this.handlePageChange}
            onChangeRowsPerPage={this.handleRowsPerPageChange}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </CardActions>
        <Snackbar anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
          onClose={() => this.setState({ openBar: false })}
          open={openBar} autoHideDuration={3000}
          message={error}>
        </Snackbar>
      </Card>
    );
  }
}

export default withStyles(styles)(ArbitrationsTable);

