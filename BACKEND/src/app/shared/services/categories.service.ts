import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Statics
import 'rxjs/add/observable/throw';
import {HttpHeaders} from '@angular/common/http';
import {ICategory} from '../defines/category';
import {AppSettings} from '../helper/app.setting';


@Injectable()
export class CategoriesService {
    private apiUrl = `${AppSettings.API_ENDPOINT}/admin/category`;
    headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers, withCredentials: true });
    constructor(private _httpService: Http) {
    }

    getItems(status: string, sort_field: string, sort_type: string, keyword: string ): Observable<ICategory[]> {
        return this._httpService.get(`${this.apiUrl}/${status}/${sort_field}/${sort_type}?keyword=${keyword}`, {
            withCredentials: true
        }).map(this.extractData).catch(this.handleError);
    }
    private extractData(res: Response) {
        return res.json() || { };
    }
    changeStatusMulti(objUpdate: any): Observable<ICategory> {
        return this._httpService.put(`${this.apiUrl}/change-status`, objUpdate, this.options )
            .map(this.extractData).catch(this.handleError);
    }

    private handleError (error: Response | any) {

        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }

}