import {Injectable} from '@angular/core';
import {Http, Jsonp, Headers,URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Parameter } from '../../parameter.service';

@Injectable()
export class CommissionerService {

  constructor(private http:Http,private jsonp:Jsonp,private parameter: Parameter){}

    // 课表管理列表页查询接口
    getSchedule(){
        let apiUrl = 'http://localhost:4200/assets/mock-json/getSchedule.json';
        return this.http.get(apiUrl)
          .map(res => res);
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

    // 切割课表 以周为单位
    cutScheduleByWeek(scheduleId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/cutScheduleByWeek.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //根据周时间段查询周见面课信息
    findRunCommissionerRunPhaseLiveByTimeInterval(id:any,st:any,eT:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/findRunCommissionerRunPhaseLiveByTimeInterval.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 根据学校code,获得省信息
    getProvincesBySchoolCode(schoolCode:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getProvincesInfo.json";
    
        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    // 获取老师头像资源库
    getTeacherPicInfor(seaVal:any,pN:any,pS:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getTeacherPicInfor.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 获取课程图片资源库
    getCoursePicInfor(seaVal:any,pN:any,pS:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getCoursePicInfor.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 通过省份查询学校
    getSchoolByProvinces(pro:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getSchoolByProvinces.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 通过学校查询对应的教室
    getClassroomBySchoolCode(schoolCode:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getClassroomBySchoolCode.json";

        return this.http.get(apiUrl)
          .map(res => res.json());
    }


    getOldClassroomBySchoolCode(schoolCode:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getClassroomBySchoolCode.json";

        return this.http.get(apiUrl)
          .map(res => res.json());
    }


    // 新版通过学校查询对应的教室(除了WB5，其余都可以做主讲教室)
    getNewClassroomBySchoolCode(schoolCode:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getClassroomBySchoolCode.json";

        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    // 获取运行专员排课的基础信息
    getCommissionerPaikeBaiscInfor(scheduleId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getCommissionerPaikeBaiscInfor.json";
        
        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    // 获取当前专员分配的课程信息
    getAllocationCourse(scheduleId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getAllocationCourse.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 通过课程ID 查询课程见面信息
    findByCourseId(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/findByCourseId.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    //修改见面课信息
    updateLiveInfo(infojson:any,type:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 通过见面课ID查询见面课信息
    findByMeetCourseId(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/findByMeetCourseId.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 增加互动教室
    createRoom(LI:any,CC:any,TL:any,IHP:any,SC:any,SN:any,TN:any,TP:any,LST:any,LET:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 修改互动教室
    updateRoom(LI:any,CC:any,TL:any,IHP:any,SC:any,SN:any,TN:any,TP:any,LST:any,LET:any,Id:any,OCC:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    // 通过直播ID 查询互动学校
    getSchoolByLiveCourseId(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getSchoolByLiveCourseId.json";

        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    // 删除互动教室
    deleteRoom(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res.json());
    }
    // 删除互动教室后 销毁该教室下的导播
    deleteLP(id:any,cC:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 修改进行中周见面课信息
    weekInfoSure(TN:any,TP:any,TI:any,LI:any,LP:any,CI:any,ID:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 获取周见面课详情
    getZYLiveDetailDto(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getZYLiveDetailDto.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

     // 修改进行中周见面课信息
    weekCeluSure(CI:any,ID:any){
       let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 进行中见面课修改后发布单个见面课
    releaseLive(id:any,cId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 同步单个课程的见面课模板
    synchronizeLiveModel(aId:any,cId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 预排课完成
    previewPaikeCompleted(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    // 变更发布课程
    releaseCourse(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 需求变更流程终结
    requirementChangeFinished(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 保存运行专员填写见面课反馈信息
    submitFeedBackInfo(id:any,tP:any,sP:any,iP:any,dP:any,oP:any,fD:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 获取进入语音频道地址
    getZhumuMeettingUrl(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getZhumuMeettingUrl.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 新建互动策略
    liveInteractiveStrategycreate(id:any,tP:any,tT:any,aT:any,iT:any,dP:any,pN:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 修改互动策略
    liveInteractiveStrategyupdate(id:any,tP:any,tT:any,aT:any,iT:any,dP:any,pN:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 通过见面课id查询互动策略
    findInteractiveStrategyByLiveId(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/findInteractiveStrategyByLiveId.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 校验添加主讲教室 时间是否存在冲突
    roomConflictConfirm(id:any,sT:any,eT:any,cC:any,sC:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 判断是否处于运行期
    isRunningTimeForRecruit(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/isRunningTime.json";
       
        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 排课信息统计查询
    findArrangementDetail(scheduleId:any,date:any,classroomCode:any): Observable<any>{
        let apiUrl = "http://localhost:4200/assets/mock-json/paikeDetail.json";
        
        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 获取本学期月份
    getMonthfn(schuduleId:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getMonth.json";
        
        return this.http.get(apiUrl)
          .map(res => res);
    }

    // 获取时间区间信息
    getTimeRoomfn(schuduleId:any,starTime:any,endTime:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getTimeRoomfn.json";
        
        return this.http.get(apiUrl)
          .map(res => res);
    }

}
