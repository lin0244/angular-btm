import {Injectable} from '@angular/core';
import {Http, Jsonp, Headers,URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

import { Parameter } from '../../parameter.service';

@Injectable()
export class WatchService {
    constructor(private http:Http,private jsonp:Jsonp,private parameter: Parameter){}

    //获得值班人员，当天见面课列表（未开始、直播中）
    getOnDutyPersonCurrentLive(Id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/l/getOnDutyPersonCurrentLive';
        let params = new URLSearchParams();
        params.set('zhsId', Id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //获得值班人员，历史见面课列表(已结束)
    getOnDutyPersonHistoryLive(Id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/l/getOnDutyPersonHistoryLive';
        let params = new URLSearchParams();
        params.set('zhsId', Id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //值班人员 -> 获得反馈
    getLiveFeedBackInfo(Id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/liveAttendanceFeedbackBusiness/findByLiveId';
        let params = new URLSearchParams();
        params.set('liveId', Id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //见面课反馈
    batchSaveOrUpdate(info:any){
        let Info = info;
        let creds = "attendanceFeedbackjson=" + Info;
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let apiUrl = this.parameter.apiUrl+'/api-schedule/liveAttendanceFeedbackBusiness/batchSaveOrUpdate';
        return this.http.post(apiUrl, creds,{
            headers: headers
            })
          .map(res => res);
    }

    //删除反馈
    deleteFeedBackById(Id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/liveAttendanceFeedbackBusiness/deleteById';
        let params = new URLSearchParams();
        params.set('id', Id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //值班人员 -> 获得评分
    getLivePingfenInfo(Id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/liveAttendanceScoreBusiness/findByLiveId';
        let params = new URLSearchParams();
        params.set('liveId', Id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //见面课评分
    batchSaveOrUpdateScore(info:any){
        let Info = info;
        let creds = "scorejson=" + Info;
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let apiUrl = this.parameter.apiUrl+'/api-schedule/liveAttendanceScoreBusiness/batchSaveOrUpdate';
        return this.http.post(apiUrl, creds,{
            headers: headers
            })
          .map(res => res);
    }

    //根据见面课id获取见面课分配教室
    getLiveRoomByLiveId(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/lr/getLiveRoomByLiveId';
        let params = new URLSearchParams();
        params.set('liveId', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //获得两周教室信息和教室导播人员
    getRecentlyTwoWeekLive(Id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/l/getRecentlyTwoWeekLive';
        let params = new URLSearchParams();
        params.set('zhsId', Id);

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

    //通过直播id 获取直播教室信息
    getConfirmLiveRoomDetail(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/livePerson/getConfirmLiveRoomDaoboDetail';
        let params = new URLSearchParams();
        params.set('liveId', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //值班人员 -> 分配导播
    createConfirmLiveRoomDaobo(info:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/livePerson/createConfirmLiveRoomDaobo';
        let params = new URLSearchParams();
        params.set('info', info);
        return this.http.get(apiUrl, { search: params })
          .map(res => res);
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
        params.set('role', '3');

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
}
