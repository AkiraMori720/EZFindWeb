import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';

import ReportsIcon from '@material-ui/icons/Report';
import PeopleIcon from '@material-ui/icons/People';
import BannedIcon from '@material-ui/icons/SupervisedUserCircle';
import CategoryIcon from '@material-ui/icons/Category';
import ArbitrationIcon from '@material-ui/icons/PersonPin';
import TransactionIcon from '@material-ui/icons/CardGiftcard';
import PasswordIcon from '@material-ui/icons/Lock';
//import logoutIcon from '@material-ui/icons/Login';

import { Profile, SidebarNav } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      //marginTop: 64,
      //height: 'calc(100% - 64px)'
    },
    backgroundColor: 'white',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  divider: {
    backgroundColor: 'gray'  
  },
  nav: {
    marginBottom: theme.spacing(2)
  },
  logoContainer: {
    textAlign: 'center',
    backgroundColor: 'white',
    padding: theme.spacing(2)
  },
  logoImage: {
    maxHeight: 50
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: 'Reports',
      href: '/reports',
      icon: <ReportsIcon />
    },
    {
      title: 'All Users',
      href: '/users',
      icon: <PeopleIcon />
    },
    {
      title: 'Banned Users',
      href: '/banneduser',
      icon: <BannedIcon />
    },
    {
      title: 'Catalog Setup',
      href: '/category',
      icon: <CategoryIcon />
    },
    // {
    //   title: 'Arbitration Cases',
    //   href: '/arbitration',
    //   icon: <ArbitrationIcon />
    // },
    // {
    //   title: 'Transactions',
    //   href: '/transactions',
    //   icon: <TransactionIcon />
    // },
    {
      title: 'Change Password',
      href: '/account',
      icon: <PasswordIcon />
    },
    {
      title: 'Log Out',
      href: null,
      icon: <ArbitrationIcon />
    }
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        {/* <div className={classes.logoContainer}>
          <img className={classes.logoImage} src="./images/logo.png" alt="logo"/>
        </div> */}
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
