import clsx from 'clsx';
import * as React from 'react';

import { useBox } from '@anissoft/box';
import { Else, If, Then } from '@anissoft/react-helpers/components/If';
import AppBar, { AppBarProps } from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';

import useStyles from './styles';

function useDrawer(
  { width, defaultOpened }: { width?: number, defaultOpened?: boolean },
  onChange: (open: boolean) => void,
) {
  // const [_, update] = React.useState(Symbol('__'));
  const classes = useStyles({ width: width || 240 });
  const { get: getStatus, set: setStatus } = useBox(defaultOpened || false, () => true);

  function toggleDrawer(state?: boolean) {
    const newState = state !== undefined ? state : !getStatus();
    // update(Symbol('__'));
    setStatus(newState);
    onChange(newState);
  }

  const TrackedDrawer = React.useCallback(
    ({
      children,
      ...other
    }: {
      children: React.ReactNode,
    } & DrawerProps) => {
      const open$ = getStatus();
      return (
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open$,
            [classes.drawerClose]: !open$,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open$,
              [classes.drawerClose]: !open$,
            }),
          }}
          open={open$}
          {...other}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={toggleDrawer.bind(null, undefined)}>
              <If condition={!!open$} >
                <Then >
                  <ChevronLeftIcon />
                </Then>
                <Else>
                  <ChevronRightIcon />
                </Else>
              </If>
            </IconButton>
          </div>
          <Divider />
          {children}
        </Drawer >
      );
    },
    [],
  );


  const TrackedAppbar = React.useCallback(
    ({
      children,
      ...other
    }: {
      children: React.ReactNode,
    } & AppBarProps) => {
      const open$ = getStatus();
      return (
        <AppBar
          position="sticky"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open$,
          })}
          {...other}
        >
          <Toolbar variant="dense" classes={{ gutters: classes.toolbarGutters }} >
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={toggleDrawer.bind(null, undefined)}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open$,
              })}
            >
              <MenuIcon />
            </IconButton>
            {children}
          </Toolbar>
        </AppBar>
      );
    },
    [],
  );

  const TrackedMain: React.FunctionComponent = React.useCallback(
    ({
      children,
    }) => {
      const open$ = getStatus();
      return (
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open$,
          })}
        >
          {children}
        </main>
      );
    },
    [],
  );

  return {
    open: getStatus(),
    toggle: toggleDrawer,
    Drawer: TrackedDrawer,
    AppBar: TrackedAppbar,
    Content: TrackedMain,
  };
}

export default useDrawer;
