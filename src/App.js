import React, { Component } from 'react';
import { Router, HashRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Chart } from 'react-chartjs-2';
import { ThemeProvider } from '@material-ui/styles';
import validate from 'validate.js';

import { chartjs } from './helpers';
import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import Routes from './Routes';
import firebase from 'firebase/app'

const browserHistory = createBrowserHistory();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

export default class App extends Component {
  constructor(props) {
    super(props)
    var firebaseConfig = {
      apiKey: "AIzaSyDaC-ESMMmE4dL3dHtBiPNzDuX_8maw3U4",
      authDomain: "ez-find-ee725.firebaseapp.com",
      databaseURL: "https://ez-find-ee725.firebaseio.com",
      projectId: "ez-find-ee725",
      storageBucket: "ez-find-ee725.appspot.com",
      messagingSenderId: "190185776330",
      appId: "1:190185776330:web:bc854c0b2f2b14c7088033"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
  render() {
    return (
      <ThemeProvider theme={theme}>
        <HashRouter history={browserHistory}>
          <Routes />
        </HashRouter>
      </ThemeProvider>
    );
  }
}
