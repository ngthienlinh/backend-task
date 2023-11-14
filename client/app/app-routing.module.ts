import { NgModule, inject } from '@angular/core'
import { CanMatchFn, Router, RouterModule, Routes } from '@angular/router'
import { SigninComponent } from './signin/signin.component'
import { SignupComponent } from './signup/signup.component'
import { take, tap } from 'rxjs'
import { AuthService } from 'client/services/auth.service'

const isAuthenticated: CanMatchFn = () => {
  const authService = inject(AuthService)
  const router = inject(Router)
  return authService.isLoggedIn$().pipe(
    take(1),
    tap((isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        router.navigate(['/'])
      }
    })
  )
}

const routes: Routes = [
  { path: '', component: SigninComponent, pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  {
    path: 'profile',
    canMatch: [isAuthenticated],
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'dashboard',
    canMatch: [isAuthenticated],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
