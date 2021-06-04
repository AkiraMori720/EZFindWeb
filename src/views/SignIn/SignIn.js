import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  TextField,
  Link,
  Typography,
  InputAdornment,
  Snackbar
} from '@material-ui/core';
import IconEmail from '@material-ui/icons/Email';
import IconPwd from '@material-ui/icons/Lock'
import firebase from 'firebase'
import CircularProgress from '@material-ui/core/CircularProgress';

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
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'black',
    height: '100%',
    backgroundImage: 'url(./images/Background.png)',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginBottom: theme.spacing(4),
    maxHeight: 150
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    textAlign: 'center',
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2),
    backgroundColor: 'rgb(232, 240, 254)'
  },
  signInButton: {
    margin: theme.spacing(2, 0),
    borderRadius: 200,
    backgroundColor: '#10C879'
  },
  forgotpwd: {
    marginTop: theme.spacing(2),
    color: '#10C879'
  },
  iconstyle: {
    backgroundColor: 'white'
  }
}));

const SignIn = props => {
  const { history, location } = props;

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
  const [open, setOpen] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [signin_error, setSigninError] = React.useState('');
  const handleSignIn = event => {
    event.preventDefault();
    const { isValid, values } = formState
    if (isValid && !processing) {
      setProcessing(true)
      firebase.auth().signInWithEmailAndPassword(values.email, values.password).then(async res => {
        var db = firebase.firestore();
        const user_data = await db.collection("users").doc(res && res.user && res.user.uid).get()
        const user_role = user_data && user_data.data()
        if (user_role && user_role.type == 'admin') {
          setTimeout(() => {
            setProcessing(false)
            let { from } = location.state || { from: { pathname: "/reports" } };
            history.replace(from);
          }, 100)
        } else {
          setOpen(true);
          setSigninError('Invalid user role!')
          setProcessing(false)
        }
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
      <div className={classes.content}>
        <div className={classes.contentBody}>
          <form
            className={classes.form}
            onSubmit={handleSignIn}
          >
            <img className={classes.logoImage} src="./images/logo.png" alt="logo" />
            <TextField
              className={classes.textField}
              error={hasError('email')}
              fullWidth
              helperText={
                hasError('email') ? formState.errors.email[0] : null
              }
              label="Email address"
              name="email"
              onChange={handleChange}
              type="text"
              value={formState.values.email || ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconEmail />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              className={classes.textField}
              error={hasError('password')}
              fullWidth
              helperText={
                hasError('password') ? formState.errors.password[0] : null
              }
              label="Password"
              name="password"
              onChange={handleChange}
              type="password"
              value={formState.values.password || ''}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconPwd />
                  </InputAdornment>
                ),
              }}
            />
            <Typography
              color="textSecondary"
              variant="body1"
              className={classes.forgotpwd}
            >
              <Button
                style={{ color: '#10C879', textDecoration: 'underline' }}
                onClick={() => {
                  if (formState.values.email) {
                    firebase.auth().sendPasswordResetEmail(formState.values.email).then(function () {
                      setOpen(true);
                      setSigninError('Sent reset email. please check your email.')
                    }).catch(function (error) {
                      var errorCode = error.code;
                      var errorMessage = error.message;
                      setOpen(true);
                      setSigninError(errorMessage)
                    });
                  } else {
                    setOpen(true);
                    setSigninError('please input your email address.')
                  }
                }}
              >
                Forgot Password
              </Button>
            </Typography>
            <Button
              className={classes.signInButton}
              color="primary"
              disabled={!formState.isValid}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              {processing ? <CircularProgress style={{ color: 'white' }} size={20} /> : 'Log In'}
            </Button>
          </form>
        </div>
      </div>
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

SignIn.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignIn);
