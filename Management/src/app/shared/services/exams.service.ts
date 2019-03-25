import { Injectable } from '@angular/core';
import {IExam} from '../defines/exam';
import {AppSettings} from '../helper/app.setting';
import {showNotification} from "../helper/notification";
import {Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";


@Injectable()
export class ExamsService {
    private apiUrl = `${AppSettings.API_ENDPOINT}/admin/exam`;
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    options = { headers: this.headers,  withCredentials: true };
    constructor(private _httpService: HttpClient) {

    }
    getItems(group: string, status: string, sort_field: string, sort_type: string,  keyword: string ): Observable<IExam[]> {
        return this._httpService.get(`${this.apiUrl}/${group}/${status}/${sort_field}/${sort_type}/?keyword=${keyword}`, {
            withCredentials: true
        }).pipe(
            tap(_ => {}),
            catchError(this.handleError<any>('getItems'))
        );
    }

    changeStatus(id: string, objUpdate: any): Observable<IExam> {
        return this._httpService.put(`${this.apiUrl}/change-status/${id}`, objUpdate)
            .pipe(
                tap(_ => {}),
                catchError(this.handleError<any>('changeStatus'))
            );
    }

    changeStatusMulti(objUpdate: any[]): Observable<IExam[]> {
        return this._httpService.put(`${this.apiUrl}/change-status`, objUpdate)
            .pipe(
                tap(_ => {}),
                catchError(this.handleError<any>('changeStatusMulti'))
            );
    }

    changeSpecial(id: string, objUpdate: any): Observable<IExam> {
        return this._httpService.put(`${this.apiUrl}/change-special/${id}`, objUpdate)
            .pipe(
                tap(_ => {}),
                catchError(this.handleError<any>('changeSpecial'))
            );
    }

    changeSpecialMulti(objUpdate: any[]): Observable<IExam[]> {
        return this._httpService.put(`${this.apiUrl}/change-special`, objUpdate)
            .pipe(
                tap(_ => {}),
                catchError(this.handleError<any>('changeSpecialMulti'))
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