import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import firebase from 'firebase'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import CreateCategory from './CreateCategory'
import Popover from '@material-ui/core/Popover';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

const styles = {
  root: {
    padding: 40,
    paddingTop: 60,
  },
  content: {
    //backgroundColor: '#F7FCFD'
  },
  heading: {
    fontSize: '15',
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: '15',
    color: 'gray',
  },
  popover: {
    padding: '10px'
  },
  deleteBtn: {
    backgroundColor: 'red',
    color: 'white'
  }
};
class Category extends Component {
  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      subcategories: [],
      loading: true,
      expanded: null,
      anchorEl: null,
      deleteObj: null,

      editObj: null
    }
  }
  componentDidMount() {
    var db = firebase.firestore();
    db.collection("categories").onSnapshot((querySnapshot) => {
      let categories = []
      querySnapshot.forEach((doc) => {
        categories.push({
          ...doc.data(),
          key: doc.id
        })
      });
      this.setState({ categories })
    });
  }
  handleChange = (panel) => (event, isExpanded) => {
    this.setState({ expanded: isExpanded ? panel : false, loading: true })
    if (isExpanded) {
      var db = firebase.firestore();
      db.collection(`categories/${panel}/subcategories`).onSnapshot((querySnapshot) => {
        let subcategories = []
        querySnapshot.forEach((doc) => {
          subcategories.push({
            ...doc.data(),
            key: doc.id
          })
        });
        this.setState({ subcategories, loading: false })
      });
    }
  };
  onDeleteSubCategory(e, deleteObj) {
    this.setState({ anchorEl: e.target, deleteObj })
  }
  deleteCategory() {
    const { deleteObj } = this.state
    this.setState({ anchorEl: null, deleteObj })
    if (deleteObj) {
      var db = firebase.firestore();
      if (deleteObj.id) {
        const doc = deleteObj.parent ? db.collection(`categories/${deleteObj.parent}/subcategories`).doc(`${deleteObj.id}`) : db.collection(`categories`).doc(`${deleteObj.id}`)
        doc.delete().then(() => {
          // if (deleteObj.isLast) {
          //   db.collection(`categories`).doc(`${deleteObj.parent}`).delete().then(() => {
          //     this.setState({ anchorEl: null, deleteObj })
          //   })
          //   return
          // }
          this.setState({ anchorEl: null, deleteObj })
        })
      } else {
        const doc = deleteObj.parent ? db.collection(`categories`).doc(`${deleteObj.parent}`) : db.collection(`categories`).doc(`${deleteObj.id}`)
        doc.collection("subcategories")
          .get()
          .then(res => {
            res.forEach(element => {
              element.ref.delete();
            });
            doc.delete().then(() => {
              this.setState({ anchorEl: null, deleteObj })
            })
          }).catch(() => {
            this.setState({ anchorEl: null, deleteObj })
          });
      }
    } else this.setState({ anchorEl: null, deleteObj })
  }
  render() {
    const { classes } = this.props
    const { expanded, categories, loading, subcategories, anchorEl } = this.state

    return (
      <div className={classes.root}>
        <Typography variant="h4" component="h4">
          Catalog Setup
        </Typography>
        <br />
        <div className={classes.content}>
          {
            categories.map(category => {
              return (
                <Accordion key={category.key} expanded={expanded === category.key} onChange={this.handleChange(category.key)}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <ListItemAvatar>
                      {
                        category.image_url ?
                          <img src={category.image_url} alt="image tag" style={{ width: 50, height: 50, marginRight: 10 }} /> :
                          <div style={{ width: 60, height: 50 }} />
                      }
                    </ListItemAvatar>
                    <ListItemText
                      primary={category.name}
                      style={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    />
                    <ListItemText
                      primary={category.sp_name??''}
                      style={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    />
                    <IconButton edge="end" aria-label="delete" onClick={(e) => {
                      this.setState({
                        editObj: {
                          ...category,
                          parent: null
                        }
                      })
                    }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={(e) => { this.onDeleteSubCategory(e, { id: null, parent: category.key }) }}>
                      <DeleteIcon />
                    </IconButton>
                  </AccordionSummary>
                  <AccordionDetails>
                    {
                      loading ?
                        <div style={{ textAlign: 'center', width: '100%' }}>
                          <CircularProgress size={20} />
                        </div> :
                        <div style={{ width: '100%' }}>
                          {
                            subcategories && subcategories.length > 0 ?
                              <List>
                                {
                                  subcategories.map(item => {
                                    return (
                                      <ListItem key={item.key}>
                                        <ListItemAvatar>
                                          {
                                            item.image_url ?
                                              <img src={item.image_url} alt="image tag" style={{ width: 50, height: 50, marginRight: 10 }} /> :
                                              <div style={{ width: 60, height: 50 }} />
                                          }
                                        </ListItemAvatar>
                                        <ListItemText
                                          primary={item.name}
                                        />
                                        <ListItemText
                                          primary={item.sp_name??''}
                                        />
                                        <ListItemSecondaryAction>
                                          <IconButton edge="end" aria-label="delete" onClick={(e) => {
                                            this.setState({
                                              editObj: {
                                                ...item,
                                                parent: category.key
                                              }
                                            })
                                          }}>
                                            <EditIcon />
                                          </IconButton>
                                          <IconButton edge="end" aria-label="delete" onClick={(e) => this.onDeleteSubCategory(e, { id: item.key, parent: category.key, isLast: subcategories.length == 1 })}>
                                            <DeleteIcon />
                                          </IconButton>
                                        </ListItemSecondaryAction>
                                      </ListItem>
                                    )
                                  })
                                }
                              </List> :
                              <ListItem >
                                <ListItemText
                                  primary={'No subcategories'}
                                />
                                {/* <Button
                                  variant="contained"
                                  color="default"
                                  startIcon={<DeleteIcon />}
                                  className={classes.deleteBtn}
                                  onClick={(e) => this.onDeleteSubCategory(e, { id: null, parent: category.key })}
                                >
                                  Delete Category
                                  </Button> */}
                              </ListItem>
                          }
                        </div>
                    }
                  </AccordionDetails>
                </Accordion>
              )
            })
          }
          <br /><br />
          <CreateCategory
            categories={categories}
            data={this.state.editObj}
            onClear={() => this.setState({ editObj: null })} />
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => {
              this.setState({ anchorEl: null })
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Card className={classes.popover}>
              <CardContent>
                <Typography variant="h5" color="textSecondary">
                  Are you sure to delete?
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => this.deleteCategory()}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Popover>
        </div>
      </div>
    );
  }
}


export default withStyles(styles)(Category);
