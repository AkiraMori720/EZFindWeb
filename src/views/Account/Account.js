import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
  Snackbar
} from '@material-ui/core';
import firebase from 'firebase'
import validate from 'validate.js';
import CircularProgress from '@material-ui/core/CircularProgress';


const useStyles = makeStyles(() => ({
  root: {
    padding: 40
  }
}));
const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  },
  newpassword: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  },
  confirmpassowrd: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

const AccountDetails = props => {
  const { className, history, ...rest } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });
  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);
  /*
  const [values, setValues] = useState({
    email: '',
    password: '',
    newpassword: '',
    confirmpassowrd: ''
  });
*/
  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };
  const submit = event => {
    event.preventDefault();
    const { isValid, values } = formState
    if (values.newpassword != values.confirmpassowrd) {
      setFormState(formState => ({
        ...formState,
        errors: {
          ...formState.errors,
          newpassword: ['Please make sure your password match'],
          confirmpassowrd: ['Please make sure your password match']
        }
      }));
      return
    }
    if (isValid && !processing) {
      setProcessing(true)
      firebase.auth().signInWithEmailAndPassword(values.email, values.password).then(res => {
        const user = firebase.auth().currentUser
        user.updatePassword(values.newpassword).then(result => {
          setOpen(true);
          setSigninError('Successfully changed! please login again.')
          setTimeout(() => {
            setProcessing(false)
            firebase.auth().signOut().then(() => {
              props.history.replace({ pathname: "/sign-in" });
            })
          }, 3000)
        })
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        setOpen(true);
        setSigninError(errorMessage)
        setProcessing(false)
      });
    }
  };
  const [open, setOpen] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [signin_error, setSigninError] = React.useState('');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <Card
      >
        <form
          autoComplete="off"
          noValidate
          onSubmit={submit}
        >
          <CardHeader
            title="Change Password"
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
                  label="Email Address"
                  margin="dense"
                  name="email"
                  onChange={handleChange}
                  required
                  value={formState.values.email || ''}
                  variant="outlined"
                  error={hasError('email')}
                  helperText={
                    hasError('email') ? formState.errors.email[0] : null
                  }
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Old Password"
                  margin="dense"
                  name="password"
                  onChange={handleChange}
                  value={formState.values.password || ''}
                  variant="outlined"
                  type="password"
                  error={hasError('password')}
                  helperText={
                    hasError('password') ? formState.errors.password[0] : null
                  }
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="New Password"
                  margin="dense"
                  name="newpassword"
                  onChange={handleChange}
                  value={formState.values.newpassword || ''}
                  variant="outlined"
                  type="password"
                  error={hasError('newpassword')}
                  helperText={
                    hasError('newpassword') ? formState.errors.newpassword[0] : null
                  }
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Confirm Password"
                  margin="dense"
                  name="confirmpassowrd"
                  onChange={handleChange}
                  type="number"
                  value={formState.values.confirmpassowrd || ''}
                  variant="outlined"
                  type="password"
                  error={hasError('confirmpassowrd')}
                  helperText={
                    hasError('confirmpassowrd') ? formState.errors.confirmpassowrd[0] : null
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions style={{ justifyContent: 'space-between' }}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={!formState.isValid}
            >
              {processing ? <CircularProgress style={{ color: 'white' }} size={20} /> : 'Save'}
            </Button>
          </CardActions>
        </form>
      </Card>
      <Snackbar anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
        open={open} autoHideDuration={3000} onClose={handleClose}
        message={signin_error}>
      </Snackbar>
    </div>
  );
};

export default AccountDetails;
