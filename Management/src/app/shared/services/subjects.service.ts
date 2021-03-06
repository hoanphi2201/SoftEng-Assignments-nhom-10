import { Injectable } from '@angular/core';
import {ISubject} from '../defines/subject';
import {AppSettings} from '../helper/app.setting';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of, Subject} from "rxjs";
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

    changeStatus(id: string, objUpdate: ISubject): Observable<ISubject> {
        return this._httpService.put(`${this.apiUrl}/change-status/${id}`, objUpdate)
            .pipe(
                tap(_ => { }),
                catchError(this.handleError<any>('changeStatus'))
            );
    }

    changeStatusMulti(objUpdate: any[]): Observable<ISubject[]> {
        return this._httpService.put(`${this.apiUrl}/change-status`, objUpdate)
            .pipe(
                tap(_ => { }),
                catchError(this.handleError<any>('changeStatusMulti'))
            );
    }


    clickOnChangeMulti(objUpdate: any): Observable<any> {
        return this.changeStatusMulti(objUpdate);
    }

    deleteSubject(id: string): Observable<ISubject[]> {
        return this._httpService.delete<ISubject[]>(`${this.apiUrl}/${id}`, this.options)
            .pipe(
                tap(_ => console.log(`delete subject with id = ${id}`)),
                catchError(this.handleError<any>('deleteSubject'))
            );
    }

    addSubject(newSubject: any): Observable<ISubject> {
        console.log(newSubject);
        return this._httpService.post(`${this.apiUrl}`, newSubject, this.options)
            .pipe(
                tap((subject: ISubject) => console.log(`inserted subject = ${JSON.stringify(subject)}`)),
                catchError(this.handleError<any>('addSubject'))
            );
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this.router.navigate(['/pages', 'errors']);
            return of(result as T);
        };
    }
}
