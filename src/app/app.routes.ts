import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import {Foods} from './pages/foods/foods';
import {Contact} from './pages/contact/contact';
import { About } from './pages/about/about';
import { Recipedetails } from './pages/recipedetails/recipedetails';
export const routes: Routes = [
{path:'',component:Home},
{path:'home',component:Home},
{path:'foods',component:Foods},
{path:'contact',component:Contact},
{path:'about',component:About},
{path: 'recipedetails/:id',component: Recipedetails }


];
