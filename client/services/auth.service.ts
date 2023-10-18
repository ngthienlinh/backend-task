import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable } from "rxjs"

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
    isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable()
}