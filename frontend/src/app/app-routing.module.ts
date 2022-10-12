import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { TeamComponent } from './team.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { AuthGuard } from './auth.guard';
import { AuthGuardService } from './auth-guard.service';


const routes: Routes = [
 
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]

  },
  {
    path: 'login',
    component: LoginComponent

  },
  {
    path: 'register',
    component: RegisterComponent

  },
  {
    path: 'create/team',
    component: TeamComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: HomeComponent,
    canActivate: [AuthGuard]

  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
