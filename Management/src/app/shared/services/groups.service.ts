import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {IGroup} from '../defines/group';
import {AppSettings} from '../helper/app.setting';
import {showNotification} from "../helper/notification";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";


@Injectable()
export class GroupsService {
    private apiUrl = `${AppSettings.API_ENDPOINT}/admin/groups`;
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    options = { headers: this.headers,  withCredentials: true };
    constructor(private _httpService: HttpClient) {
    }

    getItems(status: string, sort_field: string, sort_type: string, keyword: string ): Observable<IGroup[]> {
        return this._httpService.get(`${this.apiUrl}/${status}/${sort_field}/${sort_type}?keyword=${keyword}`, {
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