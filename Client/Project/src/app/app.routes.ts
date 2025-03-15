import { Routes } from '@angular/router';
import { AuthComponent } from './_components/auth/auth.component';
import { RegisterComponent } from './_components/register/register.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'register', component: RegisterComponent },
];
