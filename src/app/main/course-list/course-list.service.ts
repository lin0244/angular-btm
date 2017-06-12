import {Injectable} from '@angular/core';
import {Http, Jsonp, Headers,URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

import { Parameter } from '../../parameter.service';

@Injectable()
export class CourseListService {

  constructor(private http:Http,private jsonp:Jsonp,private parameter: Parameter){}

    //课程列表查询
    getCourse(sta:any,sId:any,sVa:any,pN:any,pS:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/courseList.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

}
