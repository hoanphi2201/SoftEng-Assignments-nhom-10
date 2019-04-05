import { Injectable } from '@angular/core';

import {ICategory} from '../defines/category';
import {AppSettings} from '../helper/app.setting';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {Router} from '@angular/router';


@Injectable()
export class CategoriesService {
    private apiUrl = `${AppSettings.API_ENDPOINT}/admin/category`;
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    options = { headers: this.headers, withCredentials: true };
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
