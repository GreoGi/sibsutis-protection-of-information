import * as React from 'react';

import useRouter from '@anissoft/react-helpers/hooks/useRouter';
import { Grid, Typography } from '@material-ui/core';

import useStyles from './styles';

export default ({
  title,
}: {
  title: string;
}) => {
  const classes = useStyles({});
  const { history } = useRouter();

  return (
      <Grid
        container
        justify="space-between"
      >
        <Grid item className={classes.logotype}>
          <span id="app_title" style={{ lineHeight: '20px', paddingTop: 3 }}>
            <Typography variant="button">
              {`${title}`}
            </Typography>
          </span>
        </Grid>
      </Grid >
  );
};
