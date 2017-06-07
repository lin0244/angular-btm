import {Injectable} from '@angular/core';
import {Http, Jsonp, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { Parameter } from '../parameter.service';
@Injectable()
export class Login {
  constructor(private http: Http, private jsonp: Jsonp, private parameter: Parameter) {}
  useLogin(userName: any, passWord: any) {
      const apiUrl = this.parameter.apiUrl + '/api-schedule/user/login';
      const params = new URLSearchParams();
      params.set('userName', userName);
      params.set('password', passWord);
      return this.http.get(apiUrl, { search: params })
        .map(res => res.json());
  }

  // 退出清除session
  invalidateSession() {
      const apiUrl = this.parameter.apiUrl + '/api-schedule/user/invalidateSession';
      return this.http.get(apiUrl)
        .map(res => res);
  }
}
