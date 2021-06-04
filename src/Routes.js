import React, { useState, useEffect } from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  ProductList as ProductListView,
  Typography as TypographyView,
  Icons as IconsView,
  Account as AccountView,
  Settings as SettingsView,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView,

  Reports as ReportsView,
  UserList as UserListView,
  BannedUser as BannedUserView,
  Category as CategoryView,
  Arbitration as ArbitrationView,
  Transactions as TransactionsView
} from './views';
import { Route } from 'react-router-dom';
import firebase from 'firebase'

const Routes = () => {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      setUser(user)
    } else {
      setUser(null)
    }
    setLoading(false)
  });

  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/reports"
      />
      <RouteWithLayout
        component={ReportsView}
        exact
        layout={MainLayout}
        path="/reports"
        loading={loading}
        user={user}
      />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
        loading={loading}
        user={user}
      />
      <RouteWithLayout
        component={BannedUserView}
        exact
        layout={MainLayout}
        path="/banneduser"
        loading={loading}
        user={user}
      />
      <RouteWithLayout
        component={CategoryView}
        exact
        layout={MainLayout}
        path="/category"
        loading={loading}
        user={user}
      />
      <RouteWithLayout
        component={ArbitrationView}
        exact
        layout={MainLayout}
        path="/arbitration"
        loading={loading}
        user={user}
      />
      <RouteWithLayout
        component={TransactionsView}
        exact
        layout={MainLayout}
        path="/transactions"
        loading={loading}
        user={user}
      />
      <RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
        loading={loading}
        user={user}
      />




      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
        loading={loading}
        user={user}
      />

      <RouteWithLayout
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/products"
        loading={loading}
        user={user}
      />
      <RouteWithLayout
        component={TypographyView}
        exact
        layout={MainLayout}
        path="/typography"
        loading={loading}
        user={user}
      />
      <RouteWithLayout
        component={IconsView}
        exact
        layout={MainLayout}
        path="/icons"
        loading={loading}
        user={user}
      />
      <RouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
        loading={loading}
        user={user}
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
        loading={loading}
        user={user}
      />
      <Route
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
        loading={loading}
        user={user}
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
        loading={loading}
        user={user}
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
