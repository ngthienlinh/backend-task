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

  signup(name: string, userId: string, password: string) {
    return this.http.post(`http://localhost:3001/auth/signup`, { name, userId, password }).pipe(map((user: any) => {
      if (user && user.token) {
        this.isAuthenticatedSubject.next(true)
      }
    }));
  }

  signin(userId: string, password: string) {
    return this.http.post<any>(`http://localhost:3001/auth/signin`, { userId, password })
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