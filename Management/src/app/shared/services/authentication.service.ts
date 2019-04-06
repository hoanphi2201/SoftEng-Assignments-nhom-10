import { Injectable } from '@angular/core';
import {AppSettings} from '../helper/app.setting';
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';

@Injectable()
export class AuthenticationService {
    constructor(
        private _httpService: HttpClient,
        private router: Router) {

    }
    login(username: string, password: string): Observable<any> {
        return this._httpService.post(`${AppSettings.API_ENDPOINT}/auth/user/login`, {  username: username, password: password }, {
            withCredentials: true
        }).pipe(
            tap(_ => {}),
            catchError(this.handleError<any>('login'))
        );

    }
    
    loginFacebook(data: any): Observable<any> {
        return this._httpService.post(`${AppSettings.API_ENDPOINT}/auth/user/login-facebook`, data, {
            withCredentials: true
        }).pipe(
            tap(_ => {}),
            catchError(this.handleError<any>('loginFacebook'))
        );

    }
    loginGoogle(data: any): Observable<any> {
        return this._httpService.post(`${AppSettings.API_ENDPOINT}/auth/user/login-google`, data, {
            withCredentials: true
        }).pipe(
            tap(_ => {}),
            catchError(this.handleError<any>('loginGoogle'))
        );
    }
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this.router.navigate(['/pages', 'errors']);
            return of(result as T);
        };
    }
}
