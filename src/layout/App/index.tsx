import * as React from 'react';
import Slide from '@material-ui/core/Slide';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions/transition';
import { Redirect, Route, Switch } from 'react-router';

import useAppBarWithDrawer from '../../hooks/useAppbarWithDrawer';

import Toolbar from '../../components/Toolbar';
import Menu from '../../components/Menu';
import views, { IView } from '../Views';
import theme from './theme';

const Transition = React.forwardRef<unknown, TransitionProps>((props, ref) => <Slide direction="up" ref={ref} {...props} />);
Transition.displayName = 'Transition';

const App: React.FunctionComponent<{}> = () => {
  const { Content, Drawer, AppBar } = useAppBarWithDrawer(
    { width: 300, defaultOpened: false },
    (open) => {},
  );
  const routes = React.useMemo(
    () => views,
    [],
  );
  const home = React.useMemo(
    () => routes[0].path,
    [routes],
  );

  return (
    <ThemeProvider theme={theme}>
      <AppBar color="secondary">
        <Toolbar title=",,, =^-^= ,,," />
      </AppBar>
      <Drawer>
        <Menu
          items={views}
        />
      </Drawer>
      <Content >
        <Switch>
          {
            routes.map(({ id, path, View }) => (
              <Route
                key={id}
                path={path}
                render={() => (View ? <View /> : null)}
              />
            ))}
          <Redirect exact from="/" to={home} />
        </Switch>
      </Content>
    </ThemeProvider>
  );
}

export default App;
