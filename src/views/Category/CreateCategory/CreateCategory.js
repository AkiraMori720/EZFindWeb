import React, { Component } from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
  CircularProgress
} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import firebase from 'firebase'

const styles = {
  root: {
    marginBottom: 100
  }
}
class CreateCategory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      name: '',
      parent: '',
      file: null,
      image: null,
      error: false,

      subcategory: '',
      subfile: null,
      subimage: null,
    }
    this.handleChange = this.handleChange.bind(this)
  }
  componentWillReceiveProps(nextprops) {
    if ((this.props.data == null && nextprops.data) || (this.props.data && nextprops.data && this.props.data.key != nextprops.data.key)) {
      this.setState({
        name: nextprops.data.name,
        parent: nextprops.data.parent,
        image: nextprops.data.image_url,
        file: null,

        subcategory: '',
        subfile: null,
        subimage: null,
      })
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }
  async createCategory() {
    const { name, parent, file, loading, subcategory, subfile } = this.state
    if (loading) return
    this.setState({ error: false })
    if (name && name.length > 0) {
      if (file == null) {
        this.setState({ error: 'The category image is required.' })
        return
      }
      // if (parent == '') {
      //   if (subcategory && subcategory.length > 0) {
      //     if (subfile == null) {
      //       this.setState({ error: 'The subcategory image is required.' })
      //       return
      //     }
      //   } else {
      //     this.setState({ error: 'The Subcategory Name field is required.' })
      //     return
      //   }
      // }
      this.setState({ loading: true })
      let image_url = null
      if (file) {
        const filename = Date.now()
        var _storage = firebase.storage().ref(`/categories/${filename}`);

        const uploadTask = await _storage.put(file)
        image_url = await _storage.getDownloadURL()
      }
      var db = firebase.firestore();
      const collection_path = parent && parent.length > 0 ? `categories/${parent}/subcategories` : `categories`
      db.collection(collection_path).add({ name, image_url }).then(async (res) => {
        if (res.id && parent == '' && subcategory && subfile) {
          const filename = Date.now()
          var _storage = firebase.storage().ref(`/categories/${filename}1000`);

          const uploadTask = await _storage.put(subfile)
          image_url = await _storage.getDownloadURL()

          const sub_collection_path = `categories/${res.id}/subcategories`
          db.collection(sub_collection_path).add({ name: subcategory, image_url }).then((res) => {
            this.setState({
              loading: false, name: '', parent: '', file: null, image: null, subcategory: '',
              subfile: null,
              subimage: null,
            })
          }, () => {
            this.setState({ loading: false })
          });
          return
        }
        this.setState({
          loading: false, name: '', parent: '', file: null, image: null, subcategory: '',
          subfile: null,
          subimage: null,
        })
      }, () => {
        this.setState({ loading: false })
      });
    } else this.setState({ error: 'The Category Name field is required.' })
  }
  async updateCategory() {
    const { name, parent, file, loading } = this.state
    const { data } = this.props
    if (loading) return
    this.setState({ error: false })
    if (name && name.length > 0) {
      this.setState({ loading: true })
      let image_url = data.image_url
      if (file) {
        const filename = Date.now()
        var _storage = firebase.storage().ref(`/categories/${filename}`);

        const uploadTask = await _storage.put(file)
        image_url = await _storage.getDownloadURL()
      }
      var db = firebase.firestore();

      const doc = data.parent ? db.collection(`categories/${data.parent}/subcategories`).doc(`${data.key}`) : db.collection(`categories`).doc(`${data.key}`)
      doc.update({ name, image_url }).then(() => {
        this.props.onClear()
        this.setState({ loading: false, name: '', parent: '', file: null, image: null })
      }, () => {
        this.setState({ loading: false })
      });
    } else this.setState({ error: 'The Category Name field is required.' })
  }
  handleImageAsFile = (e) => {
    const image = e.target.files[0]
    this.setState({ file: image, image: URL.createObjectURL(image) })
  }
  handleSubImageAsFile = (e) => {
    const image = e.target.files[0]
    this.setState({ subfile: image, subimage: URL.createObjectURL(image) })
  }
  render() {
    const { classes, className, categories, data } = this.props
    const { name, parent, image, loading, subcategory, subimage } = this.state
    
    return (
      <Card
        className={clsx(classes.root, className)}
      >
        <form
          autoComplete="off"
          noValidate
        >
          <CardHeader
            //subheader="The information can be edited"
            title={data ? "Edit Category" : "Create Category"}
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Category Name"
                  margin="dense"
                  name="name"
                  required
                  onChange={this.handleChange}
                  value={name}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <InputLabel id="demo-simple-select-filled-label">Parent Category</InputLabel>
                <Select
                  id="demo-simple-select-filled"
                  name="parent"
                  value={parent}
                  onChange={this.handleChange}
                  style={{ width: '100%' }}
                  disabled={data ? true : false}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {
                    categories.map(item => {
                      return (
                        <MenuItem key={item.key} value={item.key}>{item.name}</MenuItem>
                      )
                    })
                  }
                </Select>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={6}
                xs={12}
              >
                <label htmlFor="upload-photo">
                  <input
                    style={{ display: 'none' }}
                    id="upload-photo"
                    name="upload-photo"
                    type="file"
                    onChange={this.handleImageAsFile}
                  />
                  <Button color="secondary" variant="contained" component="span">
                    {`Select Image`}
                  </Button>
                </label>
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                {
                  image &&
                  <img src={image} alt="image tag" style={{ width: 200, height: 200 }} />
                }
              </Grid>
            </Grid>
            {
              data == null && (parent == null || parent.length <= 0) &&
              <div>
                <br />
                <Divider />
                <br />
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="Subcategory Name(optional)"
                      margin="dense"
                      name="subcategory"
                      onChange={this.handleChange}
                      value={subcategory}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid
                        item
                        md={6}
                        xs={12}
                        style={{ marginTop: 8 }}
                      >
                        <label htmlFor="upload-photo1">
                          <input
                            style={{ display: 'none' }}
                            id="upload-photo1"
                            name="upload-photo1"
                            type="file"
                            onChange={this.handleSubImageAsFile}
                          />
                          <Button color="secondary" variant="contained" component="span">
                            {`Select Image`}
                          </Button>
                        </label>
                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
                        {
                          subimage &&
                          <img src={subimage} alt="image tag" style={{ width: 200, height: 200 }} />
                        }
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            }
          </CardContent>
          <Divider />
          <CardActions>
            {
              loading ?
                <CircularProgress size={20} style={{ margin: 20 }} /> :
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    {
                      data &&
                      <Button
                        color={'default'}
                        variant="contained"
                        onClick={() => {
                          this.props.onClear()
                          this.setState({
                            loading: false,
                            name: '',
                            parent: '',
                            file: null,
                            image: null
                          })
                        }}
                      >
                        {
                          'Cancel'
                        }
                      </Button>
                    }
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      <Button
                        color={loading ? 'default' : "primary"}
                        variant="contained"
                        onClick={() => { data ? this.updateCategory() : this.createCategory() }}
                        style={{ alignSelf: 'flex-end' }}
                      >
                        {
                          data ? "Update" : 'Create'
                        }
                      </Button>
                      {this.state.error ? <p style={{ color: 'red', marginTop: 10 }}>{this.state.error}</p> : null}
                    </div>
                  </Grid>
                </Grid>
            }
          </CardActions>
        </form>
      </Card>
    )
  }
}
export default withStyles(styles)(CreateCategory);

