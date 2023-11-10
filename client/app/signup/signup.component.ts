import { Component } from '@angular/core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'client/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  faGoogle = faGoogle
  faSpinner = faSpinner
  processing = false
  user = {
    name: '',
    userId: '',
    password: '',
    repassword: ''
  }

  /**
   *
   */
  constructor(private authSvc: AuthService) {
  }

  register() {
    this.processing = true
    this.authSvc.signup(this.user.name, this.user.userId, this.user.password).subscribe(() => {

    }).add(() => this.processing = false)
  }
}
