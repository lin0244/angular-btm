import {Injectable} from '@angular/core';
import {Http, Jsonp, Headers,URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

import { Parameter } from '../../parameter.service';

@Injectable()
export class GuaranteeService {
    constructor(private http:Http,private jsonp:Jsonp,private parameter: Parameter){}
    //课表管理列表页查询接口
    getSchedule(){
        let apiUrl = 'http://localhost:4200/assets/mock-json/getSchedule.json';
        return this.http.get(apiUrl)
          .map(res => res);
    }

    //根据课表id查询课表信息
    getScheduleInfoFindByid(id:any){
        let apiUrl = 'http://localhost:4200/assets/mock-json/getScheduleInfoFindByid.json';

        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    //微信推送
    sendHandWechatMsg(ids:any){

        let apiUrl = 'http://localhost:4200/assets/mock-json/returns.json';

         return this.http.get(apiUrl)
          .map(res => res.json());
    }

    //课表课程基础信息
    schedulecourseinfor(scheduleId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/schedulecourseInfo.json";
       
        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    //查询距离开课课表是第几周了
    getCurrentWeekNum(Id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getCurrentWeekNum.json";

        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    // 切割课表 以周为单位(获取总周数)
    cutScheduleByWeek(scheduleId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/cutScheduleByWeek.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //见面课进程数据
    countFeedBackByDateInterval(id:any,sT:any,eT:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/countFeedBackByDate.json";
        
        return this.http.get(apiUrl)
          .map(res => res);
    }


    //获取值班人信息
    getZhiBanPersonInfor(scheduleId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/zhibanrenInfo.json";

        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    //获取某周见面课值班人分配情况信息
    getWeekZhiBanPersonInfo(scheduleId:any,week:any,zhsId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getWeekZhiBanInfo.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //查询时间段里面的见面课以及对应的值班人 导播情况
    getSafeLeaderOneDayLive(sT:any,eT:any,Id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getSafeLeaderOneDayLive.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //获取导播人员信息
    getRoomDaoboDetail(){
        let apiUrl = "http://localhost:4200/assets/mock-json/getDaoboListInfo.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }


    //保障主管分配值班人员、导播
    assignZhibanrenDaobo(infojson:any){
        let apiUrl = 'http://localhost:4200/assets/mock-json/returns.json';

         return this.http.get(apiUrl)
          .map(res => res);
    }

    //获取见面课详情弹框接口
    getLiveDetailDto(id:any){
        let apiUrl = 'http://localhost:4200/assets/mock-json/getLiveDetailDto.json';

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //获取进入语音频道地址
    getZhumuMeettingUrl(id:any){
        let apiUrl = 'http://localhost:4200/assets/mock-json/getZhumuMeettingUrl.json';

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //校验分配导播是否存在冲突
    daobaoConflictConfirm(sT:any,eT:any,zId:any,id:any){
        let apiUrl = 'http://localhost:4200/assets/mock-json/returns.json';

         return this.http.get(apiUrl)
          .map(res => res);
    }

    //按周反馈信息查询(专员反馈)
    findLiveFeedbackInfo(id:any,sT:any,eT:any,zhsId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/findLiveFeedbackInfo.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //按周反馈信息查询（值班人反馈）
    findByTimeAndScheduleId(id:any,sT:any,eT:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/zhibanrenFeedBack.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //按周反馈信息查询（值班人评分）
    findByTimeAndScheduleIdZhibanPingfen(id:any,sT:any,eT:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/zhibanrenScore.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //按周反馈信息查询（导播反馈）
    findWeekDaoboFeedBack(id:any,sT:any,eT:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/daoboFeedBack.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }
}
