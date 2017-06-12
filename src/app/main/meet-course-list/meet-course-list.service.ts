import {Injectable} from '@angular/core';
import {Http, Jsonp, Headers,URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

import { Parameter } from '../../parameter.service';

@Injectable()
export class MeetCourseListService {

  constructor(private http:Http,private jsonp:Jsonp,private parameter: Parameter){}

    //通过查询所有学校列表
    getSchool(){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/getSchoolByProvinces';
        let params = new URLSearchParams();
        params.set('provinces', '');

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //见面课列表查询
    getMeetCourse(sC:any,sVa:any,sta:any,sI:any,sT:any,eT:any,pN:any,pS:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/getMeetCourse';

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //课表管理列表页查询接口
    getSchedule(){
        let apiUrl = 'http://localhost:4200/assets/mock-json/getSchedule.json';
        return this.http.get(apiUrl)
          .map(res => res);
    }

    //获取周信息
    getWeek(id:any,week:any){
        let apiUrl = 'http://localhost:4200/assets/mock-json/getWeek.json';

        return this.http.get(apiUrl)
          .map(res => res);
    }

}
