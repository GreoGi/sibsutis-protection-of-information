import * as React from 'react';

import {
  Filter1, Filter2, Filter3, Filter4, Filter5, Filter6
} from '@material-ui/icons';
import Lab1 from './lab1';

export interface IView {
  id: string;
  caption: string;
  default?: boolean,
  icon: React.ReactNode,
  path: string;
  View?: () => JSX.Element;
}

export default [
 {
  id: 'lab1',
  caption: 'хз1',
  default: true,
  icon: <Filter1 />,
  path: '/lab1',
  View: Lab1
 },
 {
  id: 'lab2',
  caption: 'хз2',
  icon: <Filter2 />,
  path: '/lab2',
  // View:
 },
 {
  id: 'lab3',
  caption: 'хз3',
  icon: <Filter3 />,
  path: '/lab3',
  // View:
 },
 {
  id: 'lab4',
  caption: 'хз4',
  icon: <Filter4 />,
  path: '/lab4',
  // View:
 },
 {
  id: 'lab5',
  caption: 'хз5',
  icon: <Filter5 />,
  path: '/lab5',
  // View:
 },
 {
  id: 'lab6',
  caption: 'хз6',
  icon: <Filter6 />,
  path: '/lab6',
  // View:
 },
] as IView[];