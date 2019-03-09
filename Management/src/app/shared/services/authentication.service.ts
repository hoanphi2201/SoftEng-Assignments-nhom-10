import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from '../helper/app.setting';

@Injectable()
export class AuthenticationService {
    constructor(private _httpService: Http) { }
    login(username: string, password: string): Observable<any> {
        return this._httpService.post(`${AppSettings.API_ENDPOINT}/auth/user/login`, {  username: username, password: password }, {
            withCredentials: true
        }).map(this.extractData).catch(this.handleError);

    }
    logout() {
        return this._httpService.get(`${AppSettings.API_ENDPOINT}/auth/user/logout`, {
            withCredentials: true
        }).map(this.extractData).catch(this.handleError);
    }
    // isLogin() {
    //     return this._httpService.get(`${AppSettings.API_ENDPOINT}/auth/user/islogin`, {
    //         withCredentials: true
    //     }).map(this.extractData).catch(this.handleError);
    // }
    loginFacebook(data: any): Observable<any> {
        return this._httpService.post(`${AppSettings.API_ENDPOINT}/auth/user/login-facebook`, data, {
            withCredentials: true
        }).map(this.extractData).catch(this.handleError);

    }
    loginGoogle(data: any): Observable<any> {
        return this._httpService.post(`${AppSettings.API_ENDPOINT}/auth/user/login-google`, data, {
            withCredentials: true
        }).map(this.extractData).catch(this.handleError);

    }
    private extractData(res: Response) {
        return res.json() || { };
    }
    private handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }
}