import { Injectable } from '@angular/core';
import {ISubject} from '../defines/subject';
import {AppSettings} from '../helper/app.setting';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {Router} from '@angular/router';

@Injectable()
export class SubjectsService {
    private apiUrl = `${AppSettings.API_ENDPOINT}/admin/subject`;
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    options = { headers: this.headers, withCredentials: true };
    constructor(
        private _httpService: HttpClient,
        private router: Router) {

    }

    getItems(status: string, sort_field: string, sort_type: string, keyword: string ): Observable<ISubject[]> {
        return this._httpService.get(`${this.apiUrl}/${status}/${sort_field}/${sort_type}?keyword=${keyword}`, {
            withCredentials: true
        }).pipe(
            tap(_ => {}),
            catchError(this.handleError<any>('getItems'))
        );
    }
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this.router.navigate(['/pages', 'errors']);
            return of(result as T);
        };
    }

}