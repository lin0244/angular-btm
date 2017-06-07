import {Injectable} from '@angular/core';
import {Http, Jsonp, Headers,URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

import { Parameter } from '../../parameter.service';

@Injectable()
export class DirectorService {
    constructor(private http:Http,private jsonp:Jsonp,private parameter: Parameter){}

    //课表管理列表页查询接口
    getSchedule(){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/s/getSchedule';
        return this.http.get(apiUrl)
          .map(res => res);
    }

    //获取专员列表
    getCommissionerList(){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/user/findByRole';
        let params = new URLSearchParams();
        params.set('role', "2");

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //获取某周见面课专员分配情况信息
    getWeekZhuanyuanPersonInfo(scheduleId:any,week:any,zhsId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/safe/getWeekZhiBanPersonInfo';
        let params = new URLSearchParams();
        params.set('scheduleId', scheduleId);
        params.set('week', week);
        params.set('zhsIds', zhsId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }


    //获取今日见面课列表
    getTodayliveInfor(scheduleId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/run/todayliveInfor';
        let params = new URLSearchParams();
        params.set('scheduleId', scheduleId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //获取下周见面课数据
    getNextweekliveInfor(scheduleId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/run/nextweekliveInfor';
        let params = new URLSearchParams();

        params.set('scheduleId', scheduleId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //信息确认进度查询
    inforconfrim(scheduleId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/run/inforconfrim';
        let params = new URLSearchParams();
        params.set('scheduleId', scheduleId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //课表课程基础信息
    schedulecourseinfor(scheduleId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/run/schedulecourseinfor';
        let params = new URLSearchParams();
        params.set('scheduleId', scheduleId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //专员排课情况统计
    paikecountInfo(scheduleId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/run/paikecountInfo';
        let params = new URLSearchParams();
        params.set('scheduleId', scheduleId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //课程查询
    getCourse(sId:any,pN:any,pS:any,sta:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/c/find';
        let params = new URLSearchParams();
        params.set('status', sta);
        params.set('flag', "1");
        params.set('scheduleId', sId);
        params.set('searchValue', '');
        params.set('pageNum', pN);
        params.set('pageSize', pS);
        if(sta=="6"){
           params.set('needrequirechange', 'yes');
        }

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //同步
    sync(scheduleId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/run/sync';
        let params = new URLSearchParams();
        params.set('scheduleId', scheduleId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //获取未分配运行专员的课程信息
    findUnassigned(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/run/findUnassigned';
        let params = new URLSearchParams();
        params.set('scheduleId', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //获取系统有效的运行专员
    findRunCommissionerInfor(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/run/findRunCommissionerInfor';
        let params = new URLSearchParams();
        params.set('scheduleId', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //课程分配专员
    assignCourseToCommissioner(json:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/run/assignCourseToCommissioner';
        let params = new URLSearchParams();
        params.set('assigncoursejson', json);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //获取未分配课程
    getFenpeiCourse(sId:any,sVa:any,pN:any,pS:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/c/find';
        let params = new URLSearchParams();
        params.set('status', '0');
        params.set('flag', "2");
        params.set('scheduleId', sId);
        params.set('searchValue', sVa);
        params.set('pageNum', pN);
        params.set('pageSize', pS);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //增加课表
    createSchedule(name:any,recruitId:any,recruitName:any,startTime:any,endTime:any,deadlineTime:any,remarks:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/s/add';
        let params = new URLSearchParams();
        params.set('name',name);
        params.set('recruitId', recruitId);
        params.set('recruitName',recruitName);
        params.set('startTime',startTime);
        params.set('endTime', endTime);
        params.set('deadlineTime',deadlineTime);
        params.set('remarks',remarks);
        return this.http.get(apiUrl, { search: params })
            .map(res => res);
    }

    //查询学期列表
    getSemesterList(){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/s/searchSemester';
        return this.http.get(apiUrl)
            .map(res => res.json());
    }

    //根据课表id查询课表信息
    getScheduleInfoFindByid(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/s/findById';
        let params = new URLSearchParams();
        params.set('id', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //修改课表信息
    updateSchedule(recruitId:any,id:any,name:any,startTime:any,endTime:any,deadlineTime:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/s/update';
        let params = new URLSearchParams();
        params.set('name',name);
        params.set('id',id);
        params.set('recruitId', recruitId);
        params.set('startTime',startTime);
        params.set('endTime', endTime);
        params.set('deadlineTime',deadlineTime);
        return this.http.get(apiUrl, { search: params })
            .map(res => res);
    }

    //运行主管处理需求变更
    requirementtChangeHandler(id:any,isagree:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/run/requirementtChangeHandler';
        let params = new URLSearchParams();
        params.set('id', id);
        params.set('isagree', isagree);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //按周反馈信息查询
    findLiveFeedbackInfo(id:any,sT:any,eT:any,zhsId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/run/findLiveFeedbackInfo';
        let params = new URLSearchParams();
        params.set('scheduleId', id);
        params.set('starTime', sT);
        params.set('endTime', eT);
        if(zhsId!=""){
            params.set('zhsId', zhsId);
        }

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //获取周信息
    getWeek(id:any,week:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/run/getWeek';
        let params = new URLSearchParams();
        if(week!="-1"){
            params.set('week', week);
        }
        params.set('scheduleId', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 切割课表 以周为单位(获取总周数)
    cutScheduleByWeek(scheduleId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/cutScheduleByWeek';
        let params = new URLSearchParams();
        params.set('scheduleId', scheduleId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }


    //发布课程
    releaseCourse(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/run/releaseCourse';
        let params = new URLSearchParams();
        params.set('courseIds', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //将课程修改为已发布状态
    changeReleaseStatus(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/run/changeReleaseStatus';
        let params = new URLSearchParams();
        params.set('courseIds', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //获取见面课详情弹框接口
    getLiveDetailDto(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/l/getLiveDetailDto';
        let params = new URLSearchParams();
        params.set('liveId', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //获取进入语音频道地址
    getZhumuMeettingUrl(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/cloudRoom/getZhumuMeettingUrl';
        let params = new URLSearchParams();
        params.set('courseId', id);
        params.set('role', '1');

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }


}
