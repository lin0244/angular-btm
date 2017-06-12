import {Injectable} from '@angular/core';
import {Http, Jsonp, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Login {
  constructor(private http: Http, private jsonp: Jsonp) {}
  useLogin(userName: any, passWord: any) {
      const apiUrl = 'http://localhost:4200/assets/mock-json/login.json';
      const params = new URLSearchParams();
      // params.set('userName', userName);        //使用假数据，暂时不需要参数
      // params.set('password', passWord);
      return this.http.get(apiUrl, { search: params })
        .map(res => res);
  }

  // 退出清除session
  invalidateSession() {
      // const apiUrl = '';
      // return this.http.get(apiUrl)
      //   .map(res => res);
  }
}
