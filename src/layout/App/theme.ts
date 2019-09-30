import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export default createMuiTheme({
  typography: {
    fontFamily: 'Segoe UI, Helvetica Neue, sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  palette: {
    secondary: {
      main: '#228007',
    },
    primary: {
      main: '#ffffff',
    },
  },
});
