import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import firebase from 'firebase'

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, loading, user, ...rest } = props;
  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
      }}>
        <img style={{ width: 300 }} src="./images/logo.png" alt="logo" />
      </div>
    )
  }
  return (
    <Route
      {...rest}
      render={matchProps => {
        const { location } = matchProps
        if (user) {
          return (
            <Layout>
              <Component {...matchProps} />
            </Layout>
          )
        }
        return (
          <Redirect
            to={{
              pathname: "/sign-in",
              state: { from: location }
            }}
          />
        )
      }}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
