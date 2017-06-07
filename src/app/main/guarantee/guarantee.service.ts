import {Injectable} from '@angular/core';
import {Http, Jsonp, Headers,URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

import { Parameter } from '../../parameter.service';

@Injectable()
export class GuaranteeService {
    constructor(private http:Http,private jsonp:Jsonp,private parameter: Parameter){}
    //课表管理列表页查询接口
    getSchedule(){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/s/getSchedule';
        return this.http.get(apiUrl)
          .map(res => res);
    }

    //根据课表id查询课表信息
    getScheduleInfoFindByid(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/s/findById';
        let params = new URLSearchParams();
        params.set('id', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //微信推送
    sendHandWechatMsg(ids:any){

        let creds = "liveIds=" + ids;
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let apiUrl = this.parameter.apiUrl+'/api-schedule/safe/sendHandWechatMsg';

        return this.http.post(apiUrl, creds,{
            headers: headers
            })
          .map(res => res);
    }

    //课表课程基础信息
    schedulecourseinfor(scheduleId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/run/schedulecourseinfor';
        let params = new URLSearchParams();
        params.set('scheduleId', scheduleId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //查询距离开课课表是第几周了
    getCurrentWeekNum(Id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/safe/getCurrentWeek';
        let params = new URLSearchParams();
        params.set('id', Id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    // 切割课表 以周为单位(获取总周数)
    cutScheduleByWeek(scheduleId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/cutScheduleByWeek';
        let params = new URLSearchParams();
        params.set('scheduleId', scheduleId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //见面课进程数据
    countFeedBackByDateInterval(id:any,sT:any,eT:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/safe/countFeedBackByDateInterval';
        let params = new URLSearchParams();
        params.set('scheduleId', id);
        params.set('starTime', sT);
        params.set('endTime', eT);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }


    //获取值班人信息
    getZhiBanPersonInfor(scheduleId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/safe/getZhiBanPersonInfor';
        let params = new URLSearchParams();
        params.set('scheduleId', scheduleId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //获取某周见面课值班人分配情况信息
    getWeekZhiBanPersonInfo(scheduleId:any,week:any,zhsId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/safe/getWeekZhiBanPersonInfo';
        let params = new URLSearchParams();
        params.set('scheduleId', scheduleId);
        params.set('week', week);
        params.set('zhsIds', zhsId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //查询时间段里面的见面课以及对应的值班人 导播情况
    getSafeLeaderOneDayLive(sT:any,eT:any,Id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/safe/getSafeLeaderOneDayLive';
        let params = new URLSearchParams();
        params.set('startTime', sT);
        params.set('endTime', eT);
        params.set('scheduleId', Id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //获取导播人员信息
    getRoomDaoboDetail(){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/safe/getRoomDaoboDetail';
        let params = new URLSearchParams();

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }


    //保障主管分配值班人员、导播
    assignZhibanrenDaobo(infojson:any){

        let creds = "assignJson=" + infojson;
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let apiUrl = this.parameter.apiUrl+'/api-schedule/safe/assignZhibanrenDaobo';

        return this.http.post(apiUrl, creds,{
            headers: headers
            })
          .map(res => res);
        // let params = new URLSearchParams();
        // params.set('assignJson', infoJson);
        // return this.http.get(apiUrl, { search: params })
        //   .map(res => res);
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

    //校验分配导播是否存在冲突
    daobaoConflictConfirm(sT:any,eT:any,zId:any,id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/livePerson/daobaoConflictConfirm';
        let params = new URLSearchParams();
        params.set('liveStartTime', sT);
        params.set('liveEndTime', eT);
        params.set('daoboZhsId', zId);
        params.set('id', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //按周反馈信息查询(专员反馈)
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

    //按周反馈信息查询（值班人反馈）
    findByTimeAndScheduleId(id:any,sT:any,eT:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/liveAttendanceFeedbackBusiness/findByTimeAndScheduleId';
        let params = new URLSearchParams();
        params.set('scheduleId', id);
        params.set('starTime', sT);
        params.set('endTime', eT);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //按周反馈信息查询（值班人评分）
    findByTimeAndScheduleIdZhibanPingfen(id:any,sT:any,eT:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/liveAttendanceScoreBusiness/findByScheduleIdAndTime';
        let params = new URLSearchParams();
        params.set('scheduleId', id);
        params.set('startTime', sT);
        params.set('endTime', eT);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //按周反馈信息查询（导播反馈）
    findWeekDaoboFeedBack(id:any,sT:any,eT:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/safe/findByScheduleIdAndTime';
        let params = new URLSearchParams();
        params.set('scheduleId', id);
        params.set('startTime', sT);
        params.set('endTime', eT);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }
}
