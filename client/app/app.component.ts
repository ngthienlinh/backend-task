import { Component } from '@angular/core';
import * as alertify from 'alertifyjs';
import { AuthService } from 'client/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Backend Task';

  /**
   *
   */
  constructor(public authSvc: AuthService) {
    alertify.defaults.glossary.title = 'Message';
  }
}
