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
  TextField
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
import firebase from 'firebase'

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
class TransactionsTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rowsPerPage: 10,
      page: 0,
      openItem: null,
      loading: false,
      details: null,
      buyer: null,
      seller: null
    }
  }
  handlePageChange = (event, page) => {
    this.setState({ page })
  };

  handleRowsPerPageChange = event => {
    this.setState({ rowsPerPage: event.target.value })
  };
  async openRow(row) {
    this.setState({ openItem: row.key, loading: true, buyer: null, seller: null })
    var db = firebase.firestore();
    const buyer = await db.collection("users").doc(row.buyer).get()
    const seller = await db.collection("users").doc(row.createdby).get()
    this.setState({ loading: false, buyer: buyer && buyer.data(), seller: seller && seller.data() })
  }
  renderRow(row) {
    const { openItem, loading, buyer, seller } = this.state
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
          <TableCell>{row.title || '---'}</TableCell>
          <TableCell>{row.categoryName}/{row.subcategoryName}</TableCell>
          <TableCell>${row.price}</TableCell>
          <TableCell>
            {row.status ? row.status.toUpperCase() : '---'}
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
                  <div>
                    {

                      <div style={{ width: '100%' }}>
                        <Card style={{ maxWidth: 700, margin: 'auto' }}>
                          <CardContent>
                            <Grid
                              container
                            >
                              <Grid item xs={12} sm={4}>
                                <img
                                  alt="product image"
                                  src={row.photo && row.photo.length > 0 && row.photo[0]}
                                  style={{ maxHeight: 150 }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={8}>
                                <Typography variant="h3" color="error" className={classes.card_header}>
                                  {`${row.title}`}
                                </Typography>
                                <Typography variant="h5">
                                  {`Item Number: ${row.product_id}`}
                                </Typography>
                                <Grid
                                  container
                                  className={classes.card_header}
                                >
                                  <Grid item xs={6}>
                                    <Typography variant="h6" color="error">
                                      {`Seller:`} {seller && seller.name}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography variant="h6" color="error">
                                      {`Buyer:`} {buyer && buyer.name}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Divider />
                            <br />
                            <Grid
                              container
                            >
                              <Grid item xs={12} sm={6}>
                                <Typography variant="h6" color="error">
                                  {`DELIVERY ADDRESS`}
                                </Typography>
                                <br/>
                                <Typography variant="h6" >
                                  {row.building}
                                </Typography>
                                <Typography variant="h6" >
                                  {row.street},{row.city},{row.country}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="h6" color="error">
                                  {`TRANSACTION OPEN DATE`}
                                </Typography>
                                <br/>
                                <Typography variant="h6">
                                  {moment(new Date(+row.createdat)).format('DD/MM/YYYY')}
                                </Typography>
                              </Grid>
                            </Grid>
                            <br />
                            <Divider />
                            <List>
                              <ListItem>
                                <ListItemText
                                  primary={"Price"}
                                />
                                <ListItemSecondaryAction>
                                  <Typography variant="h6" color="primary">
                                    {`$${row.price}`}
                                  </Typography>
                                </ListItemSecondaryAction>
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary={"Processing Fee"}
                                />
                                <ListItemSecondaryAction>
                                  <Typography variant="h6" color="primary">
                                    {`$${(row.price * 0.1).toFixed(2)}`}
                                  </Typography>
                                </ListItemSecondaryAction>
                              </ListItem>
                              <ListItem>
                                <ListItemText
                                  primary={'Pay Out'}
                                />
                                <ListItemSecondaryAction>
                                  <Typography variant="h6" color="primary">
                                    {`$${(row.price * 0.9).toFixed(2)}`}
                                  </Typography>
                                </ListItemSecondaryAction>
                              </ListItem>
                            </List>
                            <Divider />
                          </CardContent>
                        </Card>
                      </div>
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
    const { rowsPerPage, page } = this.state
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
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
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
      </Card>
    );
  }
}

export default withStyles(styles)(TransactionsTable);

