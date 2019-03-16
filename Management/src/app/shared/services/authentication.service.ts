import { Injectable } from '@angular/core';
import {AppSettings} from '../helper/app.setting';
import {showNotification} from "../helper/notification";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class AuthenticationService {
    constructor(private _httpService: HttpClient) { }
    login(username: string, password: string): Observable<any> {
        return this._httpService.post(`${AppSettings.API_ENDPOINT}/auth/user/login`, {  username: username, password: password }, {
            withCredentials: true
        }).pipe(
            tap(_ => {}),
            catchError(this.handleError<any>('login'))
        );

    }
    logout() {
        return this._httpService.get(`${AppSettings.API_ENDPOINT}/auth/user/logout`, {
            withCredentials: true
        }).pipe(
            tap(_ => {}),
            catchError(this.handleError<any>('logout'))
        );
    }
    // isLogin() {
    //     return this._httpService.get(`${AppSettings.API_ENDPOINT}/auth/user/islogin`, {
    //         withCredentials: true
    //     }).pipe(
    //             tap(_ => {}),
    //             catchError(this.handleError<any>(' isLogin'))
    //         );
    // }
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
            showNotification('top', 'right', 100, 'Server errors !');
            console.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }
}