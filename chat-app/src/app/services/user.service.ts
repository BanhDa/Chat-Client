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
import { GetUserInfoRequest } from '../entity/request/getuserinforequest';
import { SearchRequest } from '../entity/request/searchrequest';
import { ApiService } from './api.service';

@Injectable()
export class UserService {

  constructor(private apiService: ApiService) {
  }

  login(data: User): Observable<ResponseData> {
    const path = '/user/login';
    const url = Constant.BASE_URL + path;
    return this.apiService.post(url, JSON.stringify(data));
  }

  register(data: User): Observable<ResponseData> {
    const path = '/user/register';
    const url = Constant.BASE_URL + path;

    return this.apiService.post(url, JSON.stringify(data));
  }


  getUser(userId: string): Observable<ResponseData> {
    const path = '/user/profile';
    const url = Constant.BASE_URL + path + '?userid=' + userId;

    return this.apiService.post(url, JSON.stringify(''));
  }

  updateUserInfo(user: User): Observable<ResponseData> {
    const path = '/user/editprofile';
    const url = Constant.BASE_URL + path;
    return this.apiService.post(url, JSON.stringify(user));
  }

  searchUser(searchUserName: string, skip: number, take: number): Observable<ResponseData> {
    const path = '/user/searchuser';
    const url = Constant.BASE_URL + path;

    const data = new SearchRequest();
    data.searchUserName = searchUserName;
    data.skip = skip;
    data.take = take;

    return this.apiService.post(url, JSON.stringify(data));
  }

  logout(): Observable<ResponseData> {
    const path = '/user/logout';
    const url = Constant.BASE_URL + path;

    return this.apiService.post(url, JSON.stringify(''));
  }
}
