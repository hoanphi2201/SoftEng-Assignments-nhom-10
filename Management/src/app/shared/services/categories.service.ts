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

    getItems(status: string, sort_field: string, sort_type: string, keyword: string ): Observable<ICategory[]> {
        return this._httpService.get(`${this.apiUrl}/${status}/${sort_field}/${sort_type}?keyword=${keyword}`, {
            withCredentials: true
        }).pipe(
            tap(_ => {}),
            catchError(this.handleError<any>(' getItems'))
        );
    }
    changeStatusMulti(objUpdate: any): Observable<ICategory> {
        return this._httpService.put(`${this.apiUrl}/change-status`, objUpdate, this.options )
            .pipe(
                tap(_ => {}),
                catchError(this.handleError<any>('changeStatusMulti'))
            );
    }
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this.router.navigate(['/pages', 'errors']);
            return of(result as T);
        };
    }

}