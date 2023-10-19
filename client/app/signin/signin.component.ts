import { Component } from '@angular/core';

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

  logUserIn() {
    this.processing = !this.processing
  }
}
