import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import alertify from 'alertifyjs';
import { faSignOut } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  faSignOut = faSignOut
  constructor(private authSvc: AuthService, private router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  logout() {
    alertify.confirm('Are you sure you want to logout?', () => {
      this.authSvc.signout().subscribe(() => {
        this.router.navigate(['/'])
      })
    });
  }
}
