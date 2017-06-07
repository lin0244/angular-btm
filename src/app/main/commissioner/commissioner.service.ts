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
        let apiUrl = this.parameter.apiUrl+'/api-schedule/s/getSchedule';
        return this.http.get(apiUrl)
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

    // 切割课表 以周为单位
    cutScheduleByWeek(scheduleId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/cutScheduleByWeek';
        let params = new URLSearchParams();
        params.set('scheduleId', scheduleId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //根据周时间段查询周见面课信息
    findRunCommissionerRunPhaseLiveByTimeInterval(id:any,st:any,eT:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/findRunCommissionerRunPhaseLiveByTimeInterval';
        let params = new URLSearchParams();
        params.set('scheduleId', id);
        params.set('startTime', st);
        params.set('endTime', eT);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 根据学校code,获得省信息
    getProvincesBySchoolCode(schoolCode:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/getProvincesBySchoolCode';
        let params = new URLSearchParams();
        params.set('schoolCode', schoolCode);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    // 获取老师头像资源库
    getTeacherPicInfor(seaVal:any,pN:any,pS:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/getTeacherPicInfor';
        let params = new URLSearchParams();
        params.set('searchValue', seaVal);
        params.set('pageNum', pN);
        params.set('pageSize', pS);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 获取课程图片资源库
    getCoursePicInfor(seaVal:any,pN:any,pS:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/getCoursePicInfor';
        let params = new URLSearchParams();
        params.set('searchValue', seaVal);
        params.set('pageNum', pN);
        params.set('pageSize', pS);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 通过省份查询学校
    getSchoolByProvinces(pro:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/getSchoolByProvinces';
        let params = new URLSearchParams();
        params.set('provinces', pro);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 通过学校查询对应的教室
    getClassroomBySchoolCode(schoolCode:any){
        // let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/getClassroomBySchoolCode';
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/getZJClassroomBySchoolCode';
        let params = new URLSearchParams();
        params.set('schoolCode', schoolCode);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }


    getOldClassroomBySchoolCode(schoolCode:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/getClassroomBySchoolCode';
        // let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/getZJClassroomBySchoolCode';
        let params = new URLSearchParams();
        params.set('schoolCode', schoolCode);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }


    // 新版通过学校查询对应的教室(除了WB5，其余都可以做主讲教室)
    getNewClassroomBySchoolCode(schoolCode:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/getZJClassroomBySchoolCode';
        let params = new URLSearchParams();
        params.set('schoolCode', schoolCode);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    // 获取运行专员排课的基础信息
    getCommissionerPaikeBaiscInfor(scheduleId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/getCommissionerPaikeBaiscInfor';
        let params = new URLSearchParams();
        params.set('scheduleId', scheduleId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    // 获取当前专员分配的课程信息
    getAllocationCourse(scheduleId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/getAllocationCourse';
        let params = new URLSearchParams();
        params.set('scheduleId', scheduleId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 通过课程ID 查询课程见面信息
    findByCourseId(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/findById';
        let params = new URLSearchParams();
        params.set('id', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    //修改见面课信息
    updateLiveInfo(infojson:any,type:any){
        let infoJson= infojson;
        let creds;
        if(type=="0"){
            creds = "livesjson=" + infoJson;
        }else{
            creds = "livesjson=" + infoJson + "&type=1";
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/batchUpdate';

        return this.http.post(apiUrl, creds,{
            headers: headers
            })
          .map(res => res);
    }

    // 通过见面课ID查询见面课信息
    findByMeetCourseId(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/l/findById';
        let params = new URLSearchParams();
        params.set('id', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 增加互动教室
    createRoom(LI:any,CC:any,TL:any,IHP:any,SC:any,SN:any,TN:any,TP:any,LST:any,LET:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/lr/create';
        let params = new URLSearchParams();
        params.set('liveId', LI);
        params.set('classroomCode', CC);
        params.set('role', '1');
        params.set('timeLong', TL);
        params.set('isHavePpt', IHP);
        params.set('schoolCode', SC);
        params.set('schoolName', SN);
        params.set('teacherName', TN);
        params.set('teacherPhone', TP);
        params.set('liveStartTime', LST);
        params.set('liveEndTime', LET);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 修改互动教室
    updateRoom(LI:any,CC:any,TL:any,IHP:any,SC:any,SN:any,TN:any,TP:any,LST:any,LET:any,Id:any,OCC:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/lr/updateRoom';
        let params = new URLSearchParams();
        params.set('liveId', LI);
        params.set('classroomCode', CC);
        params.set('role', '1');
        params.set('timeLong', TL);
        params.set('isHavePpt', IHP);
        params.set('schoolCode', SC);
        params.set('schoolName', SN);
        params.set('teacherName', TN);
        params.set('teacherPhone', TP);
        params.set('liveStartTime', LST);
        params.set('liveEndTime', LET);
        params.set('id', Id);
        if(OCC!='-888' && OCC!=null && OCC!=''){
            params.set('oldClassroomCode', OCC);
        }

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    // 通过直播ID 查询互动学校
    getSchoolByLiveCourseId(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/getSchoolByLiveCourseId';
        let params = new URLSearchParams();
        params.set('livecourseId', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    // 删除互动教室
    deleteRoom(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/lr/delete';
        let params = new URLSearchParams();
        params.set('id', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }
    // 删除互动教室后 销毁该教室下的导播
    deleteLP(id:any,cC:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/lr/deleteLP';
        let params = new URLSearchParams();
        params.set('liveId', id);
        params.set('classroomCode', cC);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    // 修改进行中周见面课信息
    weekInfoSure(TN:any,TP:any,TI:any,LI:any,LP:any,CI:any,ID:any){
        let creds = "teacherName=" + TN + "&teacherHeadPic=" + TP + "&teacherIntroduce=" + TI + "&liveIntroduce=" + LI + "&livePic=" + LP + "&infoConfirm=2" + "&courseId=" + CI + "&id=" + ID + "&sourceType=2";
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/updatelive';
        return this.http.post(apiUrl, creds,{
            headers: headers
            })
          .map(res => res);
    }

    // 获取周见面课详情
    getZYLiveDetailDto(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/getZYLiveDetailDto';
        let params = new URLSearchParams();
        params.set('liveId', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

     // 修改进行中周见面课信息
    weekCeluSure(CI:any,ID:any){

        let creds = "strategyConfirm=2" + "&courseId=" + CI + "&id=" + ID + "&sourceType=2";
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/updatelive';
        return this.http.post(apiUrl, creds,{
            headers: headers
            })
          .map(res => res);
    }

    // 进行中见面课修改后发布单个见面课
    releaseLive(id:any,cId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/releaseLive';
        let params = new URLSearchParams();
        params.set('liveId', id);
        params.set('courseId', cId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 同步单个课程的见面课模板
    synchronizeLiveModel(aId:any,cId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/synchronizeLiveModel';
        let params = new URLSearchParams();
        params.set('admissionId', aId);
        params.set('courseId', cId);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 预排课完成
    previewPaikeCompleted(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/previewPaikeCompleted';
        let params = new URLSearchParams();
        params.set('courseId', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    // 变更发布课程
    releaseCourse(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/requirementChangeReleaseLive';
        let params = new URLSearchParams();
        params.set('courseId', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 需求变更流程终结
    requirementChangeFinished(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/requirementChangeFinished';
        let params = new URLSearchParams();
        params.set('requireId', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    // 保存运行专员填写见面课反馈信息
    submitFeedBackInfo(id:any,tP:any,sP:any,iP:any,dP:any,oP:any,fD:any){

        let creds = "liveId=" + id + "&teacherProblem=" + tP + "&speakerClassroomProblem=" + sP + "&interactiveClassroomProblem=" + iP + "&daoboProblem=" + dP + "&otherProblem=" + oP + "&feedbackDetail=" + fD;
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/submitFeedBackInfo';
        return this.http.post(apiUrl, creds,{
            headers: headers
            })
          .map(res => res);
    }

    // 获取进入语音频道地址
    getZhumuMeettingUrl(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/cloudRoom/getZhumuMeettingUrl';
        let params = new URLSearchParams();
        params.set('courseId', id);
        params.set('role', '1');

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 新建互动策略
    liveInteractiveStrategycreate(id:any,tP:any,tT:any,aT:any,iT:any,dP:any,pN:any){

        let creds = "liveId=" + id + "&type=" + tP + "&teachTime=" + tT + "&answerTime=" + aT + "&interactiveTime=" + iT + "&description=" + dP + "&personNum=" + pN;
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/liveInteractiveStrategycreate';
        return this.http.post(apiUrl, creds,{
            headers: headers
            })
          .map(res => res);
    }

    // 修改互动策略
    liveInteractiveStrategyupdate(id:any,tP:any,tT:any,aT:any,iT:any,dP:any,pN:any){

        let creds = "id=" + id + "&type=" + tP + "&teachTime=" + tT + "&answerTime=" + aT + "&interactiveTime=" + iT + "&description=" + dP + "&personNum=" + pN;
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/liveInteractiveStrategyupdate';
        return this.http.post(apiUrl, creds,{
            headers: headers
            })
          .map(res => res);
    }

    // 通过见面课id查询互动策略
    findInteractiveStrategyByLiveId(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/findInteractiveStrategyByLiveId';
        let params = new URLSearchParams();
        params.set('liveId', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 校验添加主讲教室 时间是否存在冲突
    roomConflictConfirm(id:any,sT:any,eT:any,cC:any,sC:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/lr/roomConflictConfirm';
        let params = new URLSearchParams();
        params.set('liveId', id);
        params.set('liveStartTime', sT);
        params.set('liveEndTime', eT);
        params.set('classroomCode', cC);
        params.set('schoolCode', sC);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 判断是否处于运行期
    isRunningTimeForRecruit(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/commissioner/isRunningTimeForRecruit';
        let params = new URLSearchParams();
        params.set('courseId', id);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 排课信息统计查询
    findArrangementDetail(scheduleId:any,date:any,classroomCode:any): Observable<any>{
        let apiUrl = this.parameter.apiUrl+'/api-schedule/l/findArrangementDetail';
        let params = new URLSearchParams();
        params.set('scheduleId', scheduleId);
        params.set('date', date);
        params.set('classroomCode', classroomCode);

        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 获取本学期月份
    getMonthfn(schuduleId:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/l/findSemesterByScheduleId';
        let params = new URLSearchParams();
        params.set('schuduleId', schuduleId);
        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

    // 获取时间区间信息
    getTimeRoomfn(schuduleId:any,starTime:any,endTime:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/l/findLiveDetailBySchuduleIdAndTime';
        let params = new URLSearchParams();
        params.set('schuduleId', schuduleId);
        params.set('starTime', starTime);
        params.set('endTime', endTime);
        return this.http.get(apiUrl, { search: params })
          .map(res => res);
    }

}
