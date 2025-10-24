import { Routes } from '@angular/router';
import {Home} from './shared/presentation/views/home/home';
import { AuthGuard } from './shared/application/auth.guard';
import { SplashComponent } from './shared/presentation/views/splash/splash';
import { DashboardComponent } from './shared/presentation/views/dashboard/dashboard';

const about = () => import('./shared/presentation/views/about/about').then(m => m.About);
const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found')
  .then(m => m.PageNotFound);
const login = () => import('./shared/presentation/views/login/login').then(m => m.Login);
const register = () => import('./shared/presentation/views/register/register').then(m => m.Register);

const baseTitle = 'NoteTo';
export const routes: Routes = [
  { path: 'splash', component: SplashComponent, title: `${baseTitle} - Bienvenido` },
  { 
    path: 'auth', 
    children: [
      { path: 'login', loadComponent: login, title: `${baseTitle} - Iniciar Sesión` },
      { path: 'register', loadComponent: register, title: `${baseTitle} - Registro` },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  { path: 'login', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'register', redirectTo: '/auth/register', pathMatch: 'full' },
  { path: 'home', component: Home, title: `${baseTitle} - Home`, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, title: `${baseTitle} - Dashboard`, canActivate: [AuthGuard] },
  { path: 'about', loadComponent: about, title: `${baseTitle} - About`, canActivate: [AuthGuard] },
  { path: 'learning', loadChildren: () =>
  import('./learning/presentation/views/learning.routes').then(m => m.learningRoutes), canActivate: [AuthGuard]},
  { path: '', redirectTo: '/splash', pathMatch:'full' },
  { path: '**', loadComponent: pageNotFound, title: `${baseTitle} - Page Not Found` },
];
