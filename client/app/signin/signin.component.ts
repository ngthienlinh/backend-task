import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'client/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  invalid = false
  user = {
    email: '',
    password: ''
  }
  processing = false

  constructor(private authSvc: AuthService, private router: Router) {
    this.authSvc.isLoggedIn$().subscribe(() => {
      this.router.navigate(['/dashboard'])
    })
  }

  logUserIn() {
    this.invalid = false
    this.processing = true
    this.authSvc.signin(this.user.email, this.user.password).subscribe(() => {
      this.router.navigate(['/dashboard'])
    }, err => {
      this.invalid = true
    }).add(() => this.processing = false)
  }
}
