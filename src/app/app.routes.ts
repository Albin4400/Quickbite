import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Foods } from './pages/foods/foods';
import { Contact } from './pages/contact/contact';
import { About } from './pages/about/about';
import { Recipedetails } from './pages/recipedetails/recipedetails';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'food', component: Foods, canActivate: [authGuard] },
  { path: 'foods', component: Foods, canActivate: [authGuard] },
  { path: 'contact', component: Contact },
  { path: 'about', component: About },
  { path: 'recipedetails/:id', component: Recipedetails, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
  
];

