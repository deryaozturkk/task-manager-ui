import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { authGuard } from './services/auth.guard'; 
import { ProfileComponent } from './pages/profile/profile.component'; 

export const routes: Routes = [
  {
    path: 'login', 
    component: LoginComponent,
  },
  {
    path: 'register', 
    component: RegisterComponent,
  },
  {
    path: 'tasks', 
    component: TasksComponent,
    canActivate: [authGuard] 
  },
  {
    path: '',
    redirectTo: '/tasks', 
    pathMatch: 'full',
  },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [authGuard] 
  },
  {
    path: '**',
    redirectTo: '/tasks', 
  }
];