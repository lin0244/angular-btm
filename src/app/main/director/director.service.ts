import {Injectable} from '@angular/core';
import {Http, Jsonp, Headers,URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

import { Parameter } from '../../parameter.service';

@Injectable()
export class DirectorService {
    constructor(private http:Http,private jsonp:Jsonp,private parameter: Parameter){}

    //课表管理列表页查询接口
    getSchedule(){
        let apiUrl = 'http://localhost:4200/assets/mock-json/getSchedule.json';
        return this.http.get(apiUrl)
          .map(res => res);
    }

    //获取专员列表
    getCommissionerList(){
        let apiUrl = "http://localhost:4200/assets/mock-json/getCommissionerList.json";
    
        return this.http.get(apiUrl)
          .map(res => res);
    }

    //获取某周见面课专员分配情况信息
    getWeekZhuanyuanPersonInfo(scheduleId:any,week:any,zhsId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getWeekZhuyuanPersonInfo.json";
       
          return this.http.get(apiUrl)
          .map(res => res);
    }

    //课表课程基础信息
    schedulecourseinfor(scheduleId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/schedulecourseInfo.json";
       
        return this.http.get(apiUrl)
          .map(res => res);
    }

    //专员排课情况统计
    paikecountInfo(scheduleId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/paikecountInfo.json";
       
        return this.http.get(apiUrl)
          .map(res => res);
    }

    //课程查询
    getCourse(sId:any,pN:any,pS:any,sta:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getCourse.json";
       
        return this.http.get(apiUrl)
          .map(res => res);
    }

    //同步
    sync(scheduleId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/sync.json";
       
        return this.http.get(apiUrl)
          .map(res => res);
    }

    //获取未分配运行专员的课程信息
    findUnassigned(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/findUnassigned.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //获取系统有效的运行专员
    findRunCommissionerInfor(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/findRunCommissionerInfor.json";
        
        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    //课程分配专员
    assignCourseToCommissioner(json:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //获取未分配课程
    getFenpeiCourse(sId:any,sVa:any,pN:any,pS:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getFenpeiCourse.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //增加课表
    createSchedule(name:any,recruitId:any,recruitName:any,startTime:any,endTime:any,deadlineTime:any,remarks:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
            .map(res => res);
    }

    //查询学期列表
    getSemesterList(){
        let apiUrl = "http://localhost:4200/assets/mock-json/getSemesterList.json";
        return this.http.get(apiUrl)
            .map(res => res.json());
    }

    //根据课表id查询课表信息
    getScheduleInfoFindByid(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getScheduleInfoFindByid.json";
        let params = new URLSearchParams();
        params.set('id', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //修改课表信息
    updateSchedule(recruitId:any,id:any,name:any,startTime:any,endTime:any,deadlineTime:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
            .map(res => res);
    }

    //运行主管处理需求变更
    requirementtChangeHandler(id:any,isagree:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";
        
        return this.http.get(apiUrl)
          .map(res => res);
    }

    //按周反馈信息查询
    findLiveFeedbackInfo(id:any,sT:any,eT:any,zhsId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/findLiveFeedbackInfo.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //获取周信息
    getWeek(id:any,week:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getWeek.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 切割课表 以周为单位(获取总周数)
    cutScheduleByWeek(scheduleId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/cutScheduleByWeek.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }


    //发布课程
    releaseCourse(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //将课程修改为已发布状态
    changeReleaseStatus(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";
        
        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    //获取见面课详情弹框接口
    getLiveDetailDto(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getLiveDetailDto.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //获取进入语音频道地址
    getZhumuMeettingUrl(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getZhumuMeettingUrl.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }
}
