import { makeStyles, Theme } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';

export default makeStyles((theme: Theme) => ({
  nestedItem: {
    paddingLeft: theme.spacing(4),
  },
  list: {
    padding: 0,
  },
  item: {
    // '&:has( .selected)': {
    //   backgroundColor: lighten(theme.palette.primary.main, 0.8),
    // },
    '&.selected': {
      backgroundColor: lighten(theme.palette.primary.main, 0.8),
    },
  },
}));
