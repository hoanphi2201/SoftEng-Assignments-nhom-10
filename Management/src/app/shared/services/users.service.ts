import { Injectable } from '@angular/core';

import {IUser} from '../defines/user';
import {AppSettings} from '../helper/app.setting';
import {showNotification} from "../helper/notification";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";


@Injectable()
export class UsersService {
    private apiUrl = `${AppSettings.API_ENDPOINT}/admin/users`;
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    options = { headers: this.headers, withCredentials: true };
    constructor(private _httpService: HttpClient) {

    }
    getItems(group: string, status: string, sort_field: string, sort_type: string,  keyword: string ): Observable<IUser[]> {
        return this._httpService.get(`${this.apiUrl}/${group}/${status}/${sort_field}/${sort_type}/?keyword=${keyword}`, {
            withCredentials: true
        }).pipe(
            tap(_ => {}),
            catchError(this.handleError<any>('getItems'))
        );
    }
    getUserById(id: string): Observable<IUser[]> {
        return this._httpService.get(`${this.apiUrl}/user-detail/${id}`, {
            withCredentials: true
        }).pipe(
            tap(_ => {}),
            catchError(this.handleError<any>('getUserById'))
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