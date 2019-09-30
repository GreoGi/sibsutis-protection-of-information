import { makeStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  textField: {
    marginRight: theme.spacing(2),
  },
  dfRegenerate: {
    margin: theme.spacing(1),
  }
}));