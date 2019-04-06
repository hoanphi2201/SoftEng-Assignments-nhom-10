import { Injectable } from '@angular/core';
import { IExam } from '../defines/exam';
import { AppSettings } from '../helper/app.setting';
import {Observable, of, Subject} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import {Router} from '@angular/router';


@Injectable()
export class ExamsService {
    private apiUrl = `${AppSettings.API_ENDPOINT}/admin/exam`;
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    options = { headers: this.headers, withCredentials: true };
    constructor(
        private _httpService: HttpClient,
        private router: Router) {

    }

    getItems(group: string, status: string, sort_field: string, sort_type: string, keyword: string): Observable<IExam[]> {
        return this._httpService.get(`${this.apiUrl}/${group}/${status}/${sort_field}/${sort_type}/?keyword=${keyword}`, {
            withCredentials: true
        }).pipe(
            tap(_ => { }),
            catchError(this.handleError<any>('getItems'))
        );
    }
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            this.router.navigate(['/pages', 'errors']);
            return of(result as T);
        };
    }

    changeStatus(id: string, objUpdate: any): Observable<IExam> {
        return this._httpService.put(`${this.apiUrl}/change-status/${id}`, objUpdate)
            .pipe(
                tap(_ => { }),
                catchError(this.handleError<any>('changeStatus'))
            );
    }

    changeStatusMulti(objUpdate: any[]): Observable<IExam[]> {
        return this._httpService.put(`${this.apiUrl}/change-status`, objUpdate)
            .pipe(
                tap(_ => { }),
                catchError(this.handleError<any>('changeStatusMulti'))
            );
    }

    changeSpecial(id: string, objUpdate: any): Observable<IExam> {
        return this._httpService.put(`${this.apiUrl}/change-special/${id}`, objUpdate)
            .pipe(
                tap(_ => { }),
                catchError(this.handleError<any>('changeSpecial'))
            );
    }

    changeSpecialMulti(objUpdate: any[]): Observable<IExam[]> {
        return this._httpService.put(`${this.apiUrl}/change-special`, objUpdate)
            .pipe(
                tap(_ => { }),
                catchError(this.handleError<any>('changeSpecialMulti'))
            );
    }

    changeMultiOnClick(objUpdate: any, prop): Observable<any> {
        if (prop === 'status') {
            return this.changeStatusMulti(objUpdate);
        } else if (prop === 'special') {
            return this.changeSpecialMulti(objUpdate);
        }
    }

    saveUser(formData: any): Observable<IExam> {
        return this._httpService.post(this.apiUrl, formData)
            .pipe(
                tap(_ => {}),
                catchError(this.handleError<any>('saveUser'))
            );
    }

    private submitedExam: Subject<any> = new Subject<any>();

    public getSubmitedExam(): Observable<any> {
        return this.submitedExam.asObservable();
    }

    public setSubmitedExam(exam: any): void {
        this.submitedExam.next(exam);
    }
}
