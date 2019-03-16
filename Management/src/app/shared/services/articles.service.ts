import { Injectable } from '@angular/core';
import {IArticle} from '../defines/article';
import {AppSettings} from '../helper/app.setting';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {showNotification} from "../helper/notification";



@Injectable()
export class ArticlesService {
    private apiUrl = `${AppSettings.API_ENDPOINT}/admin/article`;
    headers = new HttpHeaders({'Content-Type': 'application/json'});
    options = { headers: this.headers , withCredentials: true};
    constructor(private _httpService: HttpClient) {

    }
    getItems(group: string, status: string, sort_field: string, sort_type: string,  keyword: string ): Observable<IArticle[]> {
        return this._httpService.get(`${this.apiUrl}/${group}/${status}/${sort_field}/${sort_type}/?keyword=${keyword}`, {
            withCredentials: true
        }).pipe(
            tap(_ => {}),
            catchError(this.handleError<any>('getItems'))
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