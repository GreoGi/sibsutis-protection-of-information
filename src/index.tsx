import * as React from 'react';
import { render } from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import App from './layout/App';


render((
  <>
    <CssBaseline />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>
  ),
  document.getElementById('root')
);