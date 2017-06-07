import { Component, OnInit } from '@angular/core';
import { CommissionerService } from './commissioner.service';
import {Router} from "@angular/router";
declare var $: any;
declare var moment: any;
declare var unescape:any;
export class dayLiveObj {
    week:string;
    time:string;
    amtimeperiods:any[]=[];
    pmtimeperiods:any[]=[];
    nighttimeperiods:any[]=[];
    weekName:string;
}
@Component({
  selector: 'app-commissioner',
  templateUrl: './commissioner.component.html',
  styleUrls: ['./commissioner.component.css'],
  providers: [CommissionerService],
})
export class CommissionerComponent implements OnInit {

  constructor(private commisonerService: CommissionerService,public router: Router) { }
    private liveTypeArr=['','直播互动课','小组讨论课','实践课','直播课(无互动)','在线小班教学(虚拟教室)'];
    public com_isHaveKebiao=true;
    public com_currents=true;
    public com_notStarts=true;
    private allScheduleList:any;
    private currentScheduleId:any;
    private notStartScheduleId:any;
    //获取所有课表
    getSchedule(){
        this.commisonerService.getSchedule()
        .subscribe(data => {
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("课表");
            console.log(data);
            let resData=eval('('+data['_body']+')');
            this.allScheduleList=resData.result;
            if(this.allScheduleList.length==0){
                this.com_isHaveKebiao=false;
                return;
            }else{
                this.com_isHaveKebiao=true;
            }
            if(this.allScheduleList.find((schedule:any) => schedule.status =='1')!=undefined){
                this.currentScheduleId=this.allScheduleList.find((schedule:any) => schedule.status =='1').id;
                this.com_currents=true;
                this.initSchedule(this.currentScheduleId,'1');
            }
            if(this.allScheduleList.find((schedule:any) => schedule.status =='2')!=undefined){
                this.notStartScheduleId=this.allScheduleList.find((schedule:any) => schedule.status =='2').id;
                this.com_notStarts=true;
                this.initSchedule(this.notStartScheduleId,'2');
            }
        });
    }

    //初始化课表 （获取课表名 绑定切换默认当前进行中课表）
    initSchedule(id:any,sta:any){
        this.schedulecourseinfor(id,sta);
        if(sta=='1'){
            this.scheduleSwitch(sta);
        }
    }

    //获取课表名
      private cUkebiaoName='';
      private nSkebiaoName='';
      schedulecourseinfor(id:any,sta:any){
          if(sta=='1'){
              this.commisonerService.schedulecourseinfor(id)
              .subscribe(data =>{
                  if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                      this.router.navigateByUrl('login');
                      return;
                  }
                  console.log("进行中 获取课表名");
                  console.log(data);
                  this.cUkebiaoName=data.result.scheduleName;
              });
          }else{
              this.commisonerService.schedulecourseinfor(id)
              .subscribe(data =>{
                  if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                      this.router.navigateByUrl('login');
                      return;
                  }
                  console.log("未开始 获取课表名");
                  console.log(data);
                  this.nSkebiaoName=data.result.scheduleName;
              });
          }
      }

    private showScheduleId:any;
    public com_isCuKebiao=true;
    //课表切换event
    scheduleSwitch(flag:any){
        if(flag=='1'){
            this.com_isCuKebiao=true;
            $('.nSkebiaoBtn').removeClass('kebiaoactive');
            $('.cUkebiaoBtn').addClass('kebiaoactive');
            this.showScheduleId=this.currentScheduleId;
            this.getCurrentWeekNum(this.showScheduleId);
            this.getAllocationCourse(-1);
        }else{
            this.com_isCuKebiao=false;
            $('.nSkebiaoBtn').addClass('kebiaoactive');
            $('.cUkebiaoBtn').removeClass('kebiaoactive');
            this.showScheduleId=this.notStartScheduleId;
            this.getAllocationCourse(-1);
            this.getCommissionerPaikeBaiscInfor();
        }
    }

    private nSRemainPaikeDay=0;
    private nSAssignedCourseQuantity=0;
    private nSTodayAssignedCourseQuantity=0;
    private nSRemainNotPaikeQuantity=0;
    private nSPaikeQuantity=0;
    //获取运行专员排课的基础信息
    getCommissionerPaikeBaiscInfor(){
        this.commisonerService.getCommissionerPaikeBaiscInfor(this.showScheduleId)
        .subscribe(data =>{
            console.log('获取运行专员排课的基础信息');
            console.log(data);
            this.nSRemainPaikeDay=data.result.remainPaikeDay;
            this.nSAssignedCourseQuantity=data.result.assignedCourseQuantity;
            this.nSTodayAssignedCourseQuantity=data.result.todayAssignedCourseQuantity;
            this.nSRemainNotPaikeQuantity=data.result.remainNotPaikeQuantity;
            this.nSPaikeQuantity=this.nSAssignedCourseQuantity-this.nSRemainNotPaikeQuantity;
        });
    }

    private currentWeek:any;
    private currentInfoWeek:any;
    //获取距离开课课表是第几周
    getCurrentWeekNum(id:any){
        this.commisonerService.getCurrentWeekNum(id)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获取当前距离开课课表第几周');
            this.currentWeek=parseInt(data.result);
            this.currentInfoWeek=parseInt(data.result);
            this.cutScheduleByWeek(this.showScheduleId);
        });
    }

    private weekArr:any[]=[];
    private weekArrtoshow:any[]=[];
    private shijianduan:any;
    private allWeekNum:any;
    private sTimeTogetCurrentWeekLive:any;
    private eTimeTogetCurrentWeekLive:any;
    //切割周 获取总周数与对应时间段
    cutScheduleByWeek(id:any){
      this.commisonerService.cutScheduleByWeek(id)
      .subscribe(data =>{
          if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
              this.router.navigateByUrl('login');
              return;
          }
          console.log('切割周 获取总周数与对应时间段');
          console.log(eval('('+data['_body']+')'));
          let resWeek=eval('('+data['_body']+')');
          this.weekArr=resWeek.result;
          this.weekArrtoshow=[];
          for(var i=0;i<this.weekArr.length;i++){
              let timeZ=this.weekArr[i].split("#")[1];
              let timeSE=timeZ.split("/");
              let valST=timeSE[0];
              let valET=timeSE[1];
              let timeStYMD=timeSE[0].split(" ")[0];
              let timeEtYMD=timeSE[1].split(" ")[0];
              let timeSt=timeStYMD.split("-")[1]+'月'+timeStYMD.split("-")[2]+'日';
              let timeEt=timeEtYMD.split("-")[1]+'月'+timeEtYMD.split("-")[2]+'日';
              let timeShow=timeSt+'-'+timeEt;
              let aeekArrobj={
                  valsT: valST,
                  valeT: valET,
                  time: timeShow
              };
              this.weekArrtoshow.push(aeekArrobj);
          }
          this.allWeekNum=this.weekArrtoshow.length;
          console.log(this.weekArrtoshow);
          this.weekInfoToShow();
      });
    }

    //周加减切换
    switchWeek(flag:any){
        if(flag=='1'){
          if(this.currentInfoWeek>=this.allWeekNum){
              $("#alertTip").html('已经是当前阶段最后一周了!');
              $('#alertWrap').modal('show');
              return;
          }else{
            this.currentInfoWeek++;
          }
        }
        if(flag=='0'){
            if(this.currentInfoWeek<=0){
                $("#alertTip").html('已经是当前阶段第一周了!');
                $('#alertWrap').modal('show');
                return;
            }else{
                this.currentInfoWeek--;
            }
        }
        this.weekInfoToShow();
    }

    public com_isHaveoldWeek=true;
    public com_isHavefutureWeek=true;
    private oldWeekShow:any;
    private newWeekShow:any;
    private weekToshow:any;
    private jiezhiTime:any;
    private shengyuTime:any;
    public com_isCuweek=true;
    public com_isOldWeek=false;
    public com_isFutureWeek=false;
    //初始化当前周信息显示、调取获取周数据接口
    weekInfoToShow(){
        this.shijianduan=this.weekArrtoshow[this.currentInfoWeek-1].time;
        this.sTimeTogetCurrentWeekLive=this.weekArrtoshow[this.currentInfoWeek-1].valsT;
        this.eTimeTogetCurrentWeekLive=this.weekArrtoshow[this.currentInfoWeek-1].valeT;
        this.findRunCommissionerRunPhaseLiveByTimeInterval(this.sTimeTogetCurrentWeekLive,this.eTimeTogetCurrentWeekLive,-1);
        if(this.currentWeek==this.currentInfoWeek){
            if(this.currentInfoWeek>1){
                this.oldWeekShow='上周';
                $('.oldWeekShow').removeAttr('disabled');
                this.newWeekShow='下周';
            }else{
                this.oldWeekShow='上周';
                $('.oldWeekShow').attr('disabled','disabled');
                this.newWeekShow='下周';
            }
            this.weekToshow='第'+this.currentInfoWeek+'周（本周）';
        }else if(this.currentWeek+1==this.currentInfoWeek){
            this.oldWeekShow='本周';
            this.newWeekShow='第'+ (this.currentInfoWeek+1) +'周';
            this.weekToshow='第'+(this.currentInfoWeek)+'周（下周）';
        }else if(this.currentWeek-1==this.currentInfoWeek){
            this.oldWeekShow='第'+ (this.currentInfoWeek-1) +'周';
            this.newWeekShow='本周';
            this.weekToshow='第'+this.currentInfoWeek+'周（上周）';
        }else{
            this.oldWeekShow='第'+ (this.currentInfoWeek-1) +'周';
            this.newWeekShow='第'+ (this.currentInfoWeek+1) +'周';
            this.weekToshow='第'+this.currentInfoWeek+'周 ';
        };
        //以下判断是否显示上一周或者下一周按钮
        if(this.currentInfoWeek==1){
            this.com_isHaveoldWeek=false;
        }else{
          this.com_isHaveoldWeek=true;
        }
        if(this.currentInfoWeek==this.allWeekNum){
            this.com_isHavefutureWeek=false;
        }else{
          this.com_isHavefutureWeek=true;
        }
        //以下判断截止日期显示样式
        if(this.currentWeek==this.currentInfoWeek){
          this.com_isCuweek=true;
          this.com_isOldWeek=false;
          this.com_isFutureWeek=false;
          this.jiezhiTime="已截止";
        }else if(this.currentWeek>this.currentInfoWeek){
          this.com_isCuweek=false;
          this.com_isOldWeek=true;
          this.com_isFutureWeek=false;
          this.jiezhiTime="已截止";
        }else{
          this.com_isCuweek=false;
          this.com_isOldWeek=false;
          this.com_isFutureWeek=true;
          this.jiezhiTime=this.getPreDay(this.sTimeTogetCurrentWeekLive,1);
          let deadLineTime=this.getPreDay(this.sTimeTogetCurrentWeekLive,2);
          let remainDaydate1 = new Date();
          let remainDaydate2 = new Date(deadLineTime);
          this.shengyuTime = Math.floor((remainDaydate2.getTime() - remainDaydate1.getTime()) / (24 * 60 * 60 * 1000))+1;
        }
    }

    //获取前一天(为了得到截止日期)
    getPreDay(timeStr:any,sta:any){
        var timeStr=timeStr.split(' ')[0];
        let s=timeStr.split('-')[0]+timeStr.split('-')[1]+timeStr.split('-')[2];
        let y = parseInt(s.substr(0,4), 10);
        let m = parseInt(s.substr(4,2), 10)-1;
        let d = parseInt(s.substr(6,2), 10);
        let dt = new Date(y, m, d-1);
        y = dt.getFullYear();
        m = dt.getMonth()+1;
        d = dt.getDate();
        let reTm = m<10?"0"+m:m;
        let reTd = d<10?"0"+d:d;
        if(sta==1){
          //返回截止日期（不包含年）
          return reTm + "月-" + reTd + "日";
        }
        if(sta==2){
          //返回截止日期包含年
          return y + "-" + reTm + "-" + reTd;
        }
    }

    public weekIsHaveLive=true;
    private weekInfoArr:any[]=[];
    public com_weekLiveInfoToshow:any[]=[];
    private weekLiveAlreadySure=0;
    private weekLiveAlreadyPlay=0;
    private weekLiveAlreadyFeedback=0;
    private weekLiveAllLive=0;
    private monLive:dayLiveObj={
                week:'星期一',
                time:'',
                amtimeperiods:[],
                pmtimeperiods:[],
                nighttimeperiods:[],
                weekName:'1'
              };
    private tueLive:dayLiveObj={
                week:'星期二',
                time:'',
                amtimeperiods:[],
                pmtimeperiods:[],
                nighttimeperiods:[],
                weekName:'2'
              };
    private wedLive:dayLiveObj={
                week:'星期三',
                time:'',
                amtimeperiods:[],
                pmtimeperiods:[],
                nighttimeperiods:[],
                weekName:'3'
              };
    private thuLive:dayLiveObj={
                week:'星期四',
                time:'',
                amtimeperiods:[],
                pmtimeperiods:[],
                nighttimeperiods:[],
                weekName:'4'
              };
    private friLive:dayLiveObj={
                week:'星期五',
                time:'',
                amtimeperiods:[],
                pmtimeperiods:[],
                nighttimeperiods:[],
                weekName:'5'
              };
    private setLive:dayLiveObj={
                week:'星期六',
                time:'',
                amtimeperiods:[],
                pmtimeperiods:[],
                nighttimeperiods:[],
                weekName:'6'
              };
    private sunLive:dayLiveObj={
                week:'星期日',
                time:'',
                amtimeperiods:[],
                pmtimeperiods:[],
                nighttimeperiods:[],
                weekName:'0'
              };
    public com_currentWeek:any;
    //根据周时间段查询周见面课信息
    findRunCommissionerRunPhaseLiveByTimeInterval(st:any,et:any,flag:any){
      this.commisonerService.findRunCommissionerRunPhaseLiveByTimeInterval(this.showScheduleId,st,et)
      .subscribe(data =>{
        if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
              this.router.navigateByUrl('login');
              return;
          }
          console.log('根据周时间段查询周见面课信息');
          console.log(eval('('+data['_body']+')'));
          let resData=eval('('+data['_body']+')');
          this.weekLiveAllLive=0;
          this.weekLiveAlreadySure=0;
          this.weekLiveAlreadyPlay=0;
          this.weekLiveAlreadyFeedback=0;
          let newDate= new Date();
          this.com_currentWeek=newDate.getDay();
          this.monLive={
                      week:'星期一',
                      time:'',
                      amtimeperiods:[],
                      pmtimeperiods:[],
                      nighttimeperiods:[],
                      weekName:'1'
                    };
          this.tueLive={
                      week:'星期二',
                      time:'',
                      amtimeperiods:[],
                      pmtimeperiods:[],
                      nighttimeperiods:[],
                      weekName:'2'
                    };
          this.wedLive={
                      week:'星期三',
                      time:'',
                      amtimeperiods:[],
                      pmtimeperiods:[],
                      nighttimeperiods:[],
                      weekName:'3'
                    };
          this.thuLive={
                      week:'星期四',
                      time:'',
                      amtimeperiods:[],
                      pmtimeperiods:[],
                      nighttimeperiods:[],
                      weekName:'4'
                    };
          this.friLive={
                      week:'星期五',
                      time:'',
                      amtimeperiods:[],
                      pmtimeperiods:[],
                      nighttimeperiods:[],
                      weekName:'5'
                    };
          this.setLive={
                      week:'星期六',
                      time:'',
                      amtimeperiods:[],
                      pmtimeperiods:[],
                      nighttimeperiods:[],
                      weekName:'6'
                    };
          this.sunLive={
                      week:'星期日',
                      time:'',
                      amtimeperiods:[],
                      pmtimeperiods:[],
                      nighttimeperiods:[],
                      weekName:'0'
                    };
          this.com_weekLiveInfoToshow=[];
          this.weekInfoArr=resData.result;
          if(this.weekInfoArr.length>0){
            this.weekIsHaveLive=true;
            this.weekLiveAllLive=this.weekInfoArr.length;
            for(var i=0;i<this.weekInfoArr.length;i++){
                if(this.weekInfoArr[i].liveStatus==3){
                    this.weekLiveAlreadyPlay++;
                };
                if(this.weekInfoArr[i].infoConfirm==2 && this.weekInfoArr[i].strategyConfirm==2){
                    this.weekLiveAlreadySure++;
                };
                if(this.weekInfoArr[i].feedback){
                    this.weekLiveAlreadyFeedback++;
                };
                if(this.weekInfoArr[i].dayOfWeek=='1'){
                    if(this.weekInfoArr[i].hourse<=11){
                    this.sunLive.amtimeperiods.push(this.weekInfoArr[i]);
                    }else if(this.weekInfoArr[i].hourse>11 && this.weekInfoArr[i].hourse<=17){
                    this.sunLive.pmtimeperiods.push(this.weekInfoArr[i]);
                    }else{
                    this.sunLive.nighttimeperiods.push(this.weekInfoArr[i]);
                    }
                }
                if(this.weekInfoArr[i].dayOfWeek=='2'){
                    if(this.weekInfoArr[i].hourse<=11){
                    this.monLive.amtimeperiods.push(this.weekInfoArr[i]);
                    }else if(this.weekInfoArr[i].hourse>11 && this.weekInfoArr[i].hourse<=17){
                    this.monLive.pmtimeperiods.push(this.weekInfoArr[i]);
                    }else{
                    this.monLive.nighttimeperiods.push(this.weekInfoArr[i]);
                    }
                }
                if(this.weekInfoArr[i].dayOfWeek=='3'){
                    if(this.weekInfoArr[i].hourse<=11){
                    this.tueLive.amtimeperiods.push(this.weekInfoArr[i]);
                    }else if(this.weekInfoArr[i].hourse>11 && this.weekInfoArr[i].hourse<=17){
                    this.tueLive.pmtimeperiods.push(this.weekInfoArr[i]);
                    }else{
                    this.tueLive.nighttimeperiods.push(this.weekInfoArr[i]);
                    }
                }
                if(this.weekInfoArr[i].dayOfWeek=='4'){
                    if(this.weekInfoArr[i].hourse<=11){
                    this.wedLive.amtimeperiods.push(this.weekInfoArr[i]);
                    }else if(this.weekInfoArr[i].hourse>11 && this.weekInfoArr[i].hourse<=17){
                    this.wedLive.pmtimeperiods.push(this.weekInfoArr[i]);
                    }else{
                    this.wedLive.nighttimeperiods.push(this.weekInfoArr[i]);
                    }
                }
                if(this.weekInfoArr[i].dayOfWeek=='5'){
                    if(this.weekInfoArr[i].hourse<=11){
                    this.thuLive.amtimeperiods.push(this.weekInfoArr[i]);
                    }else if(this.weekInfoArr[i].hourse>11 && this.weekInfoArr[i].hourse<=17){
                    this.thuLive.pmtimeperiods.push(this.weekInfoArr[i]);
                    }else{
                    this.thuLive.nighttimeperiods.push(this.weekInfoArr[i]);
                    }
                }
                if(this.weekInfoArr[i].dayOfWeek=='6'){
                    if(this.weekInfoArr[i].hourse<=11){
                    this.friLive.amtimeperiods.push(this.weekInfoArr[i]);
                    }else if(this.weekInfoArr[i].hourse>11 && this.weekInfoArr[i].hourse<=17){
                    this.friLive.pmtimeperiods.push(this.weekInfoArr[i]);
                    }else{
                    this.friLive.nighttimeperiods.push(this.weekInfoArr[i]);
                    }
                }
                if(this.weekInfoArr[i].dayOfWeek=='7'){
                    if(this.weekInfoArr[i].hourse<=11){
                    this.setLive.amtimeperiods.push(this.weekInfoArr[i]);
                    }else if(this.weekInfoArr[i].hourse>11 && this.weekInfoArr[i].hourse<=17){
                    this.setLive.pmtimeperiods.push(this.weekInfoArr[i]);
                    }else{
                    this.setLive.nighttimeperiods.push(this.weekInfoArr[i]);
                    }
                }
            }
            if(this.monLive.amtimeperiods.length!=0 || this.monLive.pmtimeperiods.length!=0 || this.monLive.nighttimeperiods.length!=0){
                this.com_weekLiveInfoToshow.push(this.monLive);
            }
            if(this.tueLive.amtimeperiods.length!=0 || this.tueLive.pmtimeperiods.length!=0 || this.tueLive.nighttimeperiods.length!=0){
                this.com_weekLiveInfoToshow.push(this.tueLive);
            }
            if(this.wedLive.amtimeperiods.length!=0 || this.wedLive.pmtimeperiods.length!=0 || this.wedLive.nighttimeperiods.length!=0){
                this.com_weekLiveInfoToshow.push(this.wedLive);
            }
            if(this.thuLive.amtimeperiods.length!=0 || this.thuLive.pmtimeperiods.length!=0 || this.thuLive.nighttimeperiods.length!=0){
                this.com_weekLiveInfoToshow.push(this.thuLive);
            }
            if(this.friLive.amtimeperiods.length!=0 || this.friLive.pmtimeperiods.length!=0 || this.friLive.nighttimeperiods.length!=0){
                this.com_weekLiveInfoToshow.push(this.friLive);
            }
            if(this.setLive.amtimeperiods.length!=0 || this.setLive.pmtimeperiods.length!=0 || this.setLive.nighttimeperiods.length!=0){
                this.com_weekLiveInfoToshow.push(this.setLive);
            }
            if(this.sunLive.amtimeperiods.length!=0 || this.sunLive.pmtimeperiods.length!=0 || this.sunLive.nighttimeperiods.length!=0){
                this.com_weekLiveInfoToshow.push(this.sunLive);
            }
             setTimeout(()=>{
                $.AdminLTE.tree(".treeMenuCon");
                if(flag==-1){
                    let LID:any;
                    let CID:any;
                    let LCID:any;
                    if(this.com_isCuweek){
                        if(this.com_weekLiveInfoToshow.find((day:any) =>day.weekName==this.com_currentWeek)!=undefined){
                            if(this.com_weekLiveInfoToshow.find((day:any) =>day.weekName==this.com_currentWeek).amtimeperiods.length!=0){
                                LID=this.com_weekLiveInfoToshow.find((day:any) =>day.weekName==this.com_currentWeek).amtimeperiods[0].id;
                                CID=this.com_weekLiveInfoToshow.find((day:any) =>day.weekName==this.com_currentWeek).amtimeperiods[0].courseId;
                                LCID=this.com_weekLiveInfoToshow.find((day:any) =>day.weekName==this.com_currentWeek).amtimeperiods[0].livecourseId;
                            }else if(this.com_weekLiveInfoToshow.find((day:any) =>day.weekName==this.com_currentWeek).pmtimeperiods.length!=0){
                                LID=this.com_weekLiveInfoToshow.find((day:any) =>day.weekName==this.com_currentWeek).pmtimeperiods[0].id;
                                CID=this.com_weekLiveInfoToshow.find((day:any) =>day.weekName==this.com_currentWeek).pmtimeperiods[0].courseId;
                                LCID=this.com_weekLiveInfoToshow.find((day:any) =>day.weekName==this.com_currentWeek).pmtimeperiods[0].livecourseId;
                            }else{
                                LID=this.com_weekLiveInfoToshow.find((day:any) =>day.weekName==this.com_currentWeek).nighttimeperiods[0].id;
                                CID=this.com_weekLiveInfoToshow.find((day:any) =>day.weekName==this.com_currentWeek).nighttimeperiods[0].courseId;
                                LCID=this.com_weekLiveInfoToshow.find((day:any) =>day.weekName==this.com_currentWeek).nighttimeperiods[0].livecourseId;
                            }
                        }else{
                            $($('.weekLiveTree')[0]).addClass('active');
                            LID=this.weekInfoArr[0].id;
                            CID=this.weekInfoArr[0].courseId;
                            LCID=this.weekInfoArr[0].livecourseId;
                        }
                    }else{
                        $($('.weekLiveTree')[0]).addClass('active');
                        LID=this.weekInfoArr[0].id;
                        CID=this.weekInfoArr[0].courseId;
                        LCID=this.weekInfoArr[0].livecourseId;
                    }
                    this.switchWeekLive(LID,CID,LCID);
                }else{
                    this.switchWeekLive(this.weekChoseLiveId,this.weekChoseCourseId,this.weekChoseLiveCourseId);
                }
                $(".nano").nanoScroller();
                $(".nano").nanoScroller({ preventPageScrolling: true });
            },200);
          }else{
              this.weekIsHaveLive=false;
          }
      });
    }
    public com_infoStep:any;
    //切换周见面课信息step
    switchStep(sta:any){
      if(sta==1){
        $('.stepDiv').removeClass('stepActive');
        this.com_infoStep='infoStep1';
        $($('.stepDiv')[sta-1]).addClass('stepActive');
      }
      if(sta==2){
        $('.stepDiv').removeClass('stepActive');
        this.com_infoStep='infoStep2';
        $($('.stepDiv')[sta-1]).addClass('stepActive');
        if(this.weekChoseLiveInfo.infoConfirm==2){
            this.editoring=false;
        }else{
            this.editoring=true;
        }
      }
      if(sta==3){
          if(this.weekChoseLiveInfo.infoConfirm==2){
            $('.stepDiv').removeClass('stepActive');
            this.com_infoStep='infoStep3';
            $($('.stepDiv')[sta-1]).addClass('stepActive');
            setTimeout(() =>{
                $(".nano").nanoScroller();
                $(".nano").nanoScroller({ preventPageScrolling: true });
                $('#liveZuzhiTypeSel').val(this.celueType).change();
                if(this.celueType==1){
                    $('.zuzhiType2').hide();
                    $('.zuzhiType3').hide();
                    $('.zuzhiType1').show();
                    this.celueType='1';
                }else if(this.celueType==2){
                    $('.zuzhiType3').hide();
                    $('.zuzhiType1').hide();
                    $('.zuzhiType2').show();
                    this.celueType='2';
                }else{
                    $('.zuzhiType1').hide();
                    $('.zuzhiType2').hide();
                    $('.zuzhiType3').show();
                    this.celueType='3';
                }
            },300);
          }else{
            return;
          }
      }
      if(sta==4){
          if(this.weekChoseLiveInfo.strategyConfirm==2){
            $('.stepDiv').removeClass('stepActive');
            this.com_infoStep='infoStep4';
            $($('.stepDiv')[sta-1]).addClass('stepActive');
            setTimeout(() =>{
                $(".nano").nanoScroller();
                $(".nano").nanoScroller({ preventPageScrolling: true });
            },300);
          }else{
            return;
          }
      }
      if(sta==5){
        if(this.weekChoseLiveInfo.liveStatus==3){
          $('.stepDiv').removeClass('stepActive');
          this.com_infoStep='infoStep5';
          $($('.stepDiv')[sta-1]).addClass('stepActive');
          this.getWeekLiveFankui();
          setTimeout(() =>{
            $(".nano").nanoScroller();
            $(".nano").nanoScroller({ preventPageScrolling: true });
        },300);
        }else{
          return;
        }
      }
    }

    public weekChoseLiveId:any;
    public weekChoseCourseId:any;
    public weekChoseLiveCourseId:any;
    private weekChoseLiveInfo:any;
    private weekChoseLivedayOfWeek:any;
    private weekChoseLiveHours:any;
    private weekChoseLiveInfoChushi:any;
    private weekLiveInfoArrForFind=['','星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    public com_isHavePptArr=['不展示PPT','不展示PPT','展示PPT'];
    public com_weekLiveTeacherIntr:any;
    public com_weekLiveTeacherPic:any;
    public com_weekLiveTeacherName:any;
    public com_weekLiveType:any;
    public com_weekLiveIntr:any;
    public com_weekLivePic:any;
    public com_meetLiveLong:any;
    public com_weekLiveRoomList:any;
    //切换周见面课
    switchWeekLive(id:any,cId:any,lcid:any){
      this.weekChoseLiveId=id;
      this.weekChoseCourseId=cId;
      this.weekChoseLiveCourseId=lcid;
      this.weekChoseLiveInfoChushi=this.weekInfoArr.find((live:any) => live.id ==id);
      this.weekChoseLivedayOfWeek=this.weekChoseLiveInfoChushi.dayOfWeek;
      this.weekChoseLiveHours=this.weekChoseLiveInfoChushi.hourse;
      let week=this.weekLiveInfoArrForFind[this.weekChoseLivedayOfWeek];
      let weekOfDay=this.com_weekLiveInfoToshow.find((day:any) => day.week ==week);
      if(this.weekChoseLiveHours<=11){
        this.weekChoseLiveInfo=weekOfDay.amtimeperiods.find((live:any) => live.id ==id);
      }else if(this.weekChoseLiveHours>11 && this.weekChoseLiveHours<=17){
        this.weekChoseLiveInfo=weekOfDay.pmtimeperiods.find((live:any) => live.id ==id);
      }else{
        this.weekChoseLiveInfo=weekOfDay.nighttimeperiods.find((live:any) => live.id ==id);
      }
      console.log('点击的见面课信息');
      console.log(this.weekChoseLiveInfo);
      if(this.weekChoseLiveInfo.classroomCode=='-888'){
          this.weekChoseLiveInfo.classroomName='教室待定';
      }
      if(this.weekChoseLiveInfo.teacherIntroduce!=null || this.weekChoseLiveInfo.teacherIntroduce!=undefined){
         this.com_weekLiveTeacherIntr=this.weekChoseLiveInfo.teacherIntroduce.replace(/<.*?>/ig,"").replace(/&nbsp;/ig,'');
      }else{
          this.com_weekLiveTeacherIntr="";
      }
      this.com_weekLiveTeacherPic=this.weekChoseLiveInfo.teacherHeadPic;
      this.com_weekLiveTeacherName=this.weekChoseLiveInfo.teacherName;
      this.com_weekLiveType=this.liveTypeArr[this.weekChoseLiveInfo.liveType];
      if(this.weekChoseLiveInfo.liveIntroduce!=null || this.weekChoseLiveInfo.liveIntroduce!=undefined){
          this.com_weekLiveIntr=this.weekChoseLiveInfo.liveIntroduce.replace(/<.*?>/ig,"").replace(/&nbsp;/ig,'');
      }else{
          this.com_weekLiveIntr="";
      }
      this.com_weekLivePic=this.weekChoseLiveInfo.livePic;
      this.com_meetLiveLong=Math.floor((this.weekChoseLiveInfo.endTime-this.weekChoseLiveInfo.startTime)/60000);
      this.searchRoomfindByMeetCourseId(this.weekChoseLiveId);
      clearInterval(this.timeJIshi);
      this.daojishi(this.weekChoseLiveInfo.startTime);
      this.findInteractiveStrategyByLiveId();           //查询策略
      this.getWeekLiveFankui();                         //查询反馈
      this.getSchoolByLiveCourseId(lcid);  //查询互动学校
      this.getZYLiveDetailDto();                         //获取周见面课详情
      this.getProvincesBySchoolCode(this.weekChoseLiveInfo.schoolCode);
      this.initWeekInfoStep();
    }

    //初始化周见面课信息step
    initWeekInfoStep(){
        $('.stepDiv').removeClass('stepActive');
        $('.liveStepPoint').removeClass('liveStepPointGreen');
        $($('.liveStepPoint')[0]).addClass('liveStepPointGreen');
        if(this.weekChoseLiveInfo.infoConfirm==2){
            this.editoring=false;
            $($('.liveStepPoint')[1]).addClass('liveStepPointGreen');
            if(this.weekChoseLiveInfo.strategyConfirm==2){
                $($('.liveStepPoint')[2]).addClass('liveStepPointGreen');
                if(this.weekChoseLiveInfo.liveStatus==3){
                    $($('.liveStepPoint')[3]).addClass('liveStepPointGreen');
                    if(this.weekChoseLiveInfo.feedback){
                        $($('.liveStepPoint')[4]).addClass('liveStepPointGreen');
                    }
                    $($('.stepDiv')[4]).addClass('stepActive');
                    this.com_infoStep='infoStep5';
                    setTimeout(() =>{
                        $(".nano").nanoScroller();
                        $(".nano").nanoScroller({ preventPageScrolling: true });
                    },300);
                }else{
                    $($('.stepDiv')[3]).addClass('stepActive');
                    this.com_infoStep='infoStep4';
                    setTimeout(() =>{
                        $(".nano").nanoScroller();
                        $(".nano").nanoScroller({ preventPageScrolling: true });
                    },300);
                }
            }else{
                $($('.stepDiv')[2]).addClass('stepActive');
                this.com_infoStep='infoStep3';
            }
        }else{
            $($('.stepDiv')[1]).addClass('stepActive');
            this.com_infoStep='infoStep2';
        }
    }

    private weekChoseLivePrivence:any;
    //通过学校code获取省信息
    getProvincesBySchoolCode(code:any){
        this.commisonerService.getProvincesBySchoolCode(code)
        .subscribe( data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("进行中 通过学校code查省");
                console.log(data);
            this.weekChoseLivePrivence=data.result.name;
        });
    }

    private teacherPicPn:any;
    private teacherPicPs:any;
    public com_weekTeacherPicSeaVal:any;
    public com_weekTeacherPicList:any[]=[];
    //获取老师头像
    getTeachPic(sta:any){
        this.teacherPicPn='1';
        this.teacherPicPs='10';
        if(sta=='3'){
            this.commisonerService.getTeacherPicInfor(this.com_weekTeacherPicSeaVal,this.teacherPicPn,this.teacherPicPs)
            .subscribe(data =>{
                if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                    this.router.navigateByUrl('login');
                    return;
                }
                console.log("周见面课 获取老师头像");
                let resData=eval('('+data['_body']+')');
                console.log(resData);
                this.com_weekTeacherPicList=resData.result.pageItems;
            });
        }
    }

    private coursePicPn:any;
    private coursePicPs:any;
    public com_weekLivePicSeaVal:any;
    public com_weekLivePicList:any[]=[];
    //获取见面课图片
    getCoursePic(sta:any){
        this.coursePicPn='1';
        this.coursePicPs='10';
        if(sta=='3'){
            this.commisonerService.getCoursePicInfor(this.com_weekLivePicSeaVal,this.coursePicPn,this.coursePicPs)
            .subscribe(data =>{
                if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                    this.router.navigateByUrl('login');
                    return;
                }
                console.log("周见面课 获取课程图片");
                let resData=eval('('+data['_body']+')');
                console.log(resData);
                this.com_weekLivePicList=resData.result.pageItems;
            });
        }
    }

    //点击修改老师图片
    selectTeacherPic(url:any,sta:any){
        if(sta=='3'){
            console.log("下周见面课 点击选择的老师头像url："+url);
            this.com_weekLiveTeacherPic=url;
            $('.clickinfoTeacherpicGuanbi').click();
        }
    }

    //点击修改课程图片
    selectCoursePic(url:any,sta:any){
        if(sta=="3"){
            console.log("下周见面课 点击选择的课程图片url："+url);
            this.com_weekLivePic=url;
            $('.clickinfoCoursePicGuanbi').click();
        }
    }

    public editoring=false;
    weekInfoEditor(){
        this.editoring=true;
    }

    //修改周见面课信息
    weekInfoSure(){
        let TN=this.com_weekLiveTeacherName;
        let TP=this.com_weekLiveTeacherPic;
        let TI=this.com_weekLiveTeacherIntr;
        let LI=this.com_weekLiveIntr;
        let LP=this.com_weekLivePic;
        let CI=this.weekChoseCourseId;
        let ID=this.weekChoseLiveId;
        if(TN=="" || TN==null || TN==undefined){
            $("#alertTip").html("请填老师姓名!");
            $('#alertWrap').modal('show');
            return;
        }
        this.commisonerService.weekInfoSure(TN,TP,TI,LI,LP,CI,ID)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            if(resData.successful){
                $("#alertSuccessTip").html('保存成功!');
                $('#alertSuccessWrap').modal('show');
                this.editoring=false;
                setTimeout(()=> {
                    $('#alertSuccessWrap').modal('hide');
                }, 1000);
                if(this.weekChoseLiveInfo.infoConfirm==2){

                }else{
                    this.weekChoseLiveInfo.infoConfirm=2;
                    this.initWeekInfoStep();
                }
               this.commisonerService.releaseLive(this.weekChoseLiveId,this.weekChoseCourseId)
               .subscribe(data =>{
                   console.log("修改下周见面课信息后发布");
                   console.log(data);
               });
            }
        });
    }

    private celueType:any;
    switchLiveType(){
        if($('#liveZuzhiTypeSel').val()=='1'){
            $('.zuzhiType2').hide();
            $('.zuzhiType3').hide();
            $('.zuzhiType1').show();
            this.celueType='1';
        }else if($('#liveZuzhiTypeSel').val()=='2'){
            $('.zuzhiType3').hide();
            $('.zuzhiType1').hide();
            $('.zuzhiType2').show();
            this.celueType='2';
        }else{
            $('.zuzhiType1').hide();
            $('.zuzhiType2').hide();
            $('.zuzhiType3').show();
            this.celueType='3';
        }
    }

    private isHavecelue=true;
    private celueTeachTime:any;
    private celueAnswerTime:any;
    private celueInteractiveTime:any;
    private celuePersonNum:any;
    public com_hudongCeDiscri:any;
    public com_teachTime1:any;
    public com_answerTime1:any;
    public com_interactiveTime1:any;
    public com_personNum1:any;
    public com_teachTime2:any;
    public com_answerTime2:any;
    public com_interactiveTime2:any;
    public com_personNum2:any;
    public com_teachTime3:any;
    public com_answerTime3:any;
    public com_interactiveTime3:any;
    public com_personNum3:any;
    //添加互动策略
    liveInteractiveStrategycreate(){
        if(this.celueType==1){
            if(this.com_teachTime1=='' && this.com_teachTime1!=0 || this.com_teachTime1==null ){
                $("#alertTip").html("请填写教师主讲时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(this.com_answerTime1=='' && this.com_answerTime1!=0  || this.com_answerTime1==null){
                $("#alertTip").html("请填写互动答疑时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(this.com_interactiveTime1=='' && this.com_interactiveTime1!=0 || this.com_interactiveTime1==null){
                $("#alertTip").html("请填写教室互动时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(isNaN(parseInt(this.com_answerTime1)) || isNaN(parseInt(this.com_teachTime1))){
                $("#alertTip").html("请填写正确的时间格式!");
                $('#alertWrap').modal('show');
                return;
            }else{
                this.celueTeachTime=parseInt(this.com_teachTime1);
                this.celueAnswerTime=parseInt(this.com_answerTime1);
                this.celueInteractiveTime=parseInt(this.com_interactiveTime1);;
                this.celuePersonNum=0;
                if(this.celueTeachTime+this.celueAnswerTime+this.celueInteractiveTime!=this.com_meetLiveLong){
                    $("#alertTip").html("安排的时间之和不等于见面课时长!");
                    $('#alertWrap').modal('show');
                    return;
                }
            }
        }else if(this.celueType==2){
            if(this.com_teachTime2=='' && this.com_teachTime2!=0 || this.com_teachTime2==null ){
                $("#alertTip").html("请填写教师主讲时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(this.com_personNum2=='' && this.com_personNum2!=0 || this.com_personNum2==null){
                $("#alertTip").html("请填写嘉宾人数!");
                $('#alertWrap').modal('show');
                return;
            }else if(this.com_answerTime2=='' && this.com_answerTime2!=0 || this.com_answerTime2==null){
                $("#alertTip").html("请填写互动答疑时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(this.com_interactiveTime2=='' && this.com_interactiveTime2!=0 || this.com_interactiveTime2==null){
                $("#alertTip").html("请填写教室互动时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(isNaN(parseInt(this.com_teachTime2)) || isNaN(parseInt(this.com_answerTime2)) || isNaN(parseInt(this.com_interactiveTime2))){
                $("#alertTip").html("请填写正确的时间格式!");
                $('#alertWrap').modal('show');
                return;
            }else if(isNaN(parseInt(this.com_personNum2))){
                $("#alertTip").html("请填写正确的人数格式!");
                $('#alertWrap').modal('show');
                return;
            }else{
                this.celueTeachTime=parseInt(this.com_teachTime2);
                this.celueAnswerTime=parseInt(this.com_answerTime2);
                this.celueInteractiveTime=parseInt(this.com_interactiveTime2);
                this.celuePersonNum=parseInt(this.com_personNum2);
                if(this.celueTeachTime+this.celueAnswerTime+this.celueInteractiveTime!=this.com_meetLiveLong){
                    $("#alertTip").html("安排的时间之和不等于见面课时长!");
                    $('#alertWrap').modal('show');
                    return;
                }
            }
        }else{
            if(this.com_teachTime3=='' && this.com_teachTime3!=0 || this.com_teachTime3==null ){
                $("#alertTip").html("请填写教师主讲时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(this.com_personNum3=='' && this.com_personNum3!=0 || this.com_personNum3==null){
                $("#alertTip").html("请填写汇报学生数!");
                $('#alertWrap').modal('show');
                return;
            }else if(this.com_answerTime3=='' && this.com_answerTime3!=0 || this.com_answerTime3==null){
                $("#alertTip").html("请填写教师点评时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(this.com_interactiveTime3=='' && this.com_interactiveTime3!=0 || this.com_interactiveTime3==null){
                $("#alertTip").html("请填写学生汇报时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(isNaN(parseInt(this.com_teachTime3)) || isNaN(parseInt(this.com_answerTime3)) || isNaN(parseInt(this.com_interactiveTime3))){
                $("#alertTip").html("请填写正确的时间格式!");
                $('#alertWrap').modal('show');
                return;
            }else if(isNaN(parseInt(this.com_personNum3))){
                $("#alertTip").html("请填写正确的人数格式!");
                $('#alertWrap').modal('show');
                return;
            }else{
                this.celueTeachTime=parseInt(this.com_teachTime3);
                this.celueAnswerTime=parseInt(this.com_answerTime3);
                this.celueInteractiveTime=parseInt(this.com_interactiveTime3);
                this.celuePersonNum=parseInt(this.com_personNum3);
                if(this.celueTeachTime+this.celueAnswerTime+this.celueInteractiveTime!=this.com_meetLiveLong){
                    $("#alertTip").html("安排的时间之和不等于见面课时长!");
                    $('#alertWrap').modal('show');
                    return;
                }
            }
        }
        this.commisonerService.liveInteractiveStrategycreate(this.weekChoseLiveId,this.celueType,this.celueTeachTime,this.celueAnswerTime,this.celueInteractiveTime,this.com_hudongCeDiscri,this.celuePersonNum)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('添加互动策略');
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            if(resData.successful){
                this.isHavecelue=true;
                this.findInteractiveStrategyByLiveId();
                this.weekCeluSure(this.weekChoseCourseId,this.weekChoseLiveId);
                if(this.weekChoseLiveInfo.strategyConfirm==2){

                }else{
                    this.weekChoseLiveInfo.strategyConfirm=2;
                    this.initWeekInfoStep();
                }
                $("#alertSuccessTip").html('确认成功!');
                $('#alertSuccessWrap').modal('show');
                setTimeout(()=> {
                    $('#alertSuccessWrap').modal('hide');
                    $('.addHudongCelueClose').click();
                }, 1000);
            }else{
                this.isHavecelue=false;
                $("#alertTip").html("确认失败！");
                $('#alertWrap').modal('show');
            }
        });
    }

    //确认周见面课策略
    weekCeluSure(cId:any,Id:any){
        this.commisonerService.weekCeluSure(cId,Id)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            this.weekLiveAlreadySure++;
            console.log('周见面课策略确认');
            console.log(data);
        });
    }

    private hudongId:any;
    //修改互动策略
    liveInteractiveStrategyupdate(){
        if(this.celueType==1){
            if(this.com_teachTime1=='' && this.com_teachTime1!=0 || this.com_teachTime1==null ){
                $("#alertTip").html("请填写教师主讲时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(this.com_answerTime1=='' && this.com_answerTime1!=0  || this.com_answerTime1==null){
                $("#alertTip").html("请填写互动答疑时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(this.com_interactiveTime1=='' && this.com_interactiveTime1!=0 || this.com_interactiveTime1==null){
                $("#alertTip").html("请填写教室互动时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(isNaN(parseInt(this.com_answerTime1)) || isNaN(parseInt(this.com_teachTime1))){
                $("#alertTip").html("请填写正确的时间格式!");
                $('#alertWrap').modal('show');
                return;
            }else{
                this.celueTeachTime=parseInt(this.com_teachTime1);
                this.celueAnswerTime=parseInt(this.com_answerTime1);
                this.celueInteractiveTime=parseInt(this.com_interactiveTime1);
                this.celuePersonNum=0;
                if(this.celueTeachTime+this.celueAnswerTime+this.celueInteractiveTime!=this.com_meetLiveLong){
                    $("#alertTip").html("安排的时间之和不等于见面课时长!");
                    $('#alertWrap').modal('show');
                    return;
                }
            }
        }else if(this.celueType==2){
            if(this.com_teachTime2=='' && this.com_teachTime2!=0 || this.com_teachTime2==null ){
                $("#alertTip").html("请填写教师主讲时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(this.com_personNum2=='' && this.com_personNum2!=0 || this.com_personNum2==null){
                $("#alertTip").html("请填写嘉宾人数!");
                $('#alertWrap').modal('show');
                return;
            }else if(this.com_answerTime2=='' && this.com_answerTime2!=0 || this.com_answerTime2==null){
                $("#alertTip").html("请填写互动答疑时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(this.com_interactiveTime2=='' && this.com_interactiveTime2!=0 || this.com_interactiveTime2==null){
                $("#alertTip").html("请填写教室互动时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(isNaN(parseInt(this.com_teachTime2)) || isNaN(parseInt(this.com_answerTime2)) || isNaN(parseInt(this.com_interactiveTime2))){
                $("#alertTip").html("请填写正确的时间格式!");
                $('#alertWrap').modal('show');
                return;
            }else if(isNaN(parseInt(this.com_personNum2))){
                $("#alertTip").html("请填写正确的人数格式!");
                $('#alertWrap').modal('show');
                return;
            }else{
                this.celueTeachTime=parseInt(this.com_teachTime2);
                this.celueAnswerTime=parseInt(this.com_answerTime2);
                this.celueInteractiveTime=parseInt(this.com_interactiveTime2);
                this.celuePersonNum=parseInt(this.com_personNum2);
                if(this.celueTeachTime+this.celueAnswerTime+this.celueInteractiveTime!=this.com_meetLiveLong){
                    $("#alertTip").html("安排的时间之和不等于见面课时长!");
                    $('#alertWrap').modal('show');
                    return;
                }
            }
        }else{
            if(this.com_teachTime3=='' && this.com_teachTime3!=0 || this.com_teachTime3==null ){
                $("#alertTip").html("请填写教师主讲时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(this.com_personNum3=='' && this.com_personNum3!=0 || this.com_personNum3==null){
                $("#alertTip").html("请填写汇报学生数!");
                $('#alertWrap').modal('show');
                return;
            }else if(this.com_answerTime3=='' && this.com_answerTime3!=0 || this.com_answerTime3==null){
                $("#alertTip").html("请填写教师点评时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(this.com_interactiveTime3=='' && this.com_interactiveTime3!=0 || this.com_interactiveTime3==null){
                $("#alertTip").html("请填写学生汇报时间!");
                $('#alertWrap').modal('show');
                return;
            }else if(isNaN(parseInt(this.com_teachTime3)) || isNaN(parseInt(this.com_answerTime3)) || isNaN(parseInt(this.com_interactiveTime3))){
                $("#alertTip").html("请填写正确的时间格式!");
                $('#alertWrap').modal('show');
                return;
            }else if(isNaN(parseInt(this.com_personNum3))){
                $("#alertTip").html("请填写正确的人数格式!");
                $('#alertWrap').modal('show');
                return;
            }else{
                this.celueTeachTime=parseInt(this.com_teachTime3);
                this.celueAnswerTime=parseInt(this.com_answerTime3);
                this.celueInteractiveTime=parseInt(this.com_interactiveTime3);
                this.celuePersonNum=parseInt(this.com_personNum3);
                if(this.celueTeachTime+this.celueAnswerTime+this.celueInteractiveTime!=this.com_meetLiveLong){
                    $("#alertTip").html("安排的时间之和不等于见面课时长!");
                    $('#alertWrap').modal('show');
                    return;
                }
            }
        }
        this.commisonerService.liveInteractiveStrategyupdate(this.hudongId,this.celueType,this.celueTeachTime,this.celueAnswerTime,this.celueInteractiveTime,this.com_hudongCeDiscri,this.celuePersonNum)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('修改互动策略');
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            if(resData.successful){
                $("#alertSuccessTip").html('保存成功!');
                $('#alertSuccessWrap').modal('show');
                this.findInteractiveStrategyByLiveId();
                this.initWeekInfoStep();
                setTimeout(()=> {
                    $('#alertSuccessWrap').modal('hide');
                }, 1000);
            }else{
                $("#alertTip").html("保存失败！");
                $('#alertWrap').modal('show');
            }
        });
    }

    //查询互动策略
    findInteractiveStrategyByLiveId(){
        this.commisonerService.findInteractiveStrategyByLiveId(this.weekChoseLiveId)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('查询策略');
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            this.com_teachTime1='';
            this.com_answerTime1='';
            this.com_interactiveTime1='';
            this.com_personNum1='';
            this.com_teachTime2='';
            this.com_answerTime2='';
            this.com_interactiveTime2='';
            this.com_personNum2='';
            this.com_teachTime3='';
            this.com_answerTime3='';
            this.com_interactiveTime3='';
            this.com_personNum3='';
            this.com_hudongCeDiscri='';
            if(resData.result!=null){
                this.isHavecelue=true;
                this.celueType=resData.result.type;
                this.com_hudongCeDiscri=resData.result.description;
                this.hudongId=resData.result.id;
                if(resData.result.type==1){
                    this.com_teachTime1=resData.result.teachTime;
                    this.com_answerTime1=resData.result.answerTime;
                    this.com_interactiveTime1=resData.result.interactiveTime;
                }else if(resData.result.type==2){
                    this.com_personNum2=resData.result.personNum;
                    this.com_teachTime2=resData.result.teachTime;
                    this.com_answerTime2=resData.result.answerTime;
                    this.com_interactiveTime2=resData.result.interactiveTime;
                }else{
                    this.com_personNum3=resData.result.personNum;
                    this.com_teachTime3=resData.result.teachTime;
                    this.com_answerTime3=resData.result.answerTime;
                    this.com_interactiveTime3=resData.result.interactiveTime;
                }
            }else{
                this.isHavecelue=false;
                this.celueType=1;
            }
            $('#liveZuzhiTypeSel').val(this.celueType).change();
            if(this.celueType==1){
                $('.zuzhiType2').hide();
                $('.zuzhiType3').hide();
                $('.zuzhiType1').show();
                this.celueType='1';
            }else if(this.celueType==2){
                $('.zuzhiType3').hide();
                $('.zuzhiType1').hide();
                $('.zuzhiType2').show();
                this.celueType='2';
            }else{
                $('.zuzhiType1').hide();
                $('.zuzhiType2').hide();
                $('.zuzhiType3').show();
                this.celueType='3';
            }
        });
    }

    public com_newTeacherName="";
    public com_newTeacherPhone="";
    private newSchoolCode='';
    private newClassRoom='';
    public com_newTimeLong="";
    private newSchoolName="";

    public com_hudongSchoolList:any;
    public com_hudongClassroom:any;
    //通过直播id查询互动学校
    getSchoolByLiveCourseId(id:any){
        var _that=this;
        this.commisonerService.getSchoolByLiveCourseId(id)
        .subscribe(data =>{
            console.log("进行中 通过直播id查询互动学校");
            console.log(data);
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            this.com_hudongSchoolList=data.result;
            setTimeout(()=>{
                $("#updateschool").unbind();
                $("#updateschool").select2({
                    placeholder: '请选择互动学校'
                });
                $('#updateschool').on('change', function (evt:any) {
                    _that.getHudongClassroom(this.value);
                });
                $("#updateclassroom").select2({
                    placeholder: '请选择互动教室',
                    minimumResultsForSearch: Infinity
                });

                $("#updateschoolx").unbind();
                $("#updateschoolx").select2({
                    placeholder: '请选择互动学校'
                });
                $('#updateschoolx').on('change', function (evt:any) {
                    _that.getHudongClassroom(this.value);
                });
                $("#updateclassroomx").select2({
                    placeholder: '请选择互动教室',
                    minimumResultsForSearch: Infinity
                });
            },300);
        });
    }

    //通过互动学校id查教室
    getHudongClassroom(id:any){
        this.commisonerService.getOldClassroomBySchoolCode(id)
        .subscribe(data =>{
            console.log("进行中 通过学校查教室");
            console.log(data);
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            this.com_hudongClassroom=data.result;
            let obj={
                classroomCode:'-888',
                classroomName:'待定',
                devName:''
            };
            this.com_hudongClassroom.splice(0, 0, obj);
            setTimeout(()=>{
                $("#updateclassroom").select2({
                    placeholder: '请选择互动教室',
                    minimumResultsForSearch: Infinity
                });
            },300);
        });
    }

    checkMobile(str:any) {
        let re = /^1\d{10}$/;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    }

    //增加互动教室
    createRoom(){
        var _that=this;
        this.newClassRoom=$("#updateclassroom option:selected").val();
        this.newSchoolCode=$("#updateschool option:selected").val();
        this.newSchoolName=$("#updateschool option:selected").text();
        if(this.com_weekLiveRoomList.find((room:any)=>room.classroomCode==this.newClassRoom)!=undefined && this.newClassRoom!='-888'){
            $("#alertTip").html("该见面课下已有此互动教室，请重新选择教室!");
            $('#alertWrap').modal('show');
            return;
        }
        if(this.com_weekLiveRoomList.find((room:any)=>room.schoolCode==this.newSchoolCode)!=undefined){
            let roomXiangdeng=this.com_weekLiveRoomList.find((room:any)=>room.schoolCode==this.newSchoolCode);
            if(roomXiangdeng.classroomCode=="-888" && this.newClassRoom=='-888'){
                $("#alertTip").html("同一个见面课下，相同的学校不能有多个待定教室!");
                $('#alertWrap').modal('show');
                return;
            }
        }
        let ppt=$('input[name="updateppt"]:checked').val();
        let fhoneIsTrue=this.checkMobile(this.com_newTeacherPhone);
        if(this.newSchoolCode==''){
            $("#alertTip").html("请选择互动学校!");
            $('#alertWrap').modal('show');
            return;
        }
        if(this.newClassRoom==''){
            $("#alertTip").html("请选择互动教室!");
            $('#alertWrap').modal('show');
            return;
        }
        if(this.com_newTeacherName==""){
            $("#alertTip").html("请填写教师姓名!");
            $('#alertWrap').modal('show');
            return;
        }
        if(!fhoneIsTrue){
            $("#alertTip").html("请填写正确的手机号码格式!");
            $('#alertWrap').modal('show');
            return;
        }
        if(isNaN(parseInt(this.com_newTimeLong))){
            $("#alertTip").html("请填写正确的时间格式!");
            $('#alertWrap').modal('show');
            return;
        }
        this.commisonerService.createRoom(this.weekChoseLiveId,this.newClassRoom,this.com_newTimeLong,ppt,this.newSchoolCode,this.newSchoolName,this.com_newTeacherName,this.com_newTeacherPhone,this.weekChoseLiveInfo.startTime,this.weekChoseLiveInfo.endTime)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            if(resData.successful){
                $("#alertSuccessTip").html('添加成功!');
                $('#alertSuccessWrap').modal('show');
                setTimeout(()=> {
                    $('#alertSuccessWrap').modal('hide');
                    _that.newSchoolCode='';
                    _that.newClassRoom='';
                    $("#updateclassroom").val('').change();
                    $("#updateschool").val('').change();
                    _that.com_newTeacherName="";
                    _that.com_newTeacherPhone="";
                    _that.com_newTimeLong="";
                    _that.com_hudongClassroom=[];
                    $('.guanbiHudong').click();
                    console.log(data);
                    _that.searchRoomfindByMeetCourseId(_that.weekChoseLiveId);
                }, 1000);
            }else{
                console.log(resData);
                if(resData.errorCode==20){
                    $("#alertTip").html("互动教室不能和主讲教室相同！");
                    $('#alertWrap').modal('show');
                }else{
                    $("#alertTip").html(resData.errorMsg+ '&nbsp;&nbsp;&nbsp;&nbsp;' +resData.result);
                    $('#alertWrap').modal('show');
                }
            }
        });
    }

    private updateHudongClassRoom:any;
    private updateHudongSchoolCode:any;
    private updateHudongSchoolName:any;
    public com_newTeacherNamex:any;
    public com_newTeacherPhonex:any;
    public com_newTimeLongx:any;
    private updateRoomId:any;
    private clickRoomInfo:any;
    getClickRoomIdAndInfo(id:any){
        this.updateRoomId=id;
        this.clickRoomInfo=this.com_weekLiveRoomList.find((room:any)=>room.id==this.updateRoomId);
        let upSC=this.clickRoomInfo.schoolCode;
        $('#updateschoolx').val(upSC).change();
        setTimeout(()=>{
            let upCR=this.clickRoomInfo.classroomCode;
            $('#updateclassroomx').val(upCR).change();
        },300);
        this.com_newTeacherNamex=this.clickRoomInfo.teacherName;
        this.com_newTeacherPhonex=this.clickRoomInfo.teacherPhone;
        this.com_newTimeLongx=this.clickRoomInfo.timeLong;
        if(this.clickRoomInfo.isHavePpt==2){
            $('input:radio[name="updatepptx"]').eq(1).removeAttr("checked");
            $('input:radio[name="updatepptx"]').eq(0).prop("checked",'checked');
        }else{
            $('input:radio[name="updatepptx"]').eq(0).removeAttr("checked");
            $('input:radio[name="updatepptx"]').eq(1).prop("checked",'checked');
        }
    }
    //修改互动教室
    updateRoom(){
        var _that=this;
        let oCC=this.clickRoomInfo.classroomCode;
        this.updateHudongClassRoom=$("#updateclassroomx option:selected").val();
        this.updateHudongSchoolCode=$("#updateschoolx option:selected").val();
        this.updateHudongSchoolName=$("#updateschoolx option:selected").text();
        let ppt=$('input[name="updatepptx"]:checked').val();
        let fhoneIsTrue=this.checkMobile(this.com_newTeacherPhonex);
        if(this.com_weekLiveRoomList.find((room:any)=>room.schoolCode==this.updateHudongSchoolCode)!=undefined){
            let roomXiangdeng=this.com_weekLiveRoomList.find((room:any)=>room.schoolCode==this.updateHudongSchoolCode);
            if(roomXiangdeng.classroomCode=="-888" && this.updateHudongClassRoom=='-888'){
                $("#alertTip").html("同一个见面课下，相同的学校不能有多个待定教室!");
                $('#alertWrap').modal('show');
                return;
            }
        }
        if(this.updateHudongSchoolCode==''){
            $("#alertTip").html("请选择互动学校!");
            $('#alertWrap').modal('show');
            return;
        }
        if(this.updateHudongClassRoom==''){
            $("#alertTip").html("请选择互动教室!");
            $('#alertWrap').modal('show');
            return;
        }
        if(this.com_newTeacherNamex==""){
            $("#alertTip").html("请填写教师姓名!");
            $('#alertWrap').modal('show');
            return;
        }
        if(!fhoneIsTrue){
            $("#alertTip").html("请填写正确的手机号码格式!");
            $('#alertWrap').modal('show');
            return;
        }
        if(isNaN(parseInt(this.com_newTimeLongx))){
            $("#alertTip").html("请填写正确的时间格式!");
            $('#alertWrap').modal('show');
            return;
        }
        this.commisonerService.updateRoom(this.weekChoseLiveId,this.updateHudongClassRoom,this.com_newTimeLongx,ppt,this.updateHudongSchoolCode,this.updateHudongSchoolName,this.com_newTeacherNamex,this.com_newTeacherPhonex,this.weekChoseLiveInfo.startTime,this.weekChoseLiveInfo.endTime,this.updateRoomId,oCC)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            if(data.successful){
                $("#alertSuccessTip").html('修改成功!');
                $('#alertSuccessWrap').modal('show');
                let classCode=this.com_weekLiveRoomList.find((room:any) => room.id==this.updateRoomId).classroomCode;
                setTimeout(()=> {
                    $('#alertSuccessWrap').modal('hide');
                    _that.updateHudongSchoolCode='';
                    _that.updateHudongClassRoom='';
                    $("#updateclassroomx").val('').change();
                    $("#updateschoolx").val('').change();
                    _that.com_newTeacherNamex="";
                    _that.com_newTeacherPhonex="";
                    _that.com_newTimeLongx="";
                    _that.com_hudongClassroom=[];
                    $('.guanbiXiuHudong').click();
                    console.log(data);
                    _that.searchRoomfindByMeetCourseId(_that.weekChoseLiveId);
                }, 1000);
            }else{
                console.log(data);
                if(data.errorCode==20){
                    $("#alertTip").html("互动教室不能和主讲教室相同！");
                    $('#alertWrap').modal('show');
                }else{
                    $("#alertTip").html(data.errorMsg+ '&nbsp;&nbsp;&nbsp;&nbsp;' +data.result);
                    $('#alertWrap').modal('show');
                }
            };
        });
    }

    private deleteRoomId:any;
    //获取要删除的互动教室id
    getClickRoomId(id:any){
        this.deleteRoomId=id;
    }

    //删除互动教室
    deleteRoom(){
        this.commisonerService.deleteRoom(this.deleteRoomId)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("删除互动教室");
            console.log(data);
            if(data.successful){
                this.searchRoomfindByMeetCourseId(this.weekChoseLiveId);
                let classCode=this.com_weekLiveRoomList.find((room:any) => room.id==this.deleteRoomId).classroomCode;
                this.commisonerService.deleteLP(this.weekChoseLiveId,classCode)
                .subscribe(data=>{
                    console.log('删除互动教室后销毁该教室下的导播');
                    console.log(data);
                });
                setTimeout(() =>{
                    $(".nano").nanoScroller();
                    $(".nano").nanoScroller({ preventPageScrolling: true });
                },300);
            }else{
                $("#alertTip").html("删除失败！");
                $('#alertWrap').modal('show');
            }
        });
    }

    //确认并提交（策略）
    ensureCelue(){
        if(this.isHavecelue){
            this.liveInteractiveStrategyupdate();
        }else{
            this.liveInteractiveStrategycreate();
        }
    }

    private afteraddRoomResData:any;
    //通过见面课ID查询见面课信息
    searchRoomfindByMeetCourseId(id:any){
        this.commisonerService.findByMeetCourseId(id)
        .subscribe(data =>{
            console.log("见面课id查询见面课信息 查互动教室");
            console.log(data);
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            this.afteraddRoomResData=eval('('+data['_body']+')');
            this.com_weekLiveRoomList=this.afteraddRoomResData.result.liveRoomList;
            if( this.com_weekLiveRoomList==null){
                this.com_weekLiveRoomList=[];
            }
            for(var i=0;i<this.com_weekLiveRoomList.length;i++){
                if(this.com_weekLiveRoomList[i].classroomCode=='-888'){
                    this.com_weekLiveRoomList[i].classroomName="教室待定";
                }
            }
            setTimeout(() =>{
                    $(".nano").nanoScroller();
                    $(".nano").nanoScroller({ preventPageScrolling: true });
                },300);
        });
    }

    private daojishi_day:any;
    private daojishi_hour:any;
    private daojishi_minute:any;
    private daojishi_second:any;
    public daojishiIsPlayed=false;
    private timeJIshi:any;
    public daojishiIsPlaying=false;
    public daojishiIsShow=true;
    //倒计时
    daojishi(timeFuture:any){
        this.daojishiIsPlayed=false;
        this.daojishiIsPlaying=false;
        this.daojishiIsShow=true;
        if(this.weekChoseLiveInfo.liveStatus==3){
            this.daojishiIsPlayed=true;
            this.daojishiIsShow=false;
        }else{
            this.daojishiIsPlayed=false;
        }
        if(this.weekChoseLiveInfo.liveStatus==2){
            this.daojishiIsPlaying=true;
            this.daojishiIsShow=false;
        }else{
            this.daojishiIsPlaying=false;
        }
        this.timeJIshi=setInterval(()=>{
            let currentTime=new Date().getTime();
            let timeLeave = Math.round((timeFuture-currentTime)/1000);//定义剩余时间, 必须用时间戳.单位为秒
            if(timeLeave<=0){
                clearInterval(this.timeJIshi);
                this.daojishi_day=0;
                this.daojishi_hour=0;
                this.daojishi_minute=0;
                this.daojishi_second=0;
            }else{
                this.daojishi_day=Math.floor((timeLeave / 3600) / 24);
                this.daojishi_hour=Math.floor((timeLeave - this.daojishi_day * 24 * 3600) / 3600);
                this.daojishi_minute=Math.floor((timeLeave - this.daojishi_day * 24 * 3600 - this.daojishi_hour * 3600) / 60);
                this.daojishi_second=(timeLeave - this.daojishi_hour * 3600) % 60;
            }
        },1000);
    }

    public com_liveDetailInfo:any;
    public com_liveDetailInfozhuRoom:any[]=[];
    public com_liveDetailInfohuRoom:any[]=[];
    public com_yuyinUrl='';
    public com_liveUrl="";
    public com_hTowerUrl="";
    public com_zhibanName="";
    public com_zhibanPhone="";
    //获取周见面课详情
    getZYLiveDetailDto(){
        this.com_liveDetailInfozhuRoom=[];
        this.com_liveDetailInfohuRoom=[];
        this.commisonerService.getZYLiveDetailDto(this.weekChoseLiveId)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获取见面课详情');
            console.log(eval('('+data['_body']+')'));
            let resData=eval('('+data['_body']+')').result;
            this.com_liveDetailInfo=resData;
            if(this.com_liveDetailInfo.zhibanInfo==null){
                this.com_liveDetailInfo.zhibanInfo={
                    zhibanName:"—",
                    zhibanPhone:"—"
                };
            }else{
                if(this.com_liveDetailInfo.zhibanInfo.zhibanName==null || this.com_liveDetailInfo.zhibanInfo.zhibanName=="" || this.com_liveDetailInfo.zhibanInfo.zhibanName==undefined){
                    this.com_liveDetailInfo.zhibanInfo.zhibanName="—";
                }
                if(this.com_liveDetailInfo.zhibanInfo.zhibanPhone==null || this.com_liveDetailInfo.zhibanInfo.zhibanPhone=="" || this.com_liveDetailInfo.zhibanInfo.zhibanPhone==undefined){
                    this.com_liveDetailInfo.zhibanInfo.zhibanPhone="—";
                }
            }
            this.com_zhibanName=this.com_liveDetailInfo.zhibanInfo.zhibanName;
            this.com_zhibanPhone=this.com_liveDetailInfo.zhibanInfo.zhibanPhone;
            if(this.com_liveDetailInfo.daoboInfos!=null){
                for(var i=0;i<this.com_liveDetailInfo.daoboInfos.length;i++){
                    if(this.com_liveDetailInfo.daoboInfos[i].daoboName==null || this.com_liveDetailInfo.daoboInfos[i].daoboName=="" || this.com_liveDetailInfo.daoboInfos[i].daoboName==undefined){
                        this.com_liveDetailInfo.daoboInfos[i].daoboName="—";
                    }
                    if(this.com_liveDetailInfo.daoboInfos[i].daoboPhone==null || this.com_liveDetailInfo.daoboInfos[i].daoboPhone=="" || this.com_liveDetailInfo.daoboInfos[i].daoboPhone==undefined){
                        this.com_liveDetailInfo.daoboInfos[i].daoboPhone="—";
                    }
                    if(this.com_liveDetailInfo.daoboInfos[i].schoolCode=='-999'){
                        this.com_liveDetailInfo.daoboInfos[i].schoolName='待定';
                        this.com_liveDetailInfo.daoboInfos[i].classroomName='';
                    }else{
                        if(this.com_liveDetailInfo.daoboInfos[i].classroomCode=='-888'){
                            this.com_liveDetailInfo.daoboInfos[i].classroomName='待定';
                        }
                    }
                    if(this.com_liveDetailInfo.daoboInfos[i].roomType==0){
                        this.com_liveDetailInfozhuRoom.push(this.com_liveDetailInfo.daoboInfos[i]);
                    }else{
                        this.com_liveDetailInfohuRoom.push(this.com_liveDetailInfo.daoboInfos[i]);
                    }
                }
            }else{
                this.com_liveDetailInfozhuRoom=[];
                this.com_liveDetailInfohuRoom=[];
            }
            this.com_hTowerUrl="http://ht.livecourse.com/#/detail/"+this.weekChoseLiveInfo.livecourseId;
            if(this.weekChoseLiveInfo.liveStatus=='1'){
                this.com_liveUrl="";
            }else if(this.weekChoseLiveInfo.liveStatus=='2'){
                this.com_liveUrl='http://lc.zhihuishu.com/live/live_room.html?liveId='+this.weekChoseLiveInfo.livecourseId;
            }else{
                this.com_liveUrl='http://lc.zhihuishu.com/live/vod_room.html?liveId='+this.weekChoseLiveInfo.livecourseId;
            }
        });
        this.commisonerService.getZhumuMeettingUrl(this.weekChoseLiveInfo.livecourseId)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获取进入语音频道地址');
            console.log(data);
            let resurlData=eval('('+data['_body']+')');
            if(resurlData.successful){
                this.com_yuyinUrl=resurlData.result.url;
            }else{
                this.com_yuyinUrl='';
            }
        });
    }

    jumpTolive(){
        if(this.com_liveUrl==''){
            event.preventDefault();
            $("#alertTip").html("直播未开始!");
            $('#alertWrap').modal('show');
        }
    }

    jumpToyuyin(){
        if(this.com_yuyinUrl==''){
            event.preventDefault();
            $("#alertTip").html("未找到对应的瞩目会议!");
            $('#alertWrap').modal('show');
        }
    }

    //获取反馈
    private weekfankuiInfo:any;

    public com_hisTeacherProblem:any;
    public com_hisSpeakerClassroomProblem:any;
    public com_hisInteractiveClassroomProblem:any;
    public com_hisDaoboProblem:any;
    public com_hisOtherProblem:any;
    public com_hisFeedbackDetail:any;
    //获取周见面课反馈
    getWeekLiveFankui(){
        setTimeout(()=>{
            $('.submitFeedBackInfo').hide();
            if(this.weekChoseLiveInfo.feedback){
                $('.com_hisTeacherProblem').attr('disabled','disabled');
                $('.com_hisSpeakerClassroomProblem').attr('disabled','disabled');
                $('.com_hisInteractiveClassroomProblem').attr('disabled','disabled');
                $('.com_hisDaoboProblem').attr('disabled','disabled');
                $('.com_hisOtherProblem').attr('disabled','disabled');
                $('.com_hisFeedbackDetail').attr('disabled','disabled');
                this.weekfankuiInfo=this.weekChoseLiveInfo.runCommissionerLiveFeedBackDto;
                if(this.weekfankuiInfo.teacherProblem!=null && this.weekfankuiInfo.teacherProblem!=undefined && this.weekfankuiInfo.teacherProblem!="undefined"){
                    this.com_hisTeacherProblem=this.weekfankuiInfo.teacherProblem;
                }else{
                    this.com_hisTeacherProblem="";
                }
                if(this.weekfankuiInfo.speakerClassroomProblem!=null && this.weekfankuiInfo.speakerClassroomProblem!=undefined && this.weekfankuiInfo.speakerClassroomProblem!="undefined"){
                    this.com_hisSpeakerClassroomProblem=this.weekfankuiInfo.speakerClassroomProblem;
                }else{
                    this.com_hisSpeakerClassroomProblem="";
                }
                if(this.weekfankuiInfo.interactiveClassroomProblem!=null && this.weekfankuiInfo.interactiveClassroomProblem!=undefined && this.weekfankuiInfo.interactiveClassroomProblem!="undefined"){
                    this.com_hisInteractiveClassroomProblem=this.weekfankuiInfo.interactiveClassroomProblem;
                }else{
                    this.com_hisInteractiveClassroomProblem="";
                }
                if(this.weekfankuiInfo.daoboProblem!=null && this.weekfankuiInfo.daoboProblem!=undefined && this.weekfankuiInfo.daoboProblem!="undefined"){
                    this.com_hisDaoboProblem=this.weekfankuiInfo.daoboProblem;
                }else{
                    this.com_hisDaoboProblem="";
                }
                if(this.weekfankuiInfo.otherProblem!=null && this.weekfankuiInfo.otherProblem!=undefined && this.weekfankuiInfo.otherProblem!="undefined"){
                    this.com_hisOtherProblem=this.weekfankuiInfo.otherProblem;
                }else{
                    this.com_hisOtherProblem="";
                }
                if(this.weekfankuiInfo.feedbackDescription!=null && this.weekfankuiInfo.feedbackDescription!=undefined && this.weekfankuiInfo.feedbackDescription!="undefined"){
                    this.com_hisFeedbackDetail=this.weekfankuiInfo.feedbackDescription;
                }else{
                    this.com_hisFeedbackDetail="";
                }
            }else{
                this.com_hisTeacherProblem="";
                this.com_hisSpeakerClassroomProblem="";
                this.com_hisInteractiveClassroomProblem="";
                this.com_hisDaoboProblem="";
                this.com_hisOtherProblem="";
                this.com_hisFeedbackDetail="";
                $('.submitFeedBackInfo').show();
                $('.com_hisTeacherProblem').removeAttr('disabled');
                $('.com_hisSpeakerClassroomProblem').removeAttr('disabled');
                $('.com_hisInteractiveClassroomProblem').removeAttr('disabled');
                $('.com_hisDaoboProblem').removeAttr('disabled');
                $('.com_hisOtherProblem').removeAttr('disabled');
                $('.com_hisFeedbackDetail').removeAttr('disabled');
            }
        },200);
    }

    //反馈提交
    submitFeedBackInfo(){
        var _that=this;
        if(this.com_hisTeacherProblem=="" && this.com_hisSpeakerClassroomProblem=="" && this.com_hisInteractiveClassroomProblem=="" && this.com_hisDaoboProblem=="" && this.com_hisOtherProblem=="" && this.com_hisFeedbackDetail==""){
            $("#alertTip").html("反馈信息不能全部为空，请至少填写一项！");
            $('#alertWrap').modal('show');
            return;
        }
        this.commisonerService.submitFeedBackInfo(this.weekChoseLiveId,this.com_hisTeacherProblem,this.com_hisSpeakerClassroomProblem,this.com_hisInteractiveClassroomProblem,this.com_hisDaoboProblem,this.com_hisOtherProblem,this.com_hisFeedbackDetail)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("反馈提交");
            console.log(data);
            let resFb=eval('('+data['_body']+')');
            if(resFb.successful){
                $("#alertSuccessTip").html('提交成功!');
                $('#alertSuccessWrap').modal('show');
                this.findRunCommissionerRunPhaseLiveByTimeInterval(this.sTimeTogetCurrentWeekLive,this.eTimeTogetCurrentWeekLive,1);
                setTimeout(()=> {
                    $('#alertSuccessWrap').modal('hide');
                    $('#cUeditorFankui').modal('hide');
                }, 1000);
            }else{
                $("#alertTip").html(resFb.errorMsg);
                $('#alertWrap').modal('show');
            }
        });
    }

    public currentCourseID:any;
    public com_ishaveFenpeiCourse=true;
    private cUfenpeiResData:any;
    public com_fenpeiCourseList:any;
    //获取当前专员分配的课程信息
    getAllocationCourse(flag:any){
        this.commisonerService.getAllocationCourse(this.showScheduleId)
        .subscribe(data => {
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            this.cUfenpeiResData=eval('('+data['_body']+')');
            console.log("进行中课表分配的课程");
            console.log(this.cUfenpeiResData);
            this.com_fenpeiCourseList=this.cUfenpeiResData.result;
            if(this.com_fenpeiCourseList.length==0){
                this.com_ishaveFenpeiCourse=false;
            }else{
                this.com_ishaveFenpeiCourse=true;
                for(var i=0;i<this.cUfenpeiResData.result.length;i++){
                    if(this.cUfenpeiResData.result[i].requirementChanges==undefined || this.cUfenpeiResData.result[i].requirementChanges==null || this.cUfenpeiResData.result[i].requirementChanges.length==0){
                        this.cUfenpeiResData.result[i].biangengIng=false;
                    }else{
                        if(this.cUfenpeiResData.result[i].requirementChanges[0].isAgree==0){
                            this.cUfenpeiResData.result[i].biangengIng=true;
                        }else{
                            this.cUfenpeiResData.result[i].biangengIng=false;
                        }
                    }
                }
                if(flag==-1){
                    this.switchCourse(this.com_fenpeiCourseList[0].id);
                }else{
                    this.switchCourse(this.currentCourseID);
                }
                setTimeout(()=>{
                    $(".nano").nanoScroller();
                    $(".nano").nanoScroller({ preventPageScrolling: true });
                },300);
            }
        });
    }

    switchCourse(id:any){
        this.currentCourseID=id;
        this.isRunningTimeForRecruit(this.currentCourseID);
        this.findByCourseId(this.currentCourseID);
    }

    public isHaveFenpeiLive=true;
    public com_staColorArr=["#fff","#9CC0EA","#F3BF32","#33CC66","#F14E4E","#2570D3","#222D32"];
    public com_isshowPaikewanC=true;
    public com_isshowBiangengBtn=false;
    public com_isshowBiangengIng=false;
    public com_isshowBiangengPost=false;
    public com_BiangengBaocun=false;
    public canEditor=true;
    private currentCourse:any;
    public currentLiveList:any;
    public currentCourseIshaveLive=true;
    private liveKaiguanList:any[]=[];
    private cUadmissionId:any;
    //根据课程id查询见面课列表
    findByCourseId(id:any){
        this.commisonerService.findByCourseId(id)
        .subscribe(data => {
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('通过课程id查询见面课');
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            this.canEditor=true;
            this.currentCourse=resData.result;
            this.cUadmissionId=this.currentCourse.admissionId;
            if(this.currentCourse.liveList.length>0){
                this.isHaveFenpeiLive=true;
                this.com_BiangengBaocun=false;
                if(this.currentCourse.status==6){
                    if(this.currentCourse.requirementChanges == undefined || this.currentCourse.requirementChanges == null || this.currentCourse.requirementChanges.length==0){
                        this.com_isshowPaikewanC=false;
                        this.com_isshowBiangengBtn=true;
                        this.com_isshowBiangengIng=false;
                        this.com_isshowBiangengPost=false;
                    }else{
                        if(this.currentCourse.requirementChanges[0].isAgree==0){
                            this.com_isshowPaikewanC=false;
                            this.com_isshowBiangengBtn=false;
                            this.com_isshowBiangengIng=true;
                            this.com_isshowBiangengPost=false;
                        }else{
                            this.com_isshowPaikewanC=false;
                            this.com_isshowBiangengBtn=false;
                            this.com_isshowBiangengIng=false;
                            this.com_isshowBiangengPost=true;
                            this.com_BiangengBaocun=false;
                        }
                    }
                }else if(this.currentCourse.status==3){
                    this.com_isshowPaikewanC=false;
                    this.com_isshowBiangengBtn=false;
                    this.com_isshowBiangengIng=false;
                    this.com_isshowBiangengPost=false;
                }else{
                    this.com_isshowPaikewanC=true;
                    this.com_isshowBiangengBtn=false;
                    this.com_isshowBiangengIng=false;
                    this.com_isshowBiangengPost=false;
                }
                this.currentLiveList=resData.result.liveList;
                this.liveKaiguanList=[];
                if(this.currentLiveList==null || this.currentLiveList==undefined || this.currentLiveList.length==0){
                    this.currentCourseIshaveLive=false;
                }else{
                    if(resData.result.requirementChanges.length>0 && resData.result.requirementChanges[0].isAgree==0){
                        let afterLiveList=resData.result.requirementChanges[0].requireChangeDetails;
                        for(var i=0;i<afterLiveList.length;i++){
                            let liveid=afterLiveList[i].liveId;
                            this.currentLiveList.find((live:any)=>live.id==liveid).classroomCode=afterLiveList[i].afterClassroomCode;
                            this.currentLiveList.find((live:any)=>live.id==liveid).endTime=afterLiveList[i].afterEndTime;
                            if(afterLiveList[i].afterClassroomName!=undefined && (afterLiveList[i].afterClassroomName==null || afterLiveList[i].afterClassroomName=="") && afterLiveList[i].afterClassroomCode=='-888'){
                                afterLiveList[i].afterClassroomName='待定';
                            }
                            this.currentLiveList.find((live:any)=>live.id==liveid).classroomName=afterLiveList[i].afterClassroomName;
                            this.currentLiveList.find((live:any)=>live.id==liveid).schoolCode=afterLiveList[i].afterSchoolCode;
                            this.currentLiveList.find((live:any)=>live.id==liveid).schoolName=afterLiveList[i].afterSchoolName;
                            this.currentLiveList.find((live:any)=>live.id==liveid).startTime=afterLiveList[i].afterStartTime;
                            this.currentLiveList.find((live:any)=>live.id==liveid).isAvailable=afterLiveList[i].afterAvailable;
                        }
                    }
                    this.currentCourseIshaveLive=true;
                    for(var i=0;i<this.currentLiveList.length;i++){
                        this.liveKaiguanList.push(this.currentLiveList[i].isAvailable);
                        if(this.currentLiveList[i].schoolCode=='-999'){
                            this.currentLiveList[i].schoolName="待定";
                        }else{
                            if(this.currentLiveList[i].classroomCode=='-888'){
                                this.currentLiveList[i].classroomName="待定";
                            }
                        }
                    }
                    if(this.com_isshowPaikewanC || this.com_BiangengBaocun){
                        this.canEditor=true;
                        this.initLiveListForUpdate();
                        console.log(this.liveKaiguanList);
                        setTimeout(()=>{
                            this.switchAllKaigun();
                            this.initLiveTimePlugins();
                        },200);
                    }else{
                        this.canEditor=false;
                        this.initLiveListForUpdate();
                        setTimeout(()=>{
                            this.switchAllKaigun();
                        },200);
                    }
                }
            }else{
                this.isHaveFenpeiLive=false;
            }
        });
    }

    private liveListForUpdate:any[]=[];
    public liveListForPaike:any[]=[];       //为了筛选教室相关的展示以及操作
    //创建见面课列表obj（为了修改时提交）
    initLiveListForUpdate(){
        this.liveListForUpdate=[];
        this.liveListForPaike=[];
        for(var i=0;i<this.currentLiveList.length;i++){
            let liveObj={
                classroomCode:this.currentLiveList[i].classroomCode,
                classroomName:this.currentLiveList[i].classroomName,
                courseId:this.currentLiveList[i].courseId,
                endTimeStr:moment(this.currentLiveList[i].endTime).format('YYYY-MM-DD HH:mm'),
                id:this.currentLiveList[i].id,
                isAvailable:this.currentLiveList[i].isAvailable,
                schoolCode:this.currentLiveList[i].schoolCode,
                schoolName:this.currentLiveList[i].schoolName,
                sourceType:1,
                startTimeStr:moment(this.currentLiveList[i].startTime).format('YYYY-MM-DD HH:mm')
            };
            let pkLiveObj={
                id:this.currentLiveList[i].id,
                liveName:this.currentLiveList[i].liveName,
                livetime:'',
                classroomCode:'',
                classroomName:'',
                schoolCode:'',
                schoolName:''
            };
            this.liveListForPaike.push(pkLiveObj);
            this.liveListForUpdate.push(liveObj);
        }
        console.log('创建见面课列表obj  为了修改时提交');
        console.log(this.liveListForUpdate);
    }

    //初始化所有开关状态
    switchAllKaigun(){
        for(var i=0;i<this.liveKaiguanList.length;i++){
            if(this.liveKaiguanList[i]==2){
                $($('.liveKaiguan')[i]).removeAttr("checked");
            }
        }
    }
    //切换单个见面课开关
    switchLiveKaiGuan(sort:any){
        // event.stopPropagation();
        if(this.liveKaiguanList[sort]==1){
            this.liveKaiguanList[sort]=2;
            //this.liveListForUpdate[sort].isAvailable=2;
        }else{
            this.liveKaiguanList[sort]=1;
            //this.liveListForUpdate[sort].isAvailable=1;
        }
        console.log(this.liveKaiguanList);
    }

    //初始化见面课时间控件
    initLiveTimePlugins(){
        var _that=this;
        for(var i=0;i<$('.infoTimeCon').length;i++){
            let sT;
            let eT;
            if($($('.timeSpanCon')[i]).html()!="" && $($('.timeSpanCon')[i]).html()!='-'){
                let time1=$($('.timeSpanCon')[i]).html().split(' ')[0];
                let time2=time1.split('/');
                let lastSpanDate=time2[0]+'-'+time2[1]+'-'+time2[2];
                let time3=$($('.timeSpanCon')[i]).html().split(' ')[1];
                let time4=time3.split('-')[0];
                let time5=time3.split('-')[1];
                sT=lastSpanDate+ ' ' +time4;
                eT=lastSpanDate+ ' ' +time5;
            }else{
                let newTimeEnd=new Date();
                sT=moment(newTimeEnd).format('YYYY-MM-DD HH:mm');
                eT=moment(newTimeEnd).format('YYYY-MM-DD HH:mm');
            }
            if(!this.com_isCuKebiao){
                if(i<=1){
                    $($('.infoTimeCon')[i]).daterangepicker(
                        {
                            timePicker: true,
                            timePickerIncrement: 5,
                            opens: "left",
                            drops: "down",
                            startDate: sT,
                            endDate: eT
                        },
                        function(start, end){
                            console.log('选择的时间: ' + start.format('YYYY/MM/DD HH:mm') + ' - ' + end.format('YYYY/MM/DD HH:mm'));
                            if(_that.timeFollowFlag){
                                let oldSEDateTime=$($('.timeSpanCon')[_that.currentSelectLiveIndex]).html();
                                let changeTime=true;
                                if(oldSEDateTime=="" || oldSEDateTime=="-" || oldSEDateTime=="null"){
                                   changeTime=true;
                                }else{
                                    let oldSDate=oldSEDateTime.split('-')[0];
                                    let oldSTime=new Date(oldSDate).getTime();
                                    let newSTime=new Date(start.format('YYYY/MM/DD HH:mm')).getTime();
                                    let timeValue=newSTime-oldSTime;
                                    console.log(timeValue);
                                    changeTime=_that.timeFollow(timeValue);
                                }
                                if(changeTime){
                                    let timeSelect=start.format('YYYY/MM/DD HH:mm')+'-'+end.format('HH:mm');
                                    $($('.timeSpanCon')[_that.currentSelectLiveIndex]).html(timeSelect);
                                }
                            }else{
                                let timeSelect=start.format('YYYY/MM/DD HH:mm')+'-'+end.format('HH:mm');
                                $($('.timeSpanCon')[_that.currentSelectLiveIndex]).html(timeSelect);
                            }
                    });
                }else{
                    $($('.infoTimeCon')[i]).daterangepicker(
                        {
                            timePicker: true,
                            timePickerIncrement: 5,
                            opens: "left",
                            drops: "up",
                            startDate: sT,
                            endDate: eT
                        },
                        function(start, end){
                            console.log('选择的时间: ' + start.format('YYYY/MM/DD HH:mm') + ' - ' + end.format('YYYY/MM/DD HH:mm'));
                            if(_that.timeFollowFlag){
                                let oldSEDateTime=$($('.timeSpanCon')[_that.currentSelectLiveIndex]).html();
                                let changeTime=true;
                                if(oldSEDateTime=="" || oldSEDateTime=="-" || oldSEDateTime=="null"){
                                   changeTime=true;
                                }else{
                                    let oldSDate=oldSEDateTime.split('-')[0];
                                    let oldSTime=new Date(oldSDate).getTime();
                                    let newSTime=new Date(start.format('YYYY/MM/DD HH:mm')).getTime();
                                    let timeValue=newSTime-oldSTime;
                                    console.log(timeValue);
                                    changeTime=_that.timeFollow(timeValue);
                                }
                                if(changeTime){
                                    let timeSelect=start.format('YYYY/MM/DD HH:mm')+'-'+end.format('HH:mm');
                                    $($('.timeSpanCon')[_that.currentSelectLiveIndex]).html(timeSelect);
                                }
                            }else{
                                let timeSelect=start.format('YYYY/MM/DD HH:mm')+'-'+end.format('HH:mm');
                                $($('.timeSpanCon')[_that.currentSelectLiveIndex]).html(timeSelect);
                            }
                    });
                }
            }else{
                $($('.infoTimeCon')[i]).daterangepicker(
                    {
                        timePicker: true,
                        timePickerIncrement: 5,
                        opens: "left",
                        drops: "up",
                        startDate: sT,
                        endDate: eT
                    },
                    function(start, end){
                        console.log('选择的时间: ' + start.format('YYYY/MM/DD HH:mm') + ' - ' + end.format('YYYY/MM/DD HH:mm'));
                        if(_that.timeFollowFlag){
                            let oldSEDateTime=$($('.timeSpanCon')[_that.currentSelectLiveIndex]).html();
                            let changeTime=true;
                            if(oldSEDateTime=="" || oldSEDateTime=="-" || oldSEDateTime=="null"){
                                changeTime=true;
                            }else{
                                let oldSDate=oldSEDateTime.split('-')[0];
                                let oldSTime=new Date(oldSDate).getTime();
                                let newSTime=new Date(start.format('YYYY/MM/DD HH:mm')).getTime();
                                let timeValue=newSTime-oldSTime;
                                console.log(timeValue);
                                changeTime=_that.timeFollow(timeValue);
                            }
                            if(changeTime){
                                let timeSelect=start.format('YYYY/MM/DD HH:mm')+'-'+end.format('HH:mm');
                                $($('.timeSpanCon')[_that.currentSelectLiveIndex]).html(timeSelect);
                            }
                        }else{
                            let timeSelect=start.format('YYYY/MM/DD HH:mm')+'-'+end.format('HH:mm');
                            $($('.timeSpanCon')[_that.currentSelectLiveIndex]).html(timeSelect);
                        }
                });
            }
        }
    }

    private timeFollowFlag=true;
    switchTimeFollow(){
        if(this.timeFollowFlag){
            this.timeFollowFlag=false;
        }else{
            this.timeFollowFlag=true;
        }
    }

    private timeBySpanHtml:any;
    private timeSpanTimeChuo=0;
    private timeSpanMin=99999999999999;
    private timeSpanMinIndex:any;
    private timeNeedFollowList:any[]=[];
    private currentTimeChuo:any;
    private timeIsFollow=true;
    //时间联动
    timeFollow(value:any){
        this.timeNeedFollowList=[];
        this.timeSpanMin=99999999999999;
        for(var i=0;i<this.liveKaiguanList.length;i++){
            if(this.liveKaiguanList[i]==1 && this.currentLiveList[i].liveStatus==1 && i!=this.currentSelectLiveIndex){
                this.timeNeedFollowList.push($($('.timeSpanCon')[i]));
                this.timeBySpanHtml=$($('.timeSpanCon')[i]).html().split('-')[0];
                this.timeSpanTimeChuo=new Date(this.timeBySpanHtml).getTime();
                if(this.timeSpanMin>this.timeSpanTimeChuo){
                    this.timeSpanMin=this.timeSpanTimeChuo;     //获取到需要联动的最小时间
                    this.timeSpanMinIndex=i;                    //获取最小时间的index
                }
            }
        }
        this.currentTimeChuo=new Date().getTime();
        let minSpanNewTime=this.timeSpanMin+value;
        if(minSpanNewTime<=this.currentTimeChuo){
            this.timeIsFollow=false;
            let errorMsg="联动修改后，见面课：" + this.currentLiveList[this.timeSpanMinIndex].liveName +" 时间将无效，请重新选择！";
            $("#alertTip").html(errorMsg);
            $('#alertWrap').modal('show');
        }else{
            this.timeIsFollow=true;
            for(var k=0;k<this.timeNeedFollowList.length;k++){
                let spanTimeStart=this.timeNeedFollowList[k].html().split('-')[0];
                let spanTimeDate=this.timeNeedFollowList[k].html().split('-')[0].split(' ')[0];
                let spanTimeEnd=spanTimeDate+ ' ' +this.timeNeedFollowList[k].html().split('-')[1];
                let newTimeStart=new Date(spanTimeStart).getTime()+value;
                let newTimeEnd=new Date(spanTimeEnd).getTime()+value;
                let newTimeSE=moment(newTimeStart).format('YYYY/MM/DD HH:mm')+ '-' +moment(newTimeEnd).format('HH:mm');
                this.timeNeedFollowList[k].html(newTimeSE);
            }
        }
        return this.timeIsFollow;
    }

    private currentSelectLiveIndex:any;
    //获取当前点击的见面课时间span的index
    getSelectLiveTime(flag:any){
        console.log('点击的是第'+(flag+1)+'个见面课');
        this.currentSelectLiveIndex=flag;
    }
    private currentLiveSchoolCode:any;
    private currentLiveClassroomCode:any;
    private currentLiveId:any;
    //获取当前点击的见面课的index（为了获取当前见面课的初始schoolCode、classroomCode）
    getSelectLiveClassRoom(flag:any){
        console.log('点击的是第'+(flag+1)+'个见面课');
        this.currentSelectLiveIndex=flag;
        this.currentLiveSchoolCode=this.currentLiveList[flag].schoolCode;
        this.currentLiveClassroomCode=this.currentLiveList[flag].classroomCode;
        this.currentLiveId=this.currentLiveList[flag].id;
        this.getLiveProvincesBySchoolCode(this.currentLiveSchoolCode);
        this.getClassroomBySchoolCode(this.currentLiveSchoolCode);
    }

    private currentLiveSelClassroomName:any;
    private currentLiveSelSchoolName:any;
    private currentLiveSelClassroomCode:any;
    private currentLiveSelSchoolCode:any;
    //将选择的教室填入span
    selectLiveClassRoom(){
        this.currentLiveSelSchoolCode=$("#liveSchoolSelect option:selected").val();
        this.currentLiveSelSchoolName=$("#liveSchoolSelect option:selected").text();
        this.currentLiveSelClassroomCode=$("#liveClassroomSelect option:selected").val();
        this.currentLiveSelClassroomName=$("#liveClassroomSelect option:selected").text();
        if(this.currentLiveSelSchoolCode=='-999'){
            this.currentLiveSelClassroomName='';
        }
        let titleInfo=this.currentLiveSelSchoolCode+'@#'+this.currentLiveSelSchoolName+'@#'+this.currentLiveSelClassroomCode+'@#'+this.currentLiveSelClassroomName;
        $($('.classRoomSpanCon')[this.currentSelectLiveIndex]).attr('title',titleInfo);
        $($('.classRoomSpanCon')[this.currentSelectLiveIndex]).html(this.currentLiveSelSchoolName+this.currentLiveSelClassroomName);
        $('.guanbiClassroomSelect').click();
    }

    private currentLiveProvince:any;
    //通过学校code获取省信息
    getLiveProvincesBySchoolCode(code:any){
        var _that=this;
        _that.liveSchoolList=[];
        if(code==null || code=='-999'){
            $('#liveProvinceSelect').unbind();
            $("#liveProvinceSelect").select2({
                placeholder: '请选择省区'
            });
            $('#liveProvinceSelect').val('').change();
            $('#liveProvinceSelect').on('change', function (evt:any) {
                _that.getSchoolByProvinces(this.value);
            });
        }else{
            this.commisonerService.getProvincesBySchoolCode(code)
            .subscribe( data =>{
                if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                    this.router.navigateByUrl('login');
                    return;
                }
                console.log("通过学校code查省");
                console.log(data);
                this.currentLiveProvince=data.result.name;
                $('#liveProvinceSelect').unbind();
                $("#liveProvinceSelect").select2({
                    placeholder: '请选择省区'
                });
                $('#liveProvinceSelect').val(this.currentLiveProvince).change();
                $('#liveProvinceSelect').on('change', function (evt:any) {
                    _that.getSchoolByProvinces(this.value);
                });
                this.getSchoolByProvinces(this.currentLiveProvince);
            });
        }
    }

    public liveSchoolList:any;
    //通过省份查学校
    getSchoolByProvinces(pro:any){
        console.log(pro);
        this.liveSchoolList=[];
        let _that=this;
        this.commisonerService.getSchoolByProvinces(pro)
        .subscribe( data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("通过省份查询学校");
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            this.liveSchoolList=resData.result;
            let obj={
                schoolCode:'-999',
                schoolName:'待定'
            };
            this.liveSchoolList.splice(0, 0, obj);
            setTimeout(()=>{
                $("#liveSchoolSelect").unbind();
                $("#liveSchoolSelect").select2({
                    placeholder: '请选择主讲学校'
                });
                $('#liveSchoolSelect').val(this.currentLiveSchoolCode).change();
                $('#liveSchoolSelect').on('change', function (evt:any) {
                    _that.getClassroomBySchoolCode(this.value);
                });
            },300);
        });
    }

    public liveClassroomList:any;
    //通过学校查教室
    getClassroomBySchoolCode(id:any){
        console.log(id);
        this.liveClassroomList=[];
        var _that=this;
        if(id=='-999'){
            let obj1={
                schoolCode:'-999',
                schoolName:'待定'
            };
            let obj2={
                classroomCode:'-888',
                classroomName:'待定',
                devName:''
            };
            if(_that.liveSchoolList.length==0 || _that.liveSchoolList[0].schoolCode!='-999'){
                _that.liveSchoolList.splice(0, 0, obj1);
            }
            _that.liveClassroomList=[];
            _that.liveClassroomList.splice(0, 0, obj2);
            setTimeout(()=>{
                $('#liveClassroomSelect').unbind();
                $("#liveClassroomSelect").select2({
                    placeholder: '请选择主讲教室',
                    minimumResultsForSearch: Infinity
                });
                $("#liveSchoolSelect").unbind();
                $("#liveSchoolSelect").select2({
                    placeholder: '请选择主讲学校'
                });
                $('#liveSchoolSelect').on('change', function (evt:any) {
                    _that.getClassroomBySchoolCode(this.value);
                });
                $('#liveClassroomSelect').val('-888').change();
            },300);
        }else if(id==null){
            setTimeout(()=>{
                $('#liveClassroomSelect').unbind();
                $("#liveClassroomSelect").select2({
                    placeholder: '请选择主讲教室',
                    minimumResultsForSearch: Infinity
                });
                $("#liveSchoolSelect").unbind();
                $("#liveSchoolSelect").select2({
                    placeholder: '请选择主讲学校'
                });
                $('#liveSchoolSelect').on('change', function (evt:any) {
                    _that.getClassroomBySchoolCode(this.value);
                });
                $('#liveClassroomSelect').val('').change();
            },300);
        }else{
            this.commisonerService.getClassroomBySchoolCode(id)
            .subscribe( data =>{
                if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                    this.router.navigateByUrl('login');
                    return;
                }
                console.log("通过学校查询教室");
                console.log(data);
                this.liveClassroomList=data.result;
                let obj={
                    classroomCode:'-888',
                    classroomName:'待定',
                    devName:''
                };
                this.liveClassroomList.splice(0, 0, obj);
                setTimeout(()=>{
                    $('#liveClassroomSelect').unbind();
                    $("#liveClassroomSelect").select2({
                        placeholder: '请选择主讲教室',
                        minimumResultsForSearch: Infinity
                    });
                    $("#liveSchoolSelect").unbind();
                    $("#liveSchoolSelect").select2({
                        placeholder: '请选择主讲学校'
                    });
                    $('#liveSchoolSelect').on('change', function (evt:any) {
                        _that.getClassroomBySchoolCode(this.value);
                    });
                    $('#liveClassroomSelect').val(this.currentLiveClassroomCode).change();
                    $("#liveClassroomSelect").on('change', function (evt:any){
                        if($(this).val()=="" || $(this).val()=='-888'){

                        }else{
                            _that.roomConflictConfirm($(this).val(),$(this),$("#liveSchoolSelect option:selected").val());
                            console.log($(this).val(),$(this));
                        }
                    });
                },300);
            });
        }
    }

    private conflictsT:any;
    private conflicteT:any;
    private conflicteID:any;
    //校验选择的教室和已经选的有没有冲突
    roomConflictConfirm(classCode:any,domE:any,schoolCode:any){
        let timeSE=$($('.timeSpanCon')[this.currentSelectLiveIndex]).html();
        if(timeSE=='-' || timeSE==""){
            return;
        }
        let ST=timeSE.split(' ')[0]+ ' ' +timeSE.split(' ')[1].split('-')[0];
        let ET=timeSE.split(' ')[0]+ ' ' +timeSE.split(' ')[1].split('-')[1];
        this.conflictsT=new Date(ST).getTime();
        this.conflicteT=new Date(ET).getTime();
        this.conflicteID=this.currentLiveId;
        this.commisonerService.roomConflictConfirm(this.conflicteID,this.conflictsT,this.conflicteT,classCode,schoolCode)
        .subscribe(data =>{
            console.log("校验主讲教室是否冲突");
            console.log(eval('('+data['_body']+')'));
            let resData=eval('('+data['_body']+')');
            if(resData.successful){
                if(resData.result=='' || resData.result==null || resData.result==undefined || resData.errorCode==11){
                }else{
                    let errorMsg="选择的教室在当前时间段已被占用，请重新选择！"+resData.result;
                    domE.val("").change();
                    $("#alertTip").html(errorMsg);
                    $('#alertWrap').modal('show');
                }
            }else{
                console.log("校验失败！");
            }
        });
    }


    //开始需求变更
    beginRequirementchange(sta:any){
        this.com_isshowBiangengBtn=false;
        this.com_isshowBiangengIng=true;
        this.canEditor=true;
        this.com_BiangengBaocun=true;
        setTimeout(()=>{
            this.switchAllKaigun();
            this.initLiveTimePlugins();
        },200);
    }

    public com_cUisRun=false;
    //判断是否处于运行期
    isRunningTimeForRecruit(id:any){
        this.com_cUisRun=false;
        this.commisonerService.isRunningTimeForRecruit(id)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('判断是否处于运行期');
            console.log(eval('('+data['_body']+')'));
            let resData=eval('('+data['_body']+')');
            if(resData.successful){
                if(resData.result){
                    this.com_cUisRun=false;
                }else{
                    this.com_cUisRun=true;
                }
            }else{
                $("#alertTip").html(resData.errorMsg);
                $('#alertWrap').modal('show');
            }
        });
    }

    //预排课完成
    previewPaikeCompleted(sta:any){
        if(this.currentLiveList.find((live:any) => live.isAvailable =='1')==undefined){
            $("#alertTip").html("该课程下面没有有效的见面课!");
            $('#alertWrap').modal('show');
            return;
        }
        this.commisonerService.previewPaikeCompleted(this.currentCourseID)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('排课完成');
            console.log(data);
            if(data.successful){
                this.commisonerService.synchronizeLiveModel(this.cUadmissionId,this.currentCourseID)
                .subscribe(data =>{
                    console.log('排课完成后同步');
                    console.log(data);
                    let tongbuResData=eval('('+data['_body']+')');
                    if(tongbuResData.successful){
                        this.getAllocationCourse(-1);
                    }
                });
            }
        });
    }

    private releaseNeedId:any;
    private fabuClick=true;
    //需求变更后发布单个课程
    releaseCourse(){
        var _that=this;
        if(this.fabuClick){
            this.fabuClick=false;
            this.releaseNeedId=this.currentCourse.requirementChanges[0].id;
            this.commisonerService.releaseCourse(this.currentCourseID)
            .subscribe(data =>{
                if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                    this.router.navigateByUrl('login');
                    return;
                }
                console.log("进行中 需求变更后发布单个见面课");
                let fabuRes=eval('('+data['_body']+')');
                if(fabuRes.successful){
                    $("#alertSuccessTip").html('发布成功!');
                    $('#alertSuccessWrap').modal('show');
                    this.commisonerService.requirementChangeFinished(this.releaseNeedId)
                    .subscribe(data =>{
                        console.log("需求变更发布后 终结流程");
                        this.getAllocationCourse(1);
                    });
                    setTimeout(()=> {
                        $('#alertSuccessWrap').modal('hide');
                        _that.fabuClick=true;
                    }, 1000);
                }else{
                    console.log(fabuRes);
                    $("#alertTip").html(fabuRes.errorMsg);
                    $('#alertWrap').modal('show');
                }
            });
        }else{
            $("#alertTip").html("操作过快!");
            $('#alertWrap').modal('show');
        }
    }

    //同步
    synchronizeLiveModel(){
        this.commisonerService.synchronizeLiveModel(this.cUadmissionId,this.currentCourseID)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('同步课程');
            console.log(data);
            let tongbuResData=eval('('+data['_body']+')');
            if(tongbuResData.successful){
                $("#alertSuccessTip").html('同步成功!');
                $('#alertSuccessWrap').modal('show');
                setTimeout(()=> {
                    $('#alertSuccessWrap').modal('hide');
                }, 1000);
                this.getAllocationCourse(1);
            }else{
                $("#alertTip").html("同步失败!");
                $('#alertWrap').modal('show');
            }
        });
    }

    private dateYanzhengWeek=-1;
    private timeYanzhengHour="abc";
    private isXiangdeng:any[]=[];
    //检验、组装修改信息要提交的json
    createInfoJson(){
        this.dateYanzhengWeek=-1;
        this.timeYanzhengHour='abc';
        this.isXiangdeng=[];
        for(var i=0;i<this.liveKaiguanList.length;i++){
            if(this.liveKaiguanList[i]==1){
                //验证是否为周的固定天
                if(this.dateYanzhengWeek!=-1){
                    let timeDate=$($('.timeSpanCon')[i]).html().split(' ')[0];
                    if(this.dateYanzhengWeek!=new Date(timeDate).getDay()){
                        $("#alertTip").html("存在见面课时间不在统一的时间段！请修改后再保存！");
                        $('#alertWrap').modal('show');
                        this.canUpdate=false;
                        return;
                    }
                }else{
                    let timeDate=$($('.timeSpanCon')[i]).html().split(' ')[0];
                    this.dateYanzhengWeek=new Date(timeDate).getDay();
                }
                //验证时间是否相等
                if(this.timeYanzhengHour!='abc'){
                    let timeHour=$($('.timeSpanCon')[i]).html().split(' ')[1];
                    if(this.timeYanzhengHour!=timeHour){
                        $("#alertTip").html("存在见面课时间不在统一的时间段！请修改后再保存！");
                        $('#alertWrap').modal('show');
                        this.canUpdate=false;
                        return;
                    }
                }else{
                    let timeHour1=$($('.timeSpanCon')[i]).html().split(' ')[1];
                    this.timeYanzhengHour=timeHour1;
                }
            }
        }
        for(var k=0;k<this.liveKaiguanList.length;k++){
            if(this.liveKaiguanList[k]==1){
                let timeSpan=$($('.timeSpanCon')[k]).html();
                this.isXiangdeng.push(timeSpan);
            }
        }
        //验证见面课是否存在时间冲突
        for(var h=0;h<this.isXiangdeng.length;h++){
            for(var m=h+1;m<this.isXiangdeng.length;m++){
                if(this.isXiangdeng[h]==this.isXiangdeng[m]){
                    $("#alertTip").html("见面课时间冲突，相同时间不能进行两次见面课，请修改后再保存！");
                    $('#alertWrap').modal('show');
                    this.canUpdate=false;
                    return;
                }
            }
        }
        for(var j=0;j<this.liveListForUpdate.length;j++){
            this.liveListForUpdate[j].schoolCode=$($('.classRoomSpanCon')[j]).attr('title').split('@#')[0];
            this.liveListForUpdate[j].schoolName=$($('.classRoomSpanCon')[j]).attr('title').split('@#')[1];
            this.liveListForUpdate[j].classroomCode=$($('.classRoomSpanCon')[j]).attr('title').split('@#')[2];
            this.liveListForUpdate[j].classroomName=$($('.classRoomSpanCon')[j]).attr('title').split('@#')[3];
            this.liveListForUpdate[j].isAvailable=this.liveKaiguanList[j];
            if($($('.timeSpanCon')[j]).html()!='-' && $($('.timeSpanCon')[j]).html()!=''){
                let time1=$($('.timeSpanCon')[j]).html().split(' ')[0];
                let time2=time1.split('/');
                let lastSpanDate=time2[0]+'-'+time2[1]+'-'+time2[2];
                let time3=$($('.timeSpanCon')[j]).html().split(' ')[1];
                let time4=time3.split('-')[0];
                let time5=time3.split('-')[1];
                this.liveListForUpdate[j].startTimeStr=lastSpanDate+ ' ' +time4;
                this.liveListForUpdate[j].endTimeStr=lastSpanDate+ ' ' +time5;
            }else{
                this.liveListForUpdate[j].startTimeStr='';
                this.liveListForUpdate[j].endTimeStr='';
            }
        }
        this.canUpdate=true;
    }

    private canUpdate=false;
    //修改见面课信息（多个）
    updateLiveInfo(){
        var _that=this;
        _that.createInfoJson();
       if(!this.canUpdate){
           return;
       }
       let updateType='0';
       if(this.com_isshowBiangengIng){
           updateType='1';
       }
        let liveInfoJson=JSON.stringify(this.liveListForUpdate);
        _that.commisonerService.updateLiveInfo(liveInfoJson,updateType)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('修改见面课信息');
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            if(resData.successful){
                $("#alertSuccessTip").html('保存成功!');
                $('#alertSuccessWrap').modal('show');
                setTimeout(()=> {
                    $('#alertSuccessWrap').modal('hide');
                }, 1000);
                this.getAllocationCourse(1);
            }else{
                $("#alertTip").html(resData.errorMsg);
                $('#alertWrap').modal('show');
            }
        });
    }

    //以下是排课教室筛选内容
    //以下是排课教室筛选内容
    //以下是排课教室筛选内容

    //初始化列表
    getArrangementDetail(){
        this.createPaikeJson();
        let _obj = this;
        this.getMonthFn(function(tempMonthArr:any){
            console.log('月份列表');
            console.log(tempMonthArr);
            for(let time in tempMonthArr){
                _obj.ArrangementDetailService(tempMonthArr[time],'','');
            }
            setTimeout(()=>{
                let minH=_obj.liveListForPaike.length*120+120+"px";
                $(".arrangeContent")[0].style.minHeight=minH;
            },300);
        });
    }

    public com_monthArray:any[]=[];
    public monthArrToShow:any[]=[];
    // //获取学期月份
    getMonthFn(callback:any){
        this.com_monthArray=[];
        this.commisonerService.getMonthfn(this.showScheduleId)
        .subscribe(rel => {
            if(rel['url']=='http://previewpk.livecourse.com/index.html' || rel['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('当前学期月份');
            let resData=eval('('+rel['_body']+')');
            console.log(resData);
            let startMonth= new Date(parseInt(resData.result.startTime)).getMonth()+1;
            let endMonth= new Date(parseInt(resData.result.endTime)).getMonth()+1;
            let length= endMonth-startMonth+1;
            let str='';
            for(let i=0;i<length;i++){
                if(startMonth+i<10){
                    str= '2017-0'+ (startMonth+i);
                }else{
                    str= '2017-'+ (startMonth+i);
                }
                this.monthArrToShow.push(str);
                this.com_monthArray.push(str);
            }
            callback(this.com_monthArray);
        });
    }

    public com_ArrangementDetailArr:any[]=[];
    // //根据月份查询列表,赋值 ，展示数据按月份排序
    ArrangementDetailService(date:any,lab:any,selInput:any){
        let code =$('.pkroomSe').val();
        this.commisonerService.findArrangementDetail(this.showScheduleId,date,code).subscribe(rel => {
            if(rel['url']=='http://previewpk.livecourse.com/index.html' || rel['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('排课信息统计查询');
            let resurlData=eval('('+rel['_body']+')');
            console.log(resurlData);
            let num= date.slice(5,6);
            let value=0;                //value 为获取的月份
            if(num=='0'){
                value= parseInt(date.slice(6,7));
            }else{
                value= parseInt(date.slice(5,7));
            }

            if(this.com_ArrangementDetailArr.length>0){
                let i=0;
                for(let item in this.com_ArrangementDetailArr){
                    i++;
                    if(value < parseInt(this.com_ArrangementDetailArr[item].month)){
                        this.com_ArrangementDetailArr.splice(i-1, 0, resurlData.result);
                        this.setMonthInfo(i-1,value);
                        break;
                    }else{
                        if(i==this.com_ArrangementDetailArr.length){
                            this.com_ArrangementDetailArr.push(resurlData.result);
                            this.setMonthInfo(this.com_ArrangementDetailArr.length-1,value);
                        }
                    }
                }
            }else{
                this.com_ArrangementDetailArr.push(resurlData.result);
                this.setMonthInfo(this.com_ArrangementDetailArr.length-1,value);
            }
            setTimeout(()=>{
                if(lab!=''){
                    $(selInput).show(0);
                    $(lab).css({background:'url(../../../imgs/xuanzhong.png) no-repeat'});
                    $(lab).bind('click',function(){
                        $(selInput).click();
                    });
                }
            },200);
        });
    }

    private weekArray= ['','日','一','二','三','四','五','六'];
    // //对传入月份赋值(星期)
    setMonthInfo(item:any,val:any){
        let allRoom=0;
        for(let detail in this.com_ArrangementDetailArr[item]){
            if(typeof this.com_ArrangementDetailArr[item][detail]!="number"){
                allRoom+=this.com_ArrangementDetailArr[item][detail].totalLiveQuantity;
            }
        }
        this.com_ArrangementDetailArr[item].allroom= allRoom;
        this.com_ArrangementDetailArr[item].month= val;
    }

    //选择月份改变列表
    monthCheck(index:any,value:any,check:any,labelVal:any,selectInput:any){
        if(check){
            $('.infoWrapper').hide();
            $(selectInput).hide(0);
            $(labelVal).unbind('click');
            $(labelVal).css({background:'url(../../../imgs/samllLoading.gif) no-repeat'});
            let _obj=this;
            if(parseInt(value)<10){
                let mon= '2017-0'+value;
                this.ArrangementDetailService(mon,labelVal,selectInput);
            }else{
                let mon= '2017-'+value;
                this.ArrangementDetailService(mon,labelVal,selectInput);
            }
            // for(let i in this.com_monthArray){
            //     let number = this.monthToNumber(this.com_monthArray[i]);
            //     if(number==value){
            //         for(let j in this.tempMonthArr){
            //             if(number<this.monthToNumber(this.tempMonthArr[j])){
            //                 this.tempMonthArr.splice(parseInt(j), 0, this.com_monthArray[i]);
            //                 setTimeout(()=>{_obj.setMonthInfo(parseInt(j),parseInt(value));},300);
            //                 break;
            //             }else{
            //                 if(parseInt(j)==this.tempMonthArr.length-1){
            //                     this.tempMonthArr.push(this.com_monthArray[i]);
            //                     setTimeout(()=>{_obj.setMonthInfo(_obj.com_ArrangementDetailArr.length-1,parseInt(value));},300);
            //                 }
            //             }
            //         }
            //     }
            // }
        }else{
            $('.infoWrapper').hide();
            $(labelVal).unbind('click');
            $(selectInput).hide(0);
            // console.log(this.modeMonth);
            $(labelVal).css({background:'url(../../../imgs/wei.png) no-repeat'});
            for(let item in this.com_ArrangementDetailArr){
                if(this.com_ArrangementDetailArr[item].month==value){
                    this.com_ArrangementDetailArr.splice(parseInt(item),1);
                }
            }
            for(let temp in this.com_monthArray){
                let tempNum= this.monthToNumber(this.com_monthArray[temp]);
                if(tempNum==value){
                    this.com_monthArray.splice(parseInt(temp),1);
                }
            }
            setTimeout(()=>{
                $(labelVal).bind('click',function(){
                    $(selectInput).click();
                });
            },200);
        }
    }

    //月份和数字的转化
    monthToNumber(monthStr:any){
        let num= monthStr.slice(5,6);
        let tempNum=0;
        if(num=='0'){
            tempNum= parseInt(monthStr.slice(6,7));
        }else{
            tempNum= parseInt(monthStr.slice(5,7));
        }
        return tempNum;
    }

    public com_pkSchoolList:any;
    //查询省份列表
    searchprovinces(value:any){
        let _that=this;
        this.com_pkSchoolList=[];
        this.commisonerService.getSchoolByProvinces(value)
        .subscribe( data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            this.com_pkSchoolList=resData.result;
            let obj={
                schoolCode:'-999',
                schoolName:'待定'
            };
            this.com_pkSchoolList.splice(0, 0, obj);
        });
    }

    public com_pkRoomList:any;
    //通过学校查询教室
    searchschools(value:any){
        let _that=this;
        this.com_pkRoomList=[];
        this.commisonerService.getClassroomBySchoolCode(value)
        .subscribe( data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            this.com_pkRoomList=data.result;
            let obj={
                classroomCode:'-888',
                classroomName:'待定',
                devName:''
            };
            this.com_pkRoomList.splice(0, 0, obj);
        });
    }

    //根据教室code搜索
    pkEnter(pk1:any,pk2:any,pk3:any){
        console.log(pk1,pk2,pk3);
        for(let time in this.com_monthArray){
            this.commisonerService.findArrangementDetail(this.showScheduleId,this.com_monthArray[time],pk3).subscribe(rel => {
                if(rel['url']=='http://previewpk.livecourse.com/index.html' || rel['url']=='http://pk.livecourse.com/index.html'){
                    this.router.navigateByUrl('login');
                    return;
                }
                console.log('教室状态查询');
                let resurlData=eval('('+rel['_body']+')');
                console.log(resurlData);
                let tempNum = this.monthToNumber(this.com_monthArray[time]);
                this.com_ArrangementDetailArr[time]= resurlData.result;
                this.setMonthInfo(time,tempNum);
            });
        }
    }

    public chooseWeek:any="";

    private timeRoom=['08:00:00','10:30:00','10:30:00','12:30:00','12:30:00','15:30:00','15:30:00','17:30:00','17:30:00','23:00:00'];
    private timeRoomSel=['08:30','10:00','10:30','12:00','13:30','15:00','15:30','17:00','18:30','20:00'];
    public com_classListArray:any=[];
    private modeMonth="";
    private time1:any;
    private time2:any;
    public com_roomSelFlag=-1;
    checkTimer(count:any,flag:any,month:any,day:any,room:any,week:any){
        if(this.com_paiKeLiveId=='-1'){
            let starTime='';
            let endTime='';
            let ScheduleId:any;
            let wrapper:any;
            ScheduleId=this.showScheduleId;
            wrapper= $('.cUinfoWrapper');
            this.modeMonth= month;
            if(flag==1){
                this.time1=this.timeRoom[0];
                this.time2=this.timeRoom[1];
            }else if(flag==2){
                this.time1=this.timeRoom[2];
                this.time2=this.timeRoom[3];
            }else if(flag==3){
                this.time1=this.timeRoom[4];
                this.time2=this.timeRoom[5];
            }else if(flag==4){
                this.time1=this.timeRoom[6];
                this.time2=this.timeRoom[7];
            }else{
                this.time1=this.timeRoom[8];
                this.time2=this.timeRoom[9];
            }

            if(parseInt(month)<10){
                if(parseInt(day)<10){
                    starTime= '2017-0'+month+'-0'+day+' '+this.time1;
                    endTime= '2017-0'+month+'-0'+day+' '+this.time2;
                }else{
                    starTime= '2017-0'+month+'-'+day+' '+this.time1;
                    endTime= '2017-0'+month+'-'+day+' '+this.time2;
                }
            }else{
                if(parseInt(day)<10){
                    starTime= '2017-'+month+'-0'+day+' '+this.time1;
                    endTime= '2017-'+month+'-0'+day+' '+this.time2;
                }else{
                    starTime= '2017-'+month+'-'+day+' '+this.time1;
                    endTime= '2017-'+month+'-'+day+' '+this.time2;
                }
            }
            console.log('starTime:'+starTime+'endTime:'+endTime);
            this.commisonerService.getTimeRoomfn(ScheduleId,starTime,endTime)
            .subscribe( data =>{
                if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                    this.router.navigateByUrl('login');
                    return;
                }
                let resData=eval('('+data['_body']+')');
                console.log(resData);
                this.com_classListArray = resData.result;
                if(this.com_classListArray.length>0){
                    for(let i in this.com_classListArray){
                        if(this.com_classListArray[i].classroomCode!=""&&this.com_classListArray[i].classroomCode==$('.pkroomSe').val()){
                            this.com_classListArray[i].class="lighter";
                        }else{
                            this.com_classListArray[i].class=null;
                        }
                        if(this.com_classListArray[i].schoolCode!='-999'){
                            if(this.com_classListArray[i].classroomCode=='-888'){
                                this.com_classListArray[i].classroomName="教室待定";
                            }
                        }else{
                            if(this.com_classListArray[i].classroomCode=='-888'){
                                this.com_classListArray[i].classroomName="";
                            }
                        }
                    }
                }
            });
            wrapper.hide();
            if(count>0){
                wrapper.show();
            }
            if($(room).position().left<=515){
                if($(room).position().top<=1722){
                    wrapper.css({marginLeft:"45px",marginTop:"-135px"});
                }else{
                    wrapper.css({marginLeft:"45px",marginTop:"-267px"});
                }
                wrapper.find(".icon").css({width:"0",height:"0",borderTop:"8px solid transparent",borderRight:"9px solid #333",borderLeft:"none",borderBottom:"8px solid transparent",position:"absolute",marginLeft:"-9px",marginTop:"145px"});
            }else{
                if($(room).position().top<=1722){
                    wrapper.css({marginLeft:"-495px",marginTop:"-135px"});
                }else{
                    wrapper.css({marginLeft:"-495px",marginTop:"-267px"});
                }
                wrapper.find(".icon").css({width:"0",height:"0",borderTop:"8px solid transparent",borderLeft:"9px solid #333",borderRight:"none",borderBottom:"8px solid transparent",position:"absolute",marginLeft:"480px",marginTop:"145px"});
            }
            wrapper.css({top:$(room).position().top,left:$(room).position().left});
            wrapper.click(function(){
                $(this).hide();
            });
        }else{
            let childrenSpam=$(room).children();
            if($('.paikeLiveInfoImgShow').length>=1 && childrenSpam.hasClass('canSelRoom')==false &&　this.com_paiKeLiveId!=$('.spanImgShow').parent().attr('id')){
                $("#alertTip").html('见面课时间要保持在统一时间段（蓝色方块为可选区），请重新选择！');
                $('#alertWrap').modal('show');
                return;
            }else{
                this.chooseWeek= week;
                if($("#" + this.com_paiKeLiveId).length>0){
                    $("#" + this.com_paiKeLiveId).children().removeClass('spanImgShow');
                    $($('.paikeLive')[this.com_paiKeLiveFlag]).removeClass('paikeLiveInfoImgShow');
                    if(this.liveListForPaike[this.com_paiKeLiveFlag].schoolName!="" || this.liveListForPaike[this.com_paiKeLiveFlag].schoolCode!="" || this.liveListForPaike[this.com_paiKeLiveFlag].classroomName!="" || this.liveListForPaike[this.com_paiKeLiveFlag].classroomCode!="" || this.liveListForPaike[this.com_paiKeLiveFlag].livetime!=""){

                    }else{
                        this.liveListForPaike[this.com_paiKeLiveFlag].info=false;
                    }
                }
                let selId=$(room).attr('id');
                $("#" + this.com_paiKeLiveId).attr('id','');
                // debugger;
                if(selId!=(this.com_paiKeLiveId.toString())){
                    if(selId!=undefined && selId!=''){
                        $("#alertTip").html('当前时间段已被占用，请重新选择！');
                        $('#alertWrap').modal('show');
                        return;
                    }
                    $(room).attr('id',this.com_paiKeLiveId);
                    $(room).children().addClass('spanImgShow');
                    this.com_roomSelFlag=flag;
                    $($('.paikeLive')[this.com_paiKeLiveFlag]).addClass('paikeLiveInfoImgShow');
                    this.liveListForPaike[this.com_paiKeLiveFlag].info=true;

                    let starTime='';
                    let timeSE="";
                    let timeSHover="";
                    let timeEHover="";
                    let timeMonth= month;
                    if(flag==1){
                        timeSHover=this.timeRoomSel[0];
                        timeEHover=this.timeRoomSel[1];
                    }else if(flag==2){
                        timeSHover=this.timeRoomSel[2];
                        timeEHover=this.timeRoomSel[3];
                    }else if(flag==3){
                        timeSHover=this.timeRoomSel[4];
                        timeEHover=this.timeRoomSel[5];
                    }else if(flag==4){
                        timeSHover=this.timeRoomSel[6];
                        timeEHover=this.timeRoomSel[7];
                    }else{
                        timeSHover=this.timeRoomSel[8];
                        timeEHover=this.timeRoomSel[9];
                    }

                    if(parseInt(month)<10){
                        if(parseInt(day)<10){
                            starTime= '2017/0'+month+'/0'+day+' '+timeSHover;
                        }else{
                            starTime= '2017/0'+month+'/'+day+' '+timeSHover;
                        }
                    }else{
                        if(parseInt(day)<10){
                            starTime= '2017/'+month+'/0'+day+' '+timeSHover;
                        }else{
                            starTime= '2017/'+month+'/'+day+' '+timeSHover;
                        }
                    }
                    this.liveListForPaike[this.com_paiKeLiveFlag].livetime=starTime+ "-" +timeEHover;
                    let sC='';
                    let sN='';
                    let cC='';
                    let cN='';
                    if($('.pkschoolSe').val()==""){
                        //学校为空 默认其余都为空
                    }else{
                        sC=$('.pkschoolSe').val();
                        sN=$('.pkschoolSe option:selected').text();
                        if($('.pkroomSe').val()==""){
                            //教室为空
                        }else{
                            cC=$('.pkroomSe').val();
                            cN=$('.pkroomSe option:selected').text();
                        }
                        this.liveListForPaike[this.com_paiKeLiveFlag].schoolName=sN;
                        this.liveListForPaike[this.com_paiKeLiveFlag].schoolCode=sC;
                        this.liveListForPaike[this.com_paiKeLiveFlag].classroomName=cN;
                        this.liveListForPaike[this.com_paiKeLiveFlag].classroomCode=cC;
                    }
                }else{
                    if($('.paikeLiveInfoImgShow').length>0){

                    }else{
                        this.chooseWeek='';
                    }
                }
            }
        }
    }
    //排课筛选教室过程中解锁
    paikeKaiLock(flag:any){
        $($('.paikeLive')[flag]).removeClass(".paikeLiveShowLock");
        $($('.liveKaiguan')[flag]).click();
    }

    //组装排课json为了排课弹框 把教室和时间信息带进去
    createPaikeJson(){
        for(var k=0;k<this.liveKaiguanList.length;k++){
            if(this.liveKaiguanList[k]==1){
                this.liveListForPaike[k].schoolCode=$($('.classRoomSpanCon')[k]).attr('title').split('@#')[0];
                this.liveListForPaike[k].schoolName=$($('.classRoomSpanCon')[k]).attr('title').split('@#')[1];
                this.liveListForPaike[k].classroomCode=$($('.classRoomSpanCon')[k]).attr('title').split('@#')[2];
                this.liveListForPaike[k].classroomName=$($('.classRoomSpanCon')[k]).attr('title').split('@#')[3];
                if($($('.timeSpanCon')[k]).html()!='-'){
                    let time1=$($('.timeSpanCon')[k]).html().split(' ')[0];
                    let time2=time1.split('/');
                    let lastSpanDate=time2[0]+'-'+time2[1]+'-'+time2[2];
                    let time3=$($('.timeSpanCon')[k]).html().split(' ')[1];
                    let time4=time3.split('-')[0];
                    let time5=time3.split('-')[1];
                    this.liveListForPaike[k].livetime=$($('.timeSpanCon')[k]).html();
                }else{
                    this.liveListForPaike[k].livetime='';
                }
            }else{
                this.liveListForPaike[k].schoolCode='';
                this.liveListForPaike[k].schoolName='';
                this.liveListForPaike[k].classroomCode='';
                this.liveListForPaike[k].classroomName='';
                this.liveListForPaike[k].livetime='';
            }
        }
        for(var m=0;m<this.liveListForPaike.length;m++){
            for (var key in this.liveListForPaike[m]){
                if(this.liveListForPaike[m][key]!=null && this.liveListForPaike[m][key]!='' && key!='id' && key!='liveName'){
                    this.liveListForPaike[m].info=true;
                    break;
                }else{
                    this.liveListForPaike[m].info=false;
                }
            }
        }
    }

    public com_paiKeLiveId='-1';
    public com_paiKeLiveFlag=-1;
    //选中要排课的live,并且如果有时间，选中所在时间段
    selectPaikeLive(id:any,sort:any){
        if(this.com_paiKeLiveId==id){
            this.com_paiKeLiveId='-1';
            this.com_paiKeLiveFlag=-1;
        }else{
            this.com_paiKeLiveId=id;
            this.com_paiKeLiveFlag=sort;
            if(this.liveListForPaike[sort].livetime!=""){
                let time0=this.liveListForPaike[sort].livetime;
                let time1=time0.split(' ')[0];
                let time2=time0.split(' ')[1];
                let timeW=new Date(time1).getDay()+1;
                let timeM=parseInt(time1.split('/')[1]);
                let timeD=parseInt(time1.split('/')[2])-1;
                let timeH=parseInt(time2.split(":")[0]);
                let timem=parseInt(time2.split(":")[1].split("-")[0]);
                let roomFlag=0;
                if($('#m'+timeM)){
                    if(timeH<10){
                        roomFlag=0;
                    }else if(timeH>=10 && timeH<12){
                        roomFlag=1;
                    }else if(timeH>=12 && timeH<15){
                        roomFlag=2;
                    }else if(timeH>=15 && timeH<17){
                        roomFlag=3;
                    }else{
                        roomFlag=4;
                    }
                    if(this.chooseWeek!=""){
                        if(this.chooseWeek!=timeW){
                            $("#alertTip").html("当前见面课与其余见面课不在统一时间段！");
                            $('#alertWrap').modal('show');
                            let roomList=$($('#m'+timeM+ " li")[timeD]).children();
                            $(roomList[roomFlag+2]).attr('id',this.com_paiKeLiveId);
                            $($('.paikeLive')[this.com_paiKeLiveFlag]).addClass('paikeLiveInfoImgShow');
                            let room= $(roomList[roomFlag+2]).children()[0];
                            $(room).addClass("spanImgShow");
                        }else{
                            if(this.com_roomSelFlag!=roomFlag+1){
                                $("#alertTip").html("当前见面课与其余见面课不在统一时间段！");
                                $('#alertWrap').modal('show');
                                this.chooseWeek=timeW;
                                let roomList=$($('#m'+timeM+ " li")[timeD]).children();
                                $(roomList[roomFlag+2]).attr('id',this.com_paiKeLiveId);
                                $($('.paikeLive')[this.com_paiKeLiveFlag]).addClass('paikeLiveInfoImgShow');
                                let room= $(roomList[roomFlag+2]).children()[0];
                                $(room).addClass("spanImgShow");
                            }else{
                                this.chooseWeek=timeW;
                                this.com_roomSelFlag=roomFlag+1;
                                let roomList=$($('#m'+timeM+ " li")[timeD]).children();
                                $(roomList[roomFlag+2]).attr('id',this.com_paiKeLiveId);
                                $($('.paikeLive')[this.com_paiKeLiveFlag]).addClass('paikeLiveInfoImgShow');
                                let room= $(roomList[roomFlag+2]).children()[0];
                                $(room).addClass("spanImgShow");
                            }
                        }
                    }else{
                        this.chooseWeek=timeW;
                        this.com_roomSelFlag=roomFlag+1;
                        let roomList=$($('#m'+timeM+ " li")[timeD]).children();
                        $(roomList[roomFlag+2]).attr('id',this.com_paiKeLiveId);
                        $($('.paikeLive')[this.com_paiKeLiveFlag]).addClass('paikeLiveInfoImgShow');
                        let room= $(roomList[roomFlag+2]).children()[0];
                        $(room).addClass("spanImgShow");
                    }
                }
            }
        }
    }

    //排课弹框点击确定 数据填充到页面
    paikeTianchong(){
        console.log(this.liveListForPaike);
        for(var i=0;i<this.liveKaiguanList.length;i++){
            if(this.liveKaiguanList[i]==1){
                $($('.timeSpanCon')[i]).html(this.liveListForPaike[i].livetime);
                if(this.liveListForPaike[i].schoolName!="" || this.liveListForPaike[i].classroomName!=""){
                    $($('.classRoomSpanCon')[i]).html(this.liveListForPaike[i].schoolName + this.liveListForPaike[i].classroomName);
                    let titleInfo=this.liveListForPaike[i].schoolCode + "@#" + this.liveListForPaike[i].schoolName + "@#" + this.liveListForPaike[i].classroomCode + "@#" + this.liveListForPaike[i].classroomName;
                    $($('.classRoomSpanCon')[i]).attr('title',titleInfo);
                }
            }
        }
    }

    //关闭弹窗,清空各种状态
    pkcancel(){
        console.log("cancle");
        this.com_monthArray=[];
        this.monthArrToShow=[];
        this.com_pkSchoolList=[];
        this.com_pkRoomList=[];
        this.com_ArrangementDetailArr=[];
        this.chooseWeek="";
        this.com_paiKeLiveId="-1";
        $('.paikeLiveInfoImgShow').removeClass('paikeLiveInfoImgShow');

        $('.pkschoolSe').val("").change();
        $('.pkroomSe').val("").change();
        $('.cUPselect').val('').change();

        $('.cUinfoWrapper').hide();
        $('.nSinfoWrapper').hide();
    }

    getCookie(name:any) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');    //把cookie分割成组
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];                      //取得字符串
            while (c.charAt(0)==' ') {          //判断一下字符串有没有前导空格
            c = c.substring(1,c.length);      //有的话，从第二位开始取
            }
            if (c.indexOf(nameEQ) == 0) {       //如果含有我们要的name
            return unescape(c.substring(nameEQ.length,c.length));    //解码并截取我们要值
            }
        }
        return null;
    }

    ngOnInit(): void {
        var _that=this;
        if(_that.getCookie('role')=="2"){
            _that.getSchedule();
            $('#arrangementDetail').on('hidden.bs.modal', function (e: any) {
                _that.pkcancel();
            });
            setTimeout(()=>{
                $(document).keydown(function(event:any){
                    if (event.keyCode == 13) {
                        $('form').each(function() {
                            event.preventDefault();
                        });
                    }
                });
            },1000);
        }else{
            _that.router.navigateByUrl('login');
        }
    }

}
