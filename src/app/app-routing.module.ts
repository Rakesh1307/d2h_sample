import { LoginComponent } from 'src/app/login/login.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CurrentBalanceComponent } from './dashboard/current-balance/current-balance.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './helpers/auth.guards';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'currentbalance',
    component: CurrentBalanceComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
