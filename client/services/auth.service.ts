import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable, map } from "rxjs"
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable()

  /**
   *
   */
  constructor(private http: HttpClient) {
  }

  signup(username: string, email: string, password: string) {
    return this.http.post(`/auth/signup`, { username, email, password }).pipe(map(user => {
      if (user && user.token) {
        this.isAuthenticatedSubject.next(true)
      }
    }));
  }

  signin(email: string, password: string) {
    return this.http.post<any>(`/auth/signin`, { email, password })
      .pipe(map(user => {
        if (user && user.token) {
          this.isAuthenticatedSubject.next(true)
        }
      }));
  }

  signout(data) {
    this.isAuthenticatedSubject.next(false)
    return this.http.post<any>(`/auth/signout`, data)
  }

}