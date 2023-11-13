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

  signup(name: string, email: string, password: string) {
    return this.http.post(`http://localhost:3001/auth/signup`, { name, email, password }).pipe(map((user: any) => {
      if (user && user.token) {
        this.isAuthenticatedSubject.next(true)
      }
    }));
  }

  signin(email: string, password: string) {
    return this.http.post<any>(`http://localhost:3001/auth/signin`, { email, password })
      .pipe(map(user => {
        if (user && user.token) {
          this.isAuthenticatedSubject.next(true)
        }
      }));
  }

  signout(data: any) {
    this.isAuthenticatedSubject.next(false)
    return this.http.post<any>(`http://localhost:3001/auth/signout`, data)
  }

}