import { Injectable } from '@angular/core';
import * as stream from 'getstream';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GetStreamService {
  public email :any ;
  public encodedEmail : string;
  constructor(
  private http: Http
  ){}
  private feedsUrl = 'http://localhost:8080/feed/choice/1';
  private tokenUrl = 'http://localhost:8080/feed/token/1';
  ngOnInit(){
  }

   getFeed() : Observable<any> {
             return this.http.get(this.feedsUrl)
                             .map((res:Response) => res.json())
                             .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
         }
  getToken() : Observable<any> {
             return this.http.get(this.tokenUrl)
                             .map((res:Response) => res.json())
                             .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
         }

}
