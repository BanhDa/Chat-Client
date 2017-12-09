/**
 * New typescript file
 */
import { Constant } from '../common/constant';
import { ResponseData } from '../entity/response.data';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ApiService {

  headers: Headers;
  options: RequestOptions;

  constructor(private http: Http) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', localStorage.getItem('token'));
    this.options = new RequestOptions({ headers: this.headers, method: 'post'});
  }

  post(url: string, data: string): Observable<ResponseData> {
    console.log('call api');
    this.addHeaders();
    return this.http.post(url, data, this.options).map( (response: Response) => {
      return this.extractData(response);
    }).catch(this.handleError);
  }

  getFile(url: string): Observable<any> {
    this.addHeaders();
    return this.http.get(url, this.options).map( (response: any) => {
      return response;
    }).catch(this.handleError);
  }

  postImage(url: string, data: any): Observable<ResponseData> {
    this.addHeaders();
    return this.http.post(url, data, this.options).map( (response: Response) => {
      return this.extractData(response);
    }).catch(this.handleError);
  }

  addHeaders() {
    console.log('add headers');
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', localStorage.getItem(Constant.TOKEN));
    console.log(this.headers);
    this.options = new RequestOptions({ headers: this.headers, method: 'post'});
  }

  private extractData(res: Response) {
    const body = res.json();
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
