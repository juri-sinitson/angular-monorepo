import { Route } from '@angular/router';

import { Statistics1Component } from './statistics1.component';
import { Statistics2Component } from './statistics2.component';

export const appRoutes: Route[] = [
  {
    path: 'home',
    component: Statistics1Component,
  },
  {
    path: 'statistics2',
    component: Statistics2Component,
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
