import { Component } from '@angular/core';
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

  constructor(private authSvc: AuthService) {
  }

  logUserIn() {
    this.processing = true
    this.authSvc.signin(this.user.userId, this.user.password).subscribe(() => {

    }).add(() => this.processing = false)
  }
}
