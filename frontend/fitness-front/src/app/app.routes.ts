import { Routes } from '@angular/router';
import { ProgramListComponent } from './components/program-list/program-list.component';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  // ============================================================================
  // PUBLIC ROUTES (Authentication not required)
  // ============================================================================
  {
    path: '',
    component: ProgramListComponent,
    title: 'Fitness Programları'
  },
  {
    path: 'program/:id',
    loadComponent: () => import('./components/program-detail/program-detail.component')
      .then(m => m.ProgramDetailComponent),
    title: 'Program Detayı'
  },

  // ============================================================================
  // AUTHENTICATION ROUTES (Only for guests - not authenticated users)
  // ============================================================================
  {
    path: 'auth/login',
    loadComponent: () => import('./components/auth/login/login.component')
      .then(m => m.LoginComponent),
    title: 'Giriş Yap',
    canActivate: [guestGuard]
  },
  {
    path: 'auth/verify',
    loadComponent: () => import('./components/auth/verify-email/verify-email.component')
      .then(m => m.VerifyEmailComponent),
    title: 'Email Doğrulama'
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./components/auth/register/register.component')
      .then(m => m.RegisterComponent),
    title: 'Hesap Oluştur',
    canActivate: [guestGuard]
  },

  // ============================================================================
  // PROTECTED ROUTES (Authentication required) - Will be added later
  // ============================================================================
  // {
  //   path: 'dashboard',
  //   loadComponent: () => import('./components/dashboard/dashboard.component')
  //     .then(m => m.DashboardComponent),
  //   title: 'Dashboard',
  //   canActivate: [authGuard]
  // },

  // ============================================================================
  // REDIRECTS & FALLBACKS
  // ============================================================================
  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
