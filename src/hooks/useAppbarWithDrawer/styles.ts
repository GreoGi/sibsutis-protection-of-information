import { makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: ({ width }: { width: number }) => ({
    marginLeft: width,
    width: `calc(100% - ${width}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  menuButton: {
    opacity: 1,
    marginRight: 36,
  },
  hide: {
    margin: 0,
    opacity: 0,
    width: 0,
    transition: theme.transitions.create(['opacity', 'margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawer: ({ width }: { width: number }) => ({
    width,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  }),
  drawerOpen: ({ width }: { width: number }) => ({
    width,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 3,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7) + 3,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    // ...theme.mixins.toolbar,
    minHeight: 48,
  },
  toolbarGutters: {
    padding: '0 16px',
  },
  content: ({ width }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: theme.spacing(7) + 3,
  }),
  contentShift: ({ width }) => ({
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: width,
  }),
}));
