import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'client/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  user = {
    userId: '',
    password: ''
  }
  processing = false

  constructor(private authSvc: AuthService, private router: Router) {
  }

  logUserIn() {
    this.processing = true
    this.authSvc.signin(this.user.userId, this.user.password).subscribe(() => {
      this.router.navigate(['/dashboard'])
    }).add(() => this.processing = false)
  }
}
