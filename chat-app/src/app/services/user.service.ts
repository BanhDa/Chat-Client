/**
 * New typescript file
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { User } from '../entity/user';
import { ResponseData } from '../entity/response.data';
import { Constant } from '../common/constant';

@Injectable()
export class UserService {

  headers: Headers;
  options: RequestOptions;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', localStorage.getItem('token'));
    this.options = new RequestOptions({ headers: this.headers, method: 'post'});
  }

  login(data: User): Observable<ResponseData> {
    const path = 'user/login';
    const url = Constant.BASE_URL + path;
    console.log(this.headers);
//    console.log(this.options);
    return this.http.post(url, JSON.stringify(data), this.options).map( (response: Response) => {
      return this.extractData(response);
    }).catch(this.handleError);
  }

  register(data: User): Observable<ResponseData> {
    const path = 'user/register';
    const url = Constant.BASE_URL + path;

    return this.http.post(url, JSON.stringify(data), this.options).map( (response: Response) => {
      return this.extractData(response);
    }).catch(this.handleError);
  }

  getUser(userId: string): any {
    const path = 'profile';
    const url = Constant.BASE_URL + path + '?userId=' + userId;
    console.log('get user');
    console.log(url);
    return this.http.get(url).map ( (response: Response) => {
      return this.extractData(response);
    }).catch(this.handleError);
  }




  private extractData(res: Response) {
    const body = res.json();
    console.log('response');
    console.log(body);
    return body || {};
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
