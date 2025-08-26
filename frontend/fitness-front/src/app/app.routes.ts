import { Routes } from '@angular/router';
import { ProgramListComponent } from './components/program-list/program-list.component';
import { authGuard, guestGuard, adminGuard } from './guards/auth.guard';
import { AddProgramComponent } from './components/add-program/add-program.component';

export const routes: Routes = [
  // ============================================================================
  // PUBLIC ROUTES (Authentication not required)
  // ============================================================================
  {
    path: '',
    component: ProgramListComponent,
    title: 'Fitness Programları'
  },
  // Create Program (as a full page) — MUST be before 'program/:id'
  {
    path: 'program/create',
  component: AddProgramComponent,
  title: 'Yeni Program Oluştur'
  },
  {
    path: 'program/:id',
    loadComponent: () => import('./components/program-detail/program-detail.component')
      .then(m => m.ProgramDetailComponent),
    title: 'Program Detayı'
  },
  {
    path: 'program/:id/weekly-plan',
    loadComponent: () => import('./components/weekly-plan/weekly-plan.component')
      .then(m => m.WeeklyPlanComponent),
    title: 'Haftalık Plan'
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
  // ADMIN ROUTES (Admin authentication required)
  // ============================================================================
  {
    path: 'admin/program/edit/:id',
    loadComponent: () => import('./components/edit-program/edit-program.component')
      .then(m => m.EditProgramComponent),
    title: 'Program Düzenle',
    canActivate: [adminGuard]
  },

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
