import {Injectable} from '@angular/core';
import {Http, Jsonp, Headers,URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

import { Parameter } from '../../parameter.service';

@Injectable()
export class MeetCourseListService {

  constructor(private http:Http,private jsonp:Jsonp,private parameter: Parameter){}

    //课程列表查询
    getCourse(sta:any,sId:any,sVa:any,pN:any,pS:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/c/find';
        let params = new URLSearchParams();
        params.set('status', sta);
        params.set('scheduleId', sId);
        params.set('searchValue', sVa);
        params.set('pageNum', pN);
        params.set('pageSize', pS);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

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
        let apiUrl = this.parameter.apiUrl+'/api-schedule/l/getLiveInfoPage';
        let params = new URLSearchParams();
        params.set('schoolCode', sC);
        params.set('searchValue', sVa);
        params.set('status', sta);
        params.set('scheduleId', sI);
        params.set('startTime', sT);
        params.set('endTime', eT);
        params.set('pageNum', pN);
        params.set('pageSize', pS);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

     //见面课列表 导出
    getLiveInfoPageDownload(sC:any,sVa:any,sta:any,sI:any,sT:any,eT:any,pN:any,pS:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/l/getLiveInfoPageDownload';
        let params = new URLSearchParams();
        params.set('schoolCode', sC);
        params.set('searchValue', sVa);
        params.set('status', sta);
        params.set('scheduleId', sI);
        params.set('startTime', sT);
        params.set('endTime', eT);
        params.set('pageNum', pN);
        params.set('pageSize', pS);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //课表管理列表页查询接口
    getSchedule(){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/s/getSchedule';
        return this.http.get(apiUrl)
          .map(res => res);
    }

    //获取周信息
    getWeek(id:any,week:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/run/getWeek';
        let params = new URLSearchParams();
        params.set('scheduleId', id);
        params.set('week', week);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

}
