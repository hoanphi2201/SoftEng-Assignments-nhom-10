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
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this.router.navigate(['/pages', 'errors']);
            return of(result as T);
        };
    }
}
