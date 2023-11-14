import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable, catchError, map, of, tap } from "rxjs"
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedUser: any;

  /**
   *
   */
  constructor(private http: HttpClient) {
  }

  signup(name: string, email: string, password: string) {
    return this.http.post(`http://localhost:3001/auth/signup`, { name, email, password }).pipe(map((user: any) => {
      this.loggedUser = user
    }));
  }

  signin(email: string, password: string) {
    return this.http.post<any>(`http://localhost:3001/auth/signin`, { email, password })
      .pipe(map(user => {
        this.loggedUser = user
      }));
  }

  signout(data: any) {
    this.loggedUser = null
    return this.http.post<any>(`http://localhost:3001/auth/signout`, data).pipe(tap(() => this.loggedUser = null));
  }

  getCurrentUser(): Observable<any> {
    if (this.loggedUser) {
      return of(this.loggedUser);
    } else {
      return this.http.get<any>(`http://localhost:3001/api/user`).pipe(tap(user => this.loggedUser = user))
    }
  }

  isLoggedIn$(): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => !!user),
      catchError(() => of(false))
    );
  }

}