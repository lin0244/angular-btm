import {  Component,OnInit, ViewChild} from '@angular/core';
import { DirectorService } from './director.service';
import {Router} from "@angular/router";

declare var $: any;
declare var moment: any;
declare var unescape:any;
export class dayLiveObj {
    amassignedquantity:number;
    amtimeperiods:any[]=[];
    assignedlivequantity:number;
    currentweek:number;
    endTimeOneDay:string;
    nightassignedquantity:number;
    nighttimeperiods:any[]=[];
    pmassignedquantity:number;
    pmtimeperiods:any[]=[];
    startTimeOneDay:string;
    todayassignedquantiy:number;
}
@Component({
  selector: 'app-director',
  templateUrl: './director.component.html',
  styleUrls: ['./director.component.css'],
  providers: [DirectorService]
})
export class DirectorComponent implements OnInit {

  constructor(private directorService: DirectorService,public router: Router) { }

    public dir_staColorArr=["#fff","#666","#FFAF04","#33CC66","#FF6666","#2570D3"];
    public dir_staArr=["未开始","待排","进行中","待发布","异常"];
    private allScheduleList:any;
    public dir_currents=false;
    public dir_notStarts=false;
    public dir_isHaveKebiao=false;
    private currentScheduleId:any;
    private notStartScheduleId:any;
    //获取所有课表
    getSchedule(){
        this.dir_currents=false;
        this.dir_notStarts=false;
        this.directorService.getSchedule()
        .subscribe(data => {
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("课表");
            console.log(data);
            let resschedule=eval('('+data['_body']+')');
            this.allScheduleList=resschedule.result;
            if(this.allScheduleList.length==0){
                this.dir_isHaveKebiao=false;
                return;
            }else{
                this.dir_isHaveKebiao=true;
            }
            if(this.allScheduleList.find((schedule:any) => schedule.status =='1')!=undefined){
                this.currentScheduleId=this.allScheduleList.find((schedule:any) => schedule.status =='1').id;
                this.dir_currents=true;
                this.initSchedule(this.currentScheduleId,'1');
            }
            if(this.allScheduleList.find((schedule:any) => schedule.status =='2')!=undefined){
                this.notStartScheduleId=this.allScheduleList.find((schedule:any) => schedule.status =='2').id;
                this.dir_notStarts=true;
                this.initSchedule(this.notStartScheduleId,'2');
            }
            // this.initupdateKebiaoTimePick();
        });
    }

    //初始化课表 （获取课表名 绑定切换默认当前进行中课表）
    initSchedule(id:any,sta:any){
        this.schedulecourseinfor(id,sta);
        if(sta=='1'){
            this.scheduleSwitch(sta);
        }
    }

    private cUscheduleName:any;
    private nSscheduleName:any;

     //课表课程基础信息(获取课表名)
    schedulecourseinfor(id:any,sta:any){
        this.directorService.schedulecourseinfor(id)
        .subscribe(data => {
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            let resData=data.result;
            if(sta=='1'){
                 console.log('进行中 课表基础信息');
                 console.log(data);
                 this.cUscheduleName=resData.scheduleName;
            }else{
                 console.log('未开始 课表基础信息');
                 console.log(data);
                 this.nSscheduleName=resData.scheduleName;
            }
        });
    }

    private showSchedule:any;
    private isCuKebiao=true;
    private dir_releasedlivequantity=0;
    private dir_syncTime:any;

    //课表切换event
    scheduleSwitch(flag:any){
        if(flag=='1'){
            this.isCuKebiao=true;
            $('.nSkebiaoBtn').removeClass('kebiaoactive');
            $('.cUkebiaoBtn').addClass('kebiaoactive');
            this.showSchedule=this.currentScheduleId;

            this.getWeek(flag);
            this.getCommissionerList();
            this.cutScheduleByWeek(this.showSchedule);
        }else{
            this.isCuKebiao=false;
            $('.nSkebiaoBtn').addClass('kebiaoactive');
            $('.cUkebiaoBtn').removeClass('kebiaoactive');
            this.showSchedule=this.notStartScheduleId;
        }
        this.isGetWeek=false;
        this.isSwitchedWeek=false;
        this.clickCurrentWeekNum=-1;
        if($('.col-xs-week8').length>0){
            for(var i=0;i<$('.col-xs-week8').length;i++){
                $($('.col-xs-week8')[i]).removeClass('week8-click week8-current');
            }
        }
        if(this.isCuKebiao){
        }
        this.paikecountInfo(this.showSchedule);
        this.getBasicInfo();
        this.getScheduleInfoFindByid();
        setTimeout(()=>{
            $('a[href="#unFenpeiTab"]').tab('show');
            this.getUnfenpeiMeetCourseList();
        },300);
    }

    //获取课表基础信息
    getBasicInfo(){
        this.directorService.schedulecourseinfor(this.showSchedule)
        .subscribe(data => {
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('课表基础信息');
            console.log(data);
            let resData=data.result;
            this.dir_releasedlivequantity=resData.releasedlivequantity;
            this.dir_syncTime=resData.lastestSyncTime;
        });
    }

    private currentWeek:any;
    private weekKeep:any;
    //获取周信息
    getWeek(sta:any){
        this.directorService.getWeek(this.showSchedule,"-1")
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获取周信息');
            let resData=eval('('+data['_body']+')');
            let resDataArr=resData.result.split(',');
            if(sta=='1'){
                this.currentWeek=parseInt(resDataArr[0]);
            }else{
                this.currentWeek=0;
            }
            this.getFankuiWeek(this.currentWeek);
            this.getWeekPersonInfo(this.showSchedule,this.currentWeek,'');
        });
    }

    private endLiveQuantity=0;
    private liveSureQuantity=0;
    private cuAllLiveNum=0;
    private currentzhsId='';
    private shijianDuanArr:any;
    private shijianDuan:any;
    private cUweek:number;
    public dir_cUweekKeep:number;
    private isGetWeek=false;
    private zhuanYuanInfo:any;
    private monZhuanYuan:dayLiveObj={
        amassignedquantity:0,
        amtimeperiods:[],
        assignedlivequantity:0,
        currentweek:0,
        endTimeOneDay:'',
        nightassignedquantity:0,
        nighttimeperiods:[],
        pmassignedquantity:0,
        pmtimeperiods:[],
        startTimeOneDay:'',
        todayassignedquantiy:0
    };
    private tueZhuanYuan:dayLiveObj={
        amassignedquantity:0,
        amtimeperiods:[],
        assignedlivequantity:0,
        currentweek:0,
        endTimeOneDay:'',
        nightassignedquantity:0,
        nighttimeperiods:[],
        pmassignedquantity:0,
        pmtimeperiods:[],
        startTimeOneDay:'',
        todayassignedquantiy:0
    };
    private wedZhuanYuan:dayLiveObj={
        amassignedquantity:0,
        amtimeperiods:[],
        assignedlivequantity:0,
        currentweek:0,
        endTimeOneDay:'',
        nightassignedquantity:0,
        nighttimeperiods:[],
        pmassignedquantity:0,
        pmtimeperiods:[],
        startTimeOneDay:'',
        todayassignedquantiy:0
    };
    private thuZhuanYuan:dayLiveObj={
        amassignedquantity:0,
        amtimeperiods:[],
        assignedlivequantity:0,
        currentweek:0,
        endTimeOneDay:'',
        nightassignedquantity:0,
        nighttimeperiods:[],
        pmassignedquantity:0,
        pmtimeperiods:[],
        startTimeOneDay:'',
        todayassignedquantiy:0
    };
    private friZhuanYuan:dayLiveObj={
        amassignedquantity:0,
        amtimeperiods:[],
        assignedlivequantity:0,
        currentweek:0,
        endTimeOneDay:'',
        nightassignedquantity:0,
        nighttimeperiods:[],
        pmassignedquantity:0,
        pmtimeperiods:[],
        startTimeOneDay:'',
        todayassignedquantiy:0
    };
    private satZhuanYuan:dayLiveObj={
        amassignedquantity:0,
        amtimeperiods:[],
        assignedlivequantity:0,
        currentweek:0,
        endTimeOneDay:'',
        nightassignedquantity:0,
        nighttimeperiods:[],
        pmassignedquantity:0,
        pmtimeperiods:[],
        startTimeOneDay:'',
        todayassignedquantiy:0
    };
    private sunZhuanYuan:dayLiveObj={
        amassignedquantity:0,
        amtimeperiods:[],
        assignedlivequantity:0,
        currentweek:0,
        endTimeOneDay:'',
        nightassignedquantity:0,
        nighttimeperiods:[],
        pmassignedquantity:0,
        pmtimeperiods:[],
        startTimeOneDay:'',
        todayassignedquantiy:0
    };
    //获取某周见面课专员分配情况信息
    getWeekPersonInfo(id:any,week:any,zhsId:any){
        this.directorService.getWeekZhuanyuanPersonInfo(id,week,zhsId)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('进行中 见面课专员分配情况');
            console.log(data);
            let resData=eval('('+data['_body']+')');
            this.zhuanYuanInfo=resData.result;
            if(this.isGetWeek){

            }else{
                for(var i=0;i<=7;i++){
                    if(i in this.zhuanYuanInfo){
                        if(this.zhuanYuanInfo[i].currentweek!=undefined){
                            this.cUweek=this.zhuanYuanInfo[i].currentweek;
                            this.dir_cUweekKeep=this.zhuanYuanInfo[i].currentweek;
                        }
                    }
                }
                this.isGetWeek=true;
            };
            this.cuAllLiveNum=0;
            this.endLiveQuantity=0;
            this.liveSureQuantity=0;
            if(this.zhuanYuanInfo['0']!=undefined){
                this.cuAllLiveNum+=this.zhuanYuanInfo['0'].assignedlivequantity;
                this.monZhuanYuan=this.zhuanYuanInfo["0"];
                for(var i=0;i<this.monZhuanYuan.amtimeperiods.length;i++){
                    if(this.monZhuanYuan.amtimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.monZhuanYuan.amtimeperiods[i].infoConfirm==2 && this.monZhuanYuan.amtimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.monZhuanYuan.amtimeperiods[i].title=this.monZhuanYuan.amtimeperiods[i].courseName +'\n'+ this.monZhuanYuan.amtimeperiods[i].liveName;
                }
                for(var i=0;i<this.monZhuanYuan.pmtimeperiods.length;i++){
                    if(this.monZhuanYuan.pmtimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.monZhuanYuan.pmtimeperiods[i].infoConfirm==2 && this.monZhuanYuan.pmtimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.monZhuanYuan.pmtimeperiods[i].title=this.monZhuanYuan.pmtimeperiods[i].courseName +'\n'+ this.monZhuanYuan.pmtimeperiods[i].liveName;
                }
                for(var i=0;i<this.monZhuanYuan.nighttimeperiods.length;i++){
                    if(this.monZhuanYuan.nighttimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.monZhuanYuan.nighttimeperiods[i].infoConfirm==2 && this.monZhuanYuan.nighttimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.monZhuanYuan.nighttimeperiods[i].title=this.monZhuanYuan.nighttimeperiods[i].courseName +'\n'+ this.monZhuanYuan.nighttimeperiods[i].liveName;
                }
            }else{
                this.monZhuanYuan={
                    amassignedquantity:0,
                    amtimeperiods:[],
                    assignedlivequantity:0,
                    currentweek:0,
                    endTimeOneDay:'',
                    nightassignedquantity:0,
                    nighttimeperiods:[],
                    pmassignedquantity:0,
                    pmtimeperiods:[],
                    startTimeOneDay:'',
                    todayassignedquantiy:0
                };
            }
            if(this.zhuanYuanInfo['1']!=undefined){
                this.cuAllLiveNum+=this.zhuanYuanInfo['1'].assignedlivequantity;
                this.tueZhuanYuan=this.zhuanYuanInfo["1"];
                for(var i=0;i<this.tueZhuanYuan.amtimeperiods.length;i++){
                    if(this.tueZhuanYuan.amtimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.tueZhuanYuan.amtimeperiods[i].infoConfirm==2 && this.tueZhuanYuan.amtimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.tueZhuanYuan.amtimeperiods[i].title=this.tueZhuanYuan.amtimeperiods[i].courseName +'\n'+ this.tueZhuanYuan.amtimeperiods[i].liveName;
                }
                for(var i=0;i<this.tueZhuanYuan.pmtimeperiods.length;i++){
                    if(this.tueZhuanYuan.pmtimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.tueZhuanYuan.pmtimeperiods[i].infoConfirm==2 && this.tueZhuanYuan.pmtimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.tueZhuanYuan.pmtimeperiods[i].title=this.tueZhuanYuan.pmtimeperiods[i].courseName +'\n'+ this.tueZhuanYuan.pmtimeperiods[i].liveName;
                }
                for(var i=0;i<this.tueZhuanYuan.nighttimeperiods.length;i++){
                    if(this.tueZhuanYuan.nighttimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.tueZhuanYuan.nighttimeperiods[i].infoConfirm==2 && this.tueZhuanYuan.nighttimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.tueZhuanYuan.nighttimeperiods[i].title=this.tueZhuanYuan.nighttimeperiods[i].courseName +'\n'+ this.tueZhuanYuan.nighttimeperiods[i].liveName;
                }
            }else{
                this.tueZhuanYuan={
                    amassignedquantity:0,
                    amtimeperiods:[],
                    assignedlivequantity:0,
                    currentweek:0,
                    endTimeOneDay:'',
                    nightassignedquantity:0,
                    nighttimeperiods:[],
                    pmassignedquantity:0,
                    pmtimeperiods:[],
                    startTimeOneDay:'',
                    todayassignedquantiy:0
                };
            }
            if(this.zhuanYuanInfo['2']!=undefined){
                this.cuAllLiveNum+=this.zhuanYuanInfo['2'].assignedlivequantity;
                this.wedZhuanYuan=this.zhuanYuanInfo["2"];
                for(var i=0;i<this.wedZhuanYuan.amtimeperiods.length;i++){
                    if(this.wedZhuanYuan.amtimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.wedZhuanYuan.amtimeperiods[i].infoConfirm==2 && this.wedZhuanYuan.amtimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.wedZhuanYuan.amtimeperiods[i].title=this.wedZhuanYuan.amtimeperiods[i].courseName +'\n'+ this.wedZhuanYuan.amtimeperiods[i].liveName;
                }
                for(var i=0;i<this.wedZhuanYuan.pmtimeperiods.length;i++){
                    if(this.wedZhuanYuan.pmtimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.wedZhuanYuan.pmtimeperiods[i].infoConfirm==2 && this.wedZhuanYuan.pmtimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.wedZhuanYuan.pmtimeperiods[i].title=this.wedZhuanYuan.pmtimeperiods[i].courseName +'\n'+ this.wedZhuanYuan.pmtimeperiods[i].liveName;
                }
                for(var i=0;i<this.wedZhuanYuan.nighttimeperiods.length;i++){
                    if(this.wedZhuanYuan.nighttimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.wedZhuanYuan.nighttimeperiods[i].infoConfirm==2 && this.wedZhuanYuan.nighttimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.wedZhuanYuan.nighttimeperiods[i].title=this.wedZhuanYuan.nighttimeperiods[i].courseName +'\n'+ this.wedZhuanYuan.nighttimeperiods[i].liveName;
                }
            }else{
                this.wedZhuanYuan={
                    amassignedquantity:0,
                    amtimeperiods:[],
                    assignedlivequantity:0,
                    currentweek:0,
                    endTimeOneDay:'',
                    nightassignedquantity:0,
                    nighttimeperiods:[],
                    pmassignedquantity:0,
                    pmtimeperiods:[],
                    startTimeOneDay:'',
                    todayassignedquantiy:0
                };
            }
            if(this.zhuanYuanInfo['3']!=undefined){
                this.cuAllLiveNum+=this.zhuanYuanInfo['3'].assignedlivequantity;
                this.thuZhuanYuan=this.zhuanYuanInfo["3"];
                for(var i=0;i<this.thuZhuanYuan.amtimeperiods.length;i++){
                    if(this.thuZhuanYuan.amtimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.thuZhuanYuan.amtimeperiods[i].infoConfirm==2 && this.thuZhuanYuan.amtimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.thuZhuanYuan.amtimeperiods[i].title=this.thuZhuanYuan.amtimeperiods[i].courseName +'\n'+ this.thuZhuanYuan.amtimeperiods[i].liveName;
                }
                for(var i=0;i<this.thuZhuanYuan.pmtimeperiods.length;i++){
                    if(this.thuZhuanYuan.pmtimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.thuZhuanYuan.pmtimeperiods[i].infoConfirm==2 && this.thuZhuanYuan.pmtimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.thuZhuanYuan.pmtimeperiods[i].title=this.thuZhuanYuan.pmtimeperiods[i].courseName +'\n'+ this.thuZhuanYuan.pmtimeperiods[i].liveName;
                }
                for(var i=0;i<this.thuZhuanYuan.nighttimeperiods.length;i++){
                    if(this.thuZhuanYuan.nighttimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.thuZhuanYuan.nighttimeperiods[i].infoConfirm==2 && this.thuZhuanYuan.nighttimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.thuZhuanYuan.nighttimeperiods[i].title=this.thuZhuanYuan.nighttimeperiods[i].courseName +'\n'+ this.thuZhuanYuan.nighttimeperiods[i].liveName;
                }
            }else{
                this.thuZhuanYuan={
                    amassignedquantity:0,
                    amtimeperiods:[],
                    assignedlivequantity:0,
                    currentweek:0,
                    endTimeOneDay:'',
                    nightassignedquantity:0,
                    nighttimeperiods:[],
                    pmassignedquantity:0,
                    pmtimeperiods:[],
                    startTimeOneDay:'',
                    todayassignedquantiy:0
                };
            }
            if(this.zhuanYuanInfo['4']!=undefined){
                this.cuAllLiveNum+=this.zhuanYuanInfo['4'].assignedlivequantity;
                this.friZhuanYuan=this.zhuanYuanInfo["4"];
                for(var i=0;i<this.friZhuanYuan.amtimeperiods.length;i++){
                    if(this.friZhuanYuan.amtimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.friZhuanYuan.amtimeperiods[i].infoConfirm==2 && this.friZhuanYuan.amtimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.friZhuanYuan.amtimeperiods[i].title=this.friZhuanYuan.amtimeperiods[i].courseName +'\n'+ this.friZhuanYuan.amtimeperiods[i].liveName;
                }
                for(var i=0;i<this.friZhuanYuan.pmtimeperiods.length;i++){
                    if(this.friZhuanYuan.pmtimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.friZhuanYuan.pmtimeperiods[i].infoConfirm==2 && this.friZhuanYuan.pmtimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.friZhuanYuan.pmtimeperiods[i].title=this.friZhuanYuan.pmtimeperiods[i].courseName +'\n'+ this.friZhuanYuan.pmtimeperiods[i].liveName;
                }
                for(var i=0;i<this.friZhuanYuan.nighttimeperiods.length;i++){
                    if(this.friZhuanYuan.nighttimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.friZhuanYuan.nighttimeperiods[i].infoConfirm==2 && this.friZhuanYuan.nighttimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.friZhuanYuan.nighttimeperiods[i].title=this.friZhuanYuan.nighttimeperiods[i].courseName +'\n'+ this.friZhuanYuan.nighttimeperiods[i].liveName;
                }
            }else{
                this.friZhuanYuan={
                    amassignedquantity:0,
                    amtimeperiods:[],
                    assignedlivequantity:0,
                    currentweek:0,
                    endTimeOneDay:'',
                    nightassignedquantity:0,
                    nighttimeperiods:[],
                    pmassignedquantity:0,
                    pmtimeperiods:[],
                    startTimeOneDay:'',
                    todayassignedquantiy:0
                };
            }
            if(this.zhuanYuanInfo['5']!=undefined){
                this.cuAllLiveNum+=this.zhuanYuanInfo['5'].assignedlivequantity;
                this.satZhuanYuan=this.zhuanYuanInfo["5"];
                for(var i=0;i<this.satZhuanYuan.amtimeperiods.length;i++){
                    if(this.satZhuanYuan.amtimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.satZhuanYuan.amtimeperiods[i].infoConfirm==2 && this.satZhuanYuan.amtimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.satZhuanYuan.amtimeperiods[i].title=this.satZhuanYuan.amtimeperiods[i].courseName +'\n'+ this.satZhuanYuan.amtimeperiods[i].liveName;
                }
                for(var i=0;i<this.satZhuanYuan.pmtimeperiods.length;i++){
                    if(this.satZhuanYuan.pmtimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.satZhuanYuan.pmtimeperiods[i].infoConfirm==2 && this.satZhuanYuan.pmtimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.satZhuanYuan.pmtimeperiods[i].title=this.satZhuanYuan.pmtimeperiods[i].courseName +'\n'+ this.satZhuanYuan.pmtimeperiods[i].liveName;
                }
                for(var i=0;i<this.satZhuanYuan.nighttimeperiods.length;i++){
                    if(this.satZhuanYuan.nighttimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.satZhuanYuan.nighttimeperiods[i].infoConfirm==2 && this.satZhuanYuan.nighttimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.satZhuanYuan.nighttimeperiods[i].title=this.satZhuanYuan.nighttimeperiods[i].courseName +'\n'+ this.satZhuanYuan.nighttimeperiods[i].liveName;
                }
            }else{
                this.satZhuanYuan={
                    amassignedquantity:0,
                    amtimeperiods:[],
                    assignedlivequantity:0,
                    currentweek:0,
                    endTimeOneDay:'',
                    nightassignedquantity:0,
                    nighttimeperiods:[],
                    pmassignedquantity:0,
                    pmtimeperiods:[],
                    startTimeOneDay:'',
                    todayassignedquantiy:0
                };
            }
            if(this.zhuanYuanInfo['6']!=undefined){
                this.cuAllLiveNum+=this.zhuanYuanInfo['6'].assignedlivequantity;
                this.sunZhuanYuan=this.zhuanYuanInfo["6"];
                for(var i=0;i<this.sunZhuanYuan.amtimeperiods.length;i++){
                    if(this.sunZhuanYuan.amtimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.sunZhuanYuan.amtimeperiods[i].infoConfirm==2 && this.sunZhuanYuan.amtimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.sunZhuanYuan.amtimeperiods[i].title=this.sunZhuanYuan.amtimeperiods[i].courseName +'\n'+ this.sunZhuanYuan.amtimeperiods[i].liveName;
                }
                for(var i=0;i<this.sunZhuanYuan.pmtimeperiods.length;i++){
                    if(this.sunZhuanYuan.pmtimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.sunZhuanYuan.pmtimeperiods[i].infoConfirm==2 && this.sunZhuanYuan.pmtimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.sunZhuanYuan.pmtimeperiods[i].title=this.sunZhuanYuan.pmtimeperiods[i].courseName +'\n'+ this.sunZhuanYuan.pmtimeperiods[i].liveName;
                }
                for(var i=0;i<this.sunZhuanYuan.nighttimeperiods.length;i++){
                    if(this.sunZhuanYuan.nighttimeperiods[i].liveStatus==3){
                        this.endLiveQuantity++;
                    }
                    if(this.sunZhuanYuan.nighttimeperiods[i].infoConfirm==2 && this.sunZhuanYuan.nighttimeperiods[i].strategyConfirm==2){
                        this.liveSureQuantity++;
                    }
                    this.sunZhuanYuan.nighttimeperiods[i].title=this.sunZhuanYuan.nighttimeperiods[i].courseName +'\n'+ this.sunZhuanYuan.nighttimeperiods[i].liveName;
                }
            }else{
                this.sunZhuanYuan={
                    amassignedquantity:0,
                    amtimeperiods:[],
                    assignedlivequantity:0,
                    currentweek:0,
                    endTimeOneDay:'',
                    nightassignedquantity:0,
                    nighttimeperiods:[],
                    pmassignedquantity:0,
                    pmtimeperiods:[],
                    startTimeOneDay:'',
                    todayassignedquantiy:0
                };
            }
            if(this.zhuanYuanInfo['7']!=undefined){
                this.shijianDuanArr=this.zhuanYuanInfo['7'].startTimeOneDay.split(',');
                this.shijianDuan=this.initcUshijianDuan(this.shijianDuanArr);
                this.weekToshow=this.initWeekToshow();
                this.initweekBtntoShow();
                let sT=this.shijianDuanArr[0].split('#')[0];
                let eT=this.shijianDuanArr[6].split('#')[1];
                setTimeout(()=>{
                    this.initHeight();
                },300);
            }else{

            }
            console.log(this.zhuanYuanInfo);
        });
    }

    private weekArr:any[]=[];
    private allWeekNum:any;
    //切割周 获取总周数与对应时间段
    cutScheduleByWeek(id:any){
      if(this.isCuKebiao){
          this.directorService.cutScheduleByWeek(id)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('切割周 获取总周数与对应时间段');
            console.log(eval('('+data['_body']+')'));
            let resWeek=eval('('+data['_body']+')');
            this.weekArr=resWeek.result;
            this.allWeekNum=this.weekArr.length;
        });
      }else{
          this.directorService.getScheduleInfoFindByid(id)
          .subscribe(data =>{
              if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
             }
             console.log("根据id查询课表信息");
             console.log(data);
             let endTime=data.result.endTime;
             let startTime=data.result.startTime;
             let time1=new Date(startTime);
             let time2=new Date(endTime);
             let week1=this.getYearWeek(time1);
             let week2=this.getYearWeek(time2);
             this.allWeekNum=week2-week1+1;
          });
      }
    }

    //获取某个日期是当年第几周
    getYearWeek(date:any){
        let date2=new Date(date.getFullYear(), 0, 1);
        let day1=date.getDay();
        if(day1==0){
            day1=7;
        }
        let day2=date2.getDay();
        if(day2==0){
            day2=7;
        }
        let d = Math.round((date.getTime() - date2.getTime()+(day2-day1)*(24*60*60*1000)) / 86400000);
        return Math.ceil(d /7)+1;
    }

    private isHaveoldWeek=true;
    private isHaveNewWeek=true;
    private oldWeekShow:any;
    private newWeekShow:any;
    initweekBtntoShow(){
        this.isHaveoldWeek=true;
        if(this.dir_cUweekKeep==this.cUweek){
            this.oldWeekShow='上周';
            this.newWeekShow='下周';
        }else if(this.dir_cUweekKeep+1==this.cUweek){
            this.oldWeekShow='本周';
            this.newWeekShow='第'+ (this.cUweek+2) +'周';
        }else if(this.dir_cUweekKeep-1==this.cUweek){
            if(this.cUweek>0){
                this.oldWeekShow='第'+ this.cUweek +'周';
                this.newWeekShow='本周';
            }else{
                this.oldWeekShow='第'+ this.cUweek +'周';
                this.newWeekShow='本周';
            }
        }else if(this.cUweek==0){
            this.isHaveoldWeek=false;
            this.oldWeekShow='第'+ this.cUweek +'周';
            this.newWeekShow='第'+ (this.cUweek+2) +'周';
        }else{
            this.oldWeekShow='第'+ this.cUweek +'周';
            this.newWeekShow='第'+ (this.cUweek+2) +'周';
        }
        if(this.cUweek==(this.allWeekNum-1)){
            this.isHaveNewWeek=false;
        }else{
            this.isHaveNewWeek=true;
        }

        if(this.cUweek==0){
            this.isHaveoldWeek=false;
        }

    }

    private clickCurrentWeekNum=-1;
    switchWeekDayShow(ele:any){
        let _that=this;
        for(var i=0;i<$('.col-xs-week8').length;i++){
            $($('.col-xs-week8')[i]).removeClass('week8-click');
        }
        _that.clickCurrentWeekNum=$(ele).index();
        $(ele).addClass('week8-click');
    }

    private weekToshow:any;
    initWeekToshow(){
        if(this.dir_cUweekKeep==this.cUweek){
            return '第'+(this.cUweek+1)+'周（本周）';
        }else if(this.dir_cUweekKeep+1==this.cUweek){
            return '第'+(this.cUweek+1)+'周（下周）';
        }else{
            return '第'+(this.cUweek+1)+'周 ';
        }
    }

    private isSwitchedWeek=false;
    //切换周（加、减）
    switchWeek(flag:any){
        if(flag=='1'){
            this.isSwitchedWeek=true;
            this.cUweek++;
            let zhsId=$(".cUzhuanyuanSelect").val();
            if(zhsId=="-1"){
                zhsId="";
            }
            this.getWeekPersonInfo(this.showSchedule,this.cUweek,zhsId);
        }
        if(flag=='0'){
            this.isSwitchedWeek=true;
            if(this.cUweek<=0){
                $("#alertTip").html('已经是当前阶段第一周了!');
                $('#alertWrap').modal('show');
                return;
            }else{
                this.cUweek--;
                let zhsId=$(".cUzhuanyuanSelect").val();
                if(zhsId=="-1"){
                    zhsId="";
                }
                this.getWeekPersonInfo(this.showSchedule,this.cUweek, zhsId);
            }
        }
        this.getFankuiWeek(this.cUweek);
    }

    private dateArray:any=[];
    //格式化时间段
    initcUshijianDuan(arr:any){
        this.dateArray=[];
        console.log(arr);
        for(let i in arr){
            let str= parseInt(arr[i].split('#')[0].split(" ")[0].split('-')[1])+'月'+
            parseInt(arr[i].split('#')[0].split(" ")[0].split('-')[2])+'日';
            this.dateArray.push(str);
        }

        let startM=parseInt(arr[0].split('#')[0].split(" ")[0].split('-')[1]);
        let startD=parseInt(arr[0].split('#')[0].split(" ")[0].split('-')[2]);
        let endM=parseInt(arr[6].split('#')[0].split(" ")[0].split('-')[1]);
        let endD=parseInt(arr[6].split('#')[0].split(" ")[0].split('-')[2]);
        return startM+'月'+startD+'日'+'-'+endM+'月'+endD+'日';
    }

    private commissionerList:any;
    //获取专员列表
    getCommissionerList(){
        var _that=this;
        this.directorService.getCommissionerList()
        .subscribe(data =>{
            console.log('获取专员列表');
            console.log(data);
            this.commissionerList=data.result;
            let obj={
                realName:'全部',
                zhsId:'-1'
            };
            this.commissionerList.splice(0, 0, obj);
            setTimeout(()=>{
                $(".cUzhuanyuanSelect").select2({
                    placeholder: '请选择专员'
                });
                $(".cUzhuanyuanSelect").val('-1').change();
                $(".cUzhuanyuanSelect").on('change', function (evt:any) {
                    console.log($(this).val());
                    if($(this).val()=='-1'){
                        _that.getWeekPersonInfo(_that.showSchedule,_that.cUweek,'');
                        _that.getFankuiWeek(_that.cUweek);
                    }else{
                        _that.getWeekPersonInfo(_that.showSchedule,_that.cUweek,$(this).val());
                        _that.getFankuiWeek(_that.cUweek);
                    }
                });
            },300);
        });
    }

    private dir_paikeALL=0;
    private dir_paikeOK=0;
    private dir_paikeCountInfo:any;
    //专员排课情况统计
    paikecountInfo(id:any){
        this.directorService.paikecountInfo(id)
        .subscribe(data => {
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('专员排课进度情况统计');
            console.log(data);
            this.dir_paikeCountInfo=data.result;
            this.dir_paikeALL=0;
            this.dir_paikeOK=0;
            for(var i=0;i<this.dir_paikeCountInfo.length;i++){
                this.dir_paikeCountInfo[i].progressNum=this.dir_paikeCountInfo[i].paikecompletedquantity/this.dir_paikeCountInfo[i].allocationcoursequantity*100;
                this.dir_paikeALL=this.dir_paikeALL+this.dir_paikeCountInfo[i].allocationcoursequantity;
                this.dir_paikeOK=this.dir_paikeOK+this.dir_paikeCountInfo[i].paikecompletedquantity;
            }
            setTimeout(()=>{
                $(".nano").nanoScroller();
                $(".nano").nanoScroller({ preventPageScrolling: true });
            },500);
        });
    }

    //专员反馈
    private runcommissionFeedbackQuantity=0;
    public dir_fankuiWeek:any;
    private fankuiSt:any;
    private fankuiEt:any;
    public dir_fankuiStToshow:any;
    public dir_fankuiEtToshow:any;
    //获取周信息
    getFankuiWeek(week:any){
        this.directorService.getWeek(this.showSchedule,week)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获取周信息');
            let resData=eval('('+data['_body']+')');
            let resDataArr=resData.result.split(',');
            this.dir_fankuiWeek=parseInt(resDataArr[0]);
            this.fankuiSt=resDataArr[1];
            this.fankuiEt=resDataArr[2];
            this.dir_fankuiStToshow=this.fankuiSt.split(' ')[0].split('-')[1]+'/'+this.fankuiSt.split(' ')[0].split('-')[2];
            this.dir_fankuiEtToshow=this.fankuiEt.split(' ')[0].split('-')[1]+'/'+this.fankuiEt.split(' ')[0].split('-')[2];
            this.findLiveFeedbackInfo();
        });
    }

    public dir_todayFeedBack:any;
    public dir_isHavefankui=true;
    //获取反馈
    findLiveFeedbackInfo(){
        let zhsId=$(".cUzhuanyuanSelect").val();
        if(zhsId=="-1"){
            zhsId="";
        }
        this.directorService.findLiveFeedbackInfo(this.showSchedule,this.fankuiSt,this.fankuiEt,zhsId)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("获取反馈");
            console.log(eval('('+data['_body']+')'));
            let resData=eval('('+data['_body']+')');
            this.dir_todayFeedBack=resData.result;
            this.runcommissionFeedbackQuantity=this.dir_todayFeedBack.length;
            for(var j=0;j<this.dir_todayFeedBack.length;j++){
                for(var k = j + 1;k<this.dir_todayFeedBack.length;k++){
                    if(this.dir_todayFeedBack[j].createTime>this.dir_todayFeedBack[k].createTime){
                        let change = this.dir_todayFeedBack[j];
                        this.dir_todayFeedBack[j] = this.dir_todayFeedBack[k];
                        this.dir_todayFeedBack[k] = change;
                    }
                }
            };
            this.dir_todayFeedBack.reverse();
            for(var i=0;i<this.dir_todayFeedBack.length;i++){
                if(this.dir_todayFeedBack[i].teacherProblem==null || this.dir_todayFeedBack[i].teacherProblem==undefined){
                    this.dir_todayFeedBack[i].teacherProblem="暂无";
                }
                if(this.dir_todayFeedBack[i].speakerClassroomProblem==null || this.dir_todayFeedBack[i].speakerClassroomProblem==undefined){
                    this.dir_todayFeedBack[i].speakerClassroomProblem="暂无";
                }
                if(this.dir_todayFeedBack[i].interactiveClassroomProblem==null || this.dir_todayFeedBack[i].interactiveClassroomProblem==undefined){
                    this.dir_todayFeedBack[i].interactiveClassroomProblem="暂无";
                }
                if(this.dir_todayFeedBack[i].daoboProblem==null || this.dir_todayFeedBack[i].daoboProblem==undefined){
                    this.dir_todayFeedBack[i].daoboProblem="暂无";
                }
                if(this.dir_todayFeedBack[i].otherProblem==null || this.dir_todayFeedBack[i].otherProblem==undefined){
                    this.dir_todayFeedBack[i].otherProblem="暂无";
                }
                if(this.dir_todayFeedBack[i].feedbackDescription==null || this.dir_todayFeedBack[i].feedbackDescription==undefined){
                    this.dir_todayFeedBack[i].feedbackDescription="暂无";
                }
            }
            if(resData.result.length==0){
                this.dir_isHavefankui=false;
            }else{
                this.dir_isHavefankui=true;
            }
        });
    }


    public dir_CsyncResult:any;
    public dir_CsyncOnOff=false;
    //同步
    sync(sta:any){
        this.directorService.sync(this.showSchedule)
        .subscribe(data => {
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('同步');
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            this.getBasicInfo();
            this.getUnfenpeiMeetCourseList();
            this.dir_CsyncResult=resData.result;
            this.dir_CsyncOnOff=true;
            setTimeout(()=>{
                this.dir_CsyncOnOff=false;
            },3000);
        });
    }

    private dataTablesLang={
        "sProcessing": "加载中...",
        "sLengthMenu": "每页 _MENU_ 项",
        "sZeroRecords": "没有匹配结果",
        "sInfo": "当前显示第 _START_ 至 _END_ 项，共 _TOTAL_ 项。",
        "sInfoEmpty": "当前显示第 0 至 0 项，共 0 项",
        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
        "sInfoPostFix": "",
        "sSearch": "搜索:",
        "sUrl": "",
        "sEmptyTable": "暂无数据显示",
        "sLoadingRecords": "载入中...",
        "sInfoThousands": ",",
        "oPaginate": {
            "sFirst": "首页",
            "sPrevious": "«",
            "sNext": "»",
            "sLast": "末页",
            "sJump": "跳转"
        }
    };

    private unfenpei_returnData={
        "draw":0,
        "recordsTotal":0,
        "recordsFiltered":0,
        "data":[
            {}
        ]
    };

    private unfenpei_pageNum=1;
    private unfenpei_pageSize=10;
    private unFenpeiCourseList:any;

    bindFenpeiEvent(){
        var _that=this;
        $(".feipeiModelBtn").click(function(){
            _that.getFenpeiInfo('1');
        });
    }

    //获取未分配课程列表
    getUnfenpeiMeetCourseList(){
        var _that=this;
        var table = $("#unFenpeiTable").dataTable({
            "initComplete": function(settings:any, json:any) {
                //初始化后回调
                $('#unFenpeiTable_wrapper .row .col-sm-5').remove();
                let domEle=$(
                    '<div class="col-sm-5">'+
                        '<span class="feipeiModelBtn"  data-toggle="modal" data-target="#cUfenpei"'+ 'style="background: #2570d3;height:34px;line-height:34px;text-align:center;'+
                        'border: none;color:#fff;border-radius: 17px;width: 80px;display:inline-block;cursor:pointer;float:right;">分配</span>'+
                    '</div>'
                    );
                $($('#unFenpeiTable_wrapper .row')[2]).append(domEle);
                $($('#unFenpeiTable_wrapper .row')[1]).css({
                    height:"436px"
                });
                $('#unFenpeiTable_paginate').css({
                    float:"left"
                });
                _that.bindFenpeiEvent();
            },
            lengthChange: false,
            info:false,
            ordering:false,
            destroy:true,
            language:this.dataTablesLang,
            autoWidth: false,
            processing: true,
            serverSide: true,
            searching: false,
            orderMulti: false,
            order: [],
            renderer: "bootstrap",
            pagingType: "simple_numbers",
            columnDefs: [{
                "targets": 'nosort',
                "orderable": false
            }],
            ajax: function (data:any, callback:any, settings:any) {
                var dataDraw=data.draw;
                _that.unfenpei_pageNum=(data.start / data.length)+1;
                _that.unfenpei_pageSize=data.length;
                _that.directorService.getFenpeiCourse(_that.showSchedule,'',_that.unfenpei_pageNum,_that.unfenpei_pageSize)
                .subscribe(data =>  {
                    if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                        _that.router.navigateByUrl('login');
                        return;
                    }
                    console.log("获取未分配课程列表");
                    console.log(eval('('+data['_body']+')'));
                    let resData=eval('('+data['_body']+')');
                    _that.unFenpeiCourseList=resData.result;
                    _that.unfenpei_returnData.draw = dataDraw;
                    _that.unfenpei_returnData.recordsTotal = _that.unFenpeiCourseList.rowCount;
                    _that.unfenpei_returnData.recordsFiltered = _that.unFenpeiCourseList.rowCount;
                    _that.unfenpei_returnData.data = _that.unFenpeiCourseList.pageItems;
                    console.log(_that.unfenpei_returnData);
                    callback(_that.unfenpei_returnData);
                });
            },
            columns: [
                {
                    targets:0,
                    data: "courseName",
                    render: function(data:any, type:any, row:any, meta:any){
                       return '<span title=' + data + '>' + data + '</span>';
                    }
                },
                { "data": "schoolName" }
            ]
        }).api();
    }


    private fenpei_returnData={
        "draw":0,
        "recordsTotal":0,
        "recordsFiltered":0,
        "data":[
            {}
        ]
    };

    private fenpeiCourseSta:any;
    //切换课程状态
    staChange(){
        this.fenpeiCourseSta=$('#courseStatus').val();
        this.getFenpeiMeetCourseList();
        console.log($('#courseStatus').val());
    }

    bindFabuEvent(){
        var _that=this;
        $(".fabuModelBtn").click(function(){
            _that.releaseCourse();
        });
    }

    private fenpei_pageNum=1;
    private fenpei_pageSize=10;
    private fenpeiCourseList:any;

    //获取已分配课程列表
    getFenpeiMeetCourseList(){
        var _that=this;
        var table = $("#yiFenpeiTable").dataTable({
            "initComplete": function(settings:any, json:any) {
                //初始化后回调
                $('#yiFenpeiTable_wrapper .row .col-sm-5').remove();
                let domEle=$(
                    '<div class="col-sm-5">'+
                        '<span class="fabuModelBtn" style="background: #2570d3;height:34px;line-height:34px;text-align:center;'+
                        'border: none;color:#fff;border-radius: 17px;width: 80px;display:inline-block;cursor:pointer;float:right;"><i class="fa fa-send"></i></span>'+
                        '<span class="fabuingModelBtn disabled" style="background: #679BE0;height:34px;line-height:34px;text-align:center;'+
                        'border: none;color:#fff;border-radius: 17px;width: 80px;display:inline-block;cursor:pointer;float:right;display:none;">发布中</span>'+
                    '</div>'
                    );
                $($('#yiFenpeiTable_wrapper .row')[2]).append(domEle);
                $($('#yiFenpeiTable_wrapper .row')[1]).css({
                    height:"436px"
                });
                $('#yiFenpeiTable_paginate').css({
                    float:"left"
                });
                $(".checkBoxAllfabuCourse").prop("checked",false);
                $('.checkBoxfabuCourse').off('click');
                $('.checkBoxfabuCourse').on('click',_that.setSingel);
                _that.bindFabuEvent();
            },
            lengthChange: false,
            info:false,
            ordering:false,
            destroy:true,
            language:this.dataTablesLang,
            autoWidth: false,
            processing: true,
            serverSide: true,
            searching: false,
            orderMulti: false,
            order: [],
            renderer: "bootstrap",
            pagingType: "simple_numbers",
            columnDefs: [{
                "targets": 'nosort',
                "orderable": false
            }],
            ajax: function (data:any, callback:any, settings:any) {
                var dataDraw=data.draw;
                _that.fenpei_pageNum=(data.start / data.length)+1;
                _that.fenpei_pageSize=data.length;
                _that.directorService.getCourse(_that.showSchedule,_that.fenpei_pageNum,_that.fenpei_pageSize,_that.fenpeiCourseSta)
                .subscribe(data =>  {
                    if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                        _that.router.navigateByUrl('login');
                        return;
                    }
                    console.log("获取已分配课程列表");
                    console.log(eval('('+data['_body']+')'));
                    let resData=eval('('+data['_body']+')');
                    _that.fenpeiCourseList=resData.result;
                    _that.fenpei_returnData.draw = dataDraw;
                    _that.fenpei_returnData.recordsTotal = _that.fenpeiCourseList.rowCount;
                    _that.fenpei_returnData.recordsFiltered = _that.fenpeiCourseList.rowCount;
                    _that.fenpei_returnData.data = _that.fenpeiCourseList.pageItems;
                    console.log(_that.fenpei_returnData);
                    callback(_that.fenpei_returnData);
                });
            },
            columns: [
                {
                    targets:0,
                    data: "status",
                    render: function(data:any, type:any, row:any, meta:any){
                        if(data=='3'){
                            return  '<input style="cursor:pointer;" type="checkbox" class="checkBoxfabuCourse" name="checkBoxfabuCourse" value='+ row.id +'>';
                        }else{
                            return  '<input type="checkbox" disabled value='+ row.id +'>';
                        }
                    }
                },
                { "data": "courseDirector" },
                {
                    targets:2,
                    data: "status",
                    render: function(data:any, type:any, row:any, meta:any){
                       return _that.dir_staArr[data];
                    }
                },
                {
                    targets:3,
                    data: "courseName",
                    render: function(data:any, type:any, row:any, meta:any){
                       return '<span title=' + data + '>' + data + '</span>';
                    }
                },
                { "data": "schoolName" },
                {
                    targets:5,
                    data: "zhujiangSchoolNameList",
                    title: "主讲点学校",
                    render: function(data:any, type:any, row:any, meta:any){
                       if(data.length==0){
                           return "";
                       }else if(data.length>1){
                           let titleInfo="";
                           for(var i=0;i<data.length;i++){
                               if(titleInfo==""){
                                   titleInfo=titleInfo+data[i];
                               }else{
                                   titleInfo=titleInfo+'&#10;'+data[i];
                               }
                           }
                           return '<span style="cursor:pointer;" title='+ titleInfo +'>多个</span>';
                       }else{
                           return data[0];
                       }
                    }
                }
            ]
        }).api();
    }

    private fabu_returnData={
        "draw":0,
        "recordsTotal":0,
        "recordsFiltered":0,
        "data":[
            {}
        ]
    };

    public requireChangeInfo:any;
    public requireChangeDetail:any;
    public isHaveChange=false;
    public liveKaiguan=['','有效','无效'];
    private handleChangeId:any;
    private biangengSpanObj:any;
    //获取需求变更
    getRequirementChange(){
        var _that=this;
        $(".dir_biangengBtn").click(function(){
            let curId=this.id.split('@')[1];
            _that.biangengSpanObj=this;
            _that.requireChangeInfo=_that.fabuCourseList.pageItems.find((course:any)=>course.id==curId);
            if(_that.requireChangeInfo!=undefined){
                _that.isHaveChange=true;
                _that.requireChangeDetail=_that.requireChangeInfo.requirementChanges[0].requireChangeDetails;
                _that.handleChangeId=_that.requireChangeInfo.requirementChanges[0].id;
            }else{
                _that.isHaveChange=false;
            }
        });
    }

    //运行主管处理需求变更
    requirementtChangeHandler(flag:any){
        setTimeout(()=>{
            this.directorService.requirementtChangeHandler(this.handleChangeId,flag)
            .subscribe(data =>{
                if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                    this.router.navigateByUrl('login');
                    return;
                }
                let resData=eval('('+data['_body']+')');
                console.log(resData);
                if(resData.successful && resData.result){
                    $(this.biangengSpanObj).hide();
                }else{
                    $("#alertTip").html(resData.errorMsg);
                    $('#alertWrap').modal('show');
                }
            });
        },200);
    }

    private fabu_pageNum=1;
    private fabu_pageSize=10;
    private fabuCourseList:any;
    private directorComponentObj:any;
    //获取已发布课程列表
    getFabuMeetCourseList(){
        var _that=this;
        var table = $("#yiFabuTable").dataTable({
            "initComplete": function(settings:any, json:any) {
                //初始化后回调
                $('#yiFabuTable_wrapper .row .col-sm-5').remove();
                $($('#yiFabuTable_wrapper .row')[2]).append($('<div class="col-sm-5"></div>'));
                $($('#yiFabuTable_wrapper .row')[1]).css({
                    height:"436px"
                });
                $('#yiFabuTable_paginate').css({
                    float:"left"
                });
            },
            lengthChange: false,
            info:false,
            ordering:false,
            destroy:true,
            language:this.dataTablesLang,
            autoWidth: false,
            processing: true,
            serverSide: true,
            searching: false,
            orderMulti: false,
            order: [],
            renderer: "bootstrap",
            pagingType: "simple_numbers",
            columnDefs: [{
                "targets": 'nosort',
                "orderable": false
            }],
            ajax: function (data:any, callback:any, settings:any) {
                var dataDraw=data.draw;
                _that.fabu_pageNum=(data.start / data.length)+1;
                _that.fabu_pageSize=data.length;
                _that.directorService.getCourse(_that.showSchedule,_that.fabu_pageNum,_that.fabu_pageSize,'6')
                .subscribe(data =>  {
                    if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                        _that.router.navigateByUrl('login');
                        return;
                    }
                    console.log("获取已发布课程列表");
                    console.log(eval('('+data['_body']+')'));
                    let resData=eval('('+data['_body']+')');
                    _that.fabuCourseList=resData.result;
                    _that.fabu_returnData.draw = dataDraw;
                    _that.fabu_returnData.recordsTotal = _that.fabuCourseList.rowCount;
                    _that.fabu_returnData.recordsFiltered = _that.fabuCourseList.rowCount;
                    _that.fabu_returnData.data = _that.fabuCourseList.pageItems;
                    console.log(_that.fabu_returnData);
                    callback(_that.fabu_returnData);
                    _that.getRequirementChange();
                });
            },
            columns: [
                { "data": "courseDirector" },
                { "data": "liveQuantity" },
                {
                    targets:2,
                    data: "courseName",
                    render: function(data:any, type:any, row:any, meta:any){
                       return '<span title=' + data + '>' + data + '</span>';
                    }
                },
                { "data": "schoolName" },
                {
                    targets:4,
                    data: "zhujiangSchoolNameList",
                    title: "主讲学校",
                    render: function(data:any, type:any, row:any, meta:any){
                       if(data.length==0){
                           return "";
                       }else if(data.length>1){
                           let titleInfo="";
                           for(var i=0;i<data.length;i++){
                               if(titleInfo==""){
                                   if(data[i]!=null && data[i]!=""){
                                       titleInfo=titleInfo+data[i];
                                   }
                               }else{
                                   if(data[i]!=null && data[i]!=""){
                                       titleInfo=titleInfo+'&#10;'+data[i];
                                   }
                               }
                           }
                           if(titleInfo==""){
                               return titleInfo;
                           }
                           return '<span style="cursor:pointer;" title='+ titleInfo +'>多个</span>';
                       }else{
                           return data[0];
                       }
                    }
                },
                {
                    targets:5,
                    data: "requirementChanges",
                    render: function(data:any, type:any, row:any, meta:any){
                       if(data!=undefined && data!=null && data.length>0 && data[0].isAgree==0){
                           return '<span data-toggle="modal" id="@'+ row.id +'" data-target="#changeInfo" class="dir_biangengBtn">变更请求</span>';
                       }else{
                           return '';
                       }
                    }
                }
            ]
        }).api();
    }

    private cUunFenpeicourseList:any[]=[];
    public dir_cUunFenpeicourseListToshow:any[]=[];
    public dir_cUunFenpeicourseListNum=0;
    private cUFenpeicourseSelect:any[]=[];
    private cUTuihuiCourseSelect:any[]=[];

    private cUfenpeizhuanyuanList:any[]=[];
    public dir_cUfenpeizhuanyuanListToshow:any[]=[];

    private cUfenpeizhuanyuanListObj:any;
    private cUfenpeizhuanyuanListToshowObj:any;

    private cUfenpeizhuanyaunSelectId:any;

    private tijiaoFenpei:any[]=[];
    private tijiaoFenpeiString:any;

    private allChangeList:any[]=[];
    private zhuanyaunInfo:any[]=[];

    selectZhuanyuanId(id:any,sta:any){
        if(this.cUfenpeizhuanyaunSelectId==id){
            this.cUfenpeizhuanyaunSelectId=null;
        }else{
            this.cUfenpeizhuanyaunSelectId=id;
        }
        console.log(this.cUfenpeizhuanyaunSelectId);
    }

    public dir_fenPeiing=true;
    //课程分配
    assignCourseToCommissioner(sta:any){
        if(this.tijiaoFenpei.length==0 && this.returnList.length==0){
            $("#alertTip").html("请选择专员以及要分配的对应课程!");
            $('#alertWrap').modal('show');
            return;
        }
        let objDel={
            userId:-1000,
            courseIds:""
        };
        if(this.returnList.length>0){
            objDel.courseIds=this.returnList.join();
            this.tijiaoFenpei.push(objDel);
        }
        this.dir_fenPeiing=false;
        console.log(this.tijiaoFenpei);
        this.tijiaoFenpeiString=JSON.stringify(this.tijiaoFenpei);
        console.log(this.tijiaoFenpeiString);
        this.directorService.assignCourseToCommissioner(this.tijiaoFenpeiString)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            setTimeout(()=>{
                this.dir_fenPeiing=true;
            },300);
            console.log("分配课程");
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            this.getFenpeiInfo('1');
            this.schedulecourseinfor(this.showSchedule,'1');
            this.cUfenpeizhuanyaunSelectId=null;
            this.tijiaoFenpei=[];
            this.returnList=[];
            this.paikecountInfo(this.showSchedule);
            this.getUnfenpeiMeetCourseList();
        });
    }

    private cUscrollTimer:any;
    private nSscrollTimer:any;
    bindFenpeiCourseScroll(){
        $(".cUfenPeiCourseCon").scroll(function() {
           $('.cUfenpeiSearch').hide(300);
           $('.cUfenPeiCourseCon').css("marginTop","0px");
           clearTimeout(this.cUscrollTimer);
           this.cUscrollTimer=setTimeout(()=>{
               $('.cUfenPeiCourseCon').css("marginTop","40px");
               $('.cUfenpeiSearch').show(300);
           },800);
        });
    }

    public dir_cUfenpeiCourseSva:any;
    //分配时查询课程
    getFenpeiCourse(sta:any){
        this.isSelectCourse=[];
        this.directorService.getFenpeiCourse(this.showSchedule,this.dir_cUfenpeiCourseSva,'1','500')
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("进行中 搜索获取未分配的课程");
            let resData=eval('('+data['_body']+')');
            console.log(resData.result);
            this.cUunFenpeicourseList=resData.result.pageItems;
            this.dir_cUunFenpeicourseListToshow=resData.result.pageItems;
            for(var i=0;i<this.tijiaoFenpei.length;i++){
                this.isSelectCourse=this.isSelectCourse.concat(this.tijiaoFenpei[i].courseIds.split(','));
            }
            for(var i=0;i<this.isSelectCourse.length;i++){
                for(var j=0;j<this.dir_cUunFenpeicourseListToshow.length;j++){
                    if(this.dir_cUunFenpeicourseListToshow[j].id==this.isSelectCourse[i]){
                        this.dir_cUunFenpeicourseListToshow.splice(j,1);
                    }
                }
            }
        });
    }

    private isSelectCourse:any[]=[];
    //获取未分配运行专员的课程信息以及运行专员名单
    getFenpeiInfo(sta:any){
        this.isSelectCourse=[];
        this.directorService.findUnassigned(this.showSchedule)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("进行中 获取未分配的课程");
            let resData=eval('('+data['_body']+')');
            console.log(resData.result);
            this.cUunFenpeicourseList=resData.result;
            this.dir_cUunFenpeicourseListToshow=resData.result;

            for(var i=0;i<this.tijiaoFenpei.length;i++){
                this.isSelectCourse=this.isSelectCourse.concat(this.tijiaoFenpei[i].courseIds.split(','));
            }
            for(var i=0;i<this.isSelectCourse.length;i++){
                for(var j=0;j<this.dir_cUunFenpeicourseListToshow.length;j++){
                    if(this.dir_cUunFenpeicourseListToshow[j].id==this.isSelectCourse[i]){
                        this.dir_cUunFenpeicourseListToshow.splice(j,1);
                    }
                }
            }
            this.dir_cUunFenpeicourseListNum=this.dir_cUunFenpeicourseListToshow.length;
            setTimeout(()=>{
                $(".nano").nanoScroller();
                $(".nano").nanoScroller({ preventPageScrolling: true });
                this.bindFenpeiCourseScroll();
            },500);
        });

        this.directorService.findRunCommissionerInfor(this.showSchedule)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("进行中 获取有效的运行专员");
            console.log(data);
            this.cUfenpeizhuanyuanListObj = $.extend(true, {}, data);
            this.cUfenpeizhuanyuanListToshowObj = $.extend(true, {}, data);
            this.cUfenpeizhuanyuanList=this.cUfenpeizhuanyuanListObj.result;
            this.dir_cUfenpeizhuanyuanListToshow=this.cUfenpeizhuanyuanListToshowObj.result;

            for(var i=0;i<this.dir_cUfenpeizhuanyuanListToshow.length;i++){
                this.dir_cUfenpeizhuanyuanListToshow[i].courseNum=this.dir_cUfenpeizhuanyuanListToshow[i].courses.length;
            }
            setTimeout(()=>{
                for(var i=0;i<$('.divTuihuiCourse').length;i++){
                    $('.divTuihuiCourse')[i].style.backgroundColor="#A8A8B7";
                }
            },300);
        });
    }

    //点击分配
    fenpeiTopeople(sta:any){
        if(this.cUfenpeizhuanyaunSelectId==null){
            $("#alertTip").html("请选择专员!");
            $('#alertWrap').modal('show');
            return;
        }else{
            for(var i=0;i<$("input.checkBoxFenpeiCourse").length;i++){
                if($($("input.checkBoxFenpeiCourse")[i]).is(':checked')){
                    for(var k=0;k<this.dir_cUunFenpeicourseListToshow.length;k++){
                        if(this.dir_cUunFenpeicourseListToshow[k].id == $("input.checkBoxFenpeiCourse")[i].value){
                            let selid=$("input.checkBoxFenpeiCourse")[i].value;
                            let selname=$($("input.checkBoxFenpeiCourse")[i]).attr('title');
                            let newselectObj={
                                courseId:selid,
                                courseName:selname
                            };
                            this.cUFenpeicourseSelect.push(newselectObj);
                            this.dir_cUunFenpeicourseListToshow.splice(k--,1);
                            for(var j=0;j<this.returnList.length;j++){
                                if(this.returnList[j].id==selid){
                                    this.returnList.splice(j--,1);
                                }
                            }
                        }
                    }
                }
            };
            if(this.cUFenpeicourseSelect.length==0){
                $("#alertTip").html("请选择课程!");
                $('#alertWrap').modal('show');
                return;
            }
            for(var p=0;p<this.cUFenpeicourseSelect.length;p++){
                if(this.returnList.find((id:any)=>id==this.cUFenpeicourseSelect[p].courseId)!=undefined){
                    this.returnList.splice($.inArray(this.cUFenpeicourseSelect[p].courseId,this.returnList),1);
                }
            }
            for(var i=0;i<this.dir_cUfenpeizhuanyuanListToshow.length;i++){
                if(this.dir_cUfenpeizhuanyuanListToshow[i].userId==this.cUfenpeizhuanyaunSelectId){
                    this.dir_cUfenpeizhuanyuanListToshow[i].courses=this.cUFenpeicourseSelect.concat(this.dir_cUfenpeizhuanyuanListToshow[i].courses);
                }
            }
            if(this.tijiaoFenpei.find((obj:any)=>obj.userId==this.cUfenpeizhuanyaunSelectId)!=undefined){
                let addIds=this.tijiaoFenpei.find((obj:any)=>obj.userId==this.cUfenpeizhuanyaunSelectId).courseIds;
                for(var n=0;n<this.cUFenpeicourseSelect.length;n++){
                    if(addIds==""){
                        addIds=addIds+this.cUFenpeicourseSelect[n].courseId;
                    }else{
                        addIds=addIds+','+this.cUFenpeicourseSelect[n].courseId;
                    }
                }
                this.tijiaoFenpei.find((obj:any)=>obj.userId==this.cUfenpeizhuanyaunSelectId).courseIds=addIds;
            }else{
                let addIds="";
                for(var k=0;k<this.cUFenpeicourseSelect.length;k++){
                    if(addIds==""){
                        addIds=addIds+this.cUFenpeicourseSelect[k].courseId;
                    }else{
                        addIds=addIds+','+this.cUFenpeicourseSelect[k].courseId;
                    }
                }
                let fenpeiObj={
                    userId:this.cUfenpeizhuanyaunSelectId,
                    courseIds:addIds
                };
                this.tijiaoFenpei.push(fenpeiObj);
            }
            console.log(this.tijiaoFenpei);
            console.log(this.cUFenpeicourseSelect);
            this.cUFenpeicourseSelect=[];
            console.log(this.dir_cUunFenpeicourseListToshow);
            console.log(this.returnList);
            console.log(this.dir_cUfenpeizhuanyuanListToshow);
            console.log(this.cUfenpeizhuanyuanList);
        }
    }

    private returnList:any[]=[];
    private nSreturnList:any[]=[];
    //点击退回
    tuihuiTocourse(sta:any){
        for(var i=0;i<$("input.checkBoxTuihuiCourse").length;i++){
            if($($("input.checkBoxTuihuiCourse")[i]).is(':checked')){
                for(var j=0;j<this.dir_cUfenpeizhuanyuanListToshow.length;j++){
                    for(var k=0;k<this.dir_cUfenpeizhuanyuanListToshow[j].courses.length;k++){
                        if(this.dir_cUfenpeizhuanyuanListToshow[j].courses[k].courseId==$("input.checkBoxTuihuiCourse")[i].value){
                            console.log(this.dir_cUfenpeizhuanyuanListToshow[j].courses[k]);
                            let newtuihuiObj={
                                userId:this.dir_cUfenpeizhuanyuanListToshow[j].userId,
                                id:$("input.checkBoxTuihuiCourse")[i].value,
                                courseName:this.dir_cUfenpeizhuanyuanListToshow[j].courses[k].courseName
                            };
                            this.cUTuihuiCourseSelect.push(newtuihuiObj);
                            this.dir_cUfenpeizhuanyuanListToshow[j].courses.splice(k--,1);
                        }
                    }
                }
                for(var p=0;p<this.cUfenpeizhuanyuanList.length;p++){
                    if(this.cUfenpeizhuanyuanList[p].courses.find((live:any)=>live.courseId==$("input.checkBoxTuihuiCourse")[i].value)!=undefined && this.returnList.find((id:any)=>id==$("input.checkBoxTuihuiCourse")[i].value)==undefined){
                        this.returnList.push($("input.checkBoxTuihuiCourse")[i].value);
                    }
                }
            }
        }
        for(var m=0;m<this.cUTuihuiCourseSelect.length;m++){
            if(this.tijiaoFenpei.find((obj:any)=>obj.userId==this.cUTuihuiCourseSelect[m].userId)!=undefined){
                let courseidsArr=this.tijiaoFenpei.find((obj:any)=>obj.userId==this.cUTuihuiCourseSelect[m].userId).courseIds.split(',');
                for(var i=0;i<courseidsArr.length;i++){
                    if(this.cUTuihuiCourseSelect[m].id==courseidsArr[i]){
                        courseidsArr.splice(i--,1);
                    }
                }
                let courseidStr=courseidsArr.join();
                this.tijiaoFenpei.find((obj:any)=>obj.userId==this.cUTuihuiCourseSelect[m].userId).courseIds=courseidStr;
            }
        }
        this.dir_cUunFenpeicourseListToshow=this.cUTuihuiCourseSelect.concat(this.dir_cUunFenpeicourseListToshow);
        this.cUTuihuiCourseSelect=[];
    }

    private cUcourseCheeckbox:any[]=[];

    //全选课程
    allSelected(sta:any){
        if ($(".checkBoxAllfabuCourse").prop("checked")) {
            $("[name='checkBoxfabuCourse']:checkbox").prop("checked", true);
        } else {
            $("[name='checkBoxfabuCourse']:checkbox").prop("checked", false);
        }
    }
    //子选择框单选事件
    setSingel(){
        //当没有选中某个子复选框时，SelectAll取消选中
        for(var i=0;i<$("[name='checkBoxfabuCourse']:checkbox").length;i++){
            if(!$($("[name='checkBoxfabuCourse']:checkbox")[i]).prop("checked")){
                $(".checkBoxAllfabuCourse").prop("checked",false);
            }
        }

        let allChild = $("[name='checkBoxfabuCourse']:checkbox").length;
        let selsecAllChild=0;
        for(var j=0;j<$("[name='checkBoxfabuCourse']:checkbox").length;j++){
            if($($("[name='checkBoxfabuCourse']:checkbox")[j]).prop("checked")){
                selsecAllChild++;
            }
        }
        if (allChild == selsecAllChild) {
            $(".checkBoxAllfabuCourse").prop("checked",true);
        }
    }

    private cUfabuCourseIdsArr:any[]=[];
    //发布课程
    releaseCourse(){
        var _that=this;
        this.cUfabuCourseIdsArr=[];
        for(var j=0;j<$("[name='checkBoxfabuCourse']:checkbox").length;j++){
            if($($("[name='checkBoxfabuCourse']:checkbox")[j]).prop("checked")){
                this.cUfabuCourseIdsArr.push($($("[name='checkBoxfabuCourse']:checkbox")[j]).val());
            }
        }
        if(this.cUfabuCourseIdsArr.length==0){
            $("#alertTip").html("请选择待发布的课程!");
            $('#alertWrap').modal('show');
            return;
        }
        $('.fabuModelBtn').hide();
        $('.fabuingModelBtn').show();
        let str=this.cUfabuCourseIdsArr.join();
        this.directorService.releaseCourse(this.cUfabuCourseIdsArr.join())
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('发布课程');
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            if(resData.successful==true && resData.result==true){
                $('.fabuingModelBtn').hide();
                $('.fabuModelBtn').show();
                $("#alertSuccessTip").html('发布成功!');
                $('#alertSuccessWrap').modal('show');
                setTimeout(()=> {
                    $('#alertSuccessWrap').modal('hide');
                    _that.directorService.changeReleaseStatus(_that.cUfabuCourseIdsArr.join())
                    .subscribe(data =>{
                        console.log('改变已发布课程的状态');
                        console.log(data);
                        _that.getBasicInfo();
                        _that.getFenpeiMeetCourseList();
                        let zhsId=$(".cUzhuanyuanSelect").val();
                        if(zhsId=="-1"){
                            zhsId="";
                        }
                        _that.getWeekPersonInfo(_that.showSchedule,_that.currentWeek,zhsId);
                    });
                }, 1000);
            }else{
                $('.fabuingModelBtn').hide();
                $('.fabuModelBtn').show();
                $("#alertTip").html("发布失败!");
                $('#alertWrap').modal('show');
            }
        });
    }

    private cUupdateRecruid:any;
    public dir_cUsupdatecheduleName:any;
    public dir_cUupdatescheduleStartTime:any;
    public dir_cUupdatescheduleEndTime:any;
    public dir_cUupdatescheduleDeadlineTime:any;

    initupdateKebiaoTimePick(){
        setTimeout(()=>{
            $("#cUscheduleStartTime").datepicker({
                autoclose: true
            });
            $("#cUscheduleEndTime").datepicker({
                autoclose: true
            });
            $("#cUscheduleDeadlineTime").datepicker({
                autoclose: true
            });
        },1000);
    }

    //修改课表信息
    updateSchedule(){
        this.directorService.updateSchedule(this.cUupdateRecruid,this.showSchedule,this.dir_cUsupdatecheduleName,this.dir_cUupdatescheduleStartTime,this.dir_cUupdatescheduleEndTime,this.dir_cUupdatescheduleDeadlineTime)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("进行中 修改课表信息");
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            if(resData.successful){
                this.getSchedule();
                if(this.isCuKebiao){
                    this.scheduleSwitch('1');
                }else{
                    this.scheduleSwitch('2');
                }
                //this.initCurrentSchedule(this.currentScheduleId);
                $('#cUupdateScheduleModal').modal('hide');
            }
        });
    }

    getScheduleInfoFindByid(){
        this.directorService.getScheduleInfoFindByid(this.showSchedule)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("进行中 根据id查询课表信息");
            console.log(data);
            this.cUupdateRecruid=data.result.recruitId;
            this.dir_cUsupdatecheduleName=data.result.name;
            this.dir_cUupdatescheduleStartTime=moment(data.result.startTime).format('YYYY-MM-DD');
            this.dir_cUupdatescheduleEndTime=moment(data.result.endTime).format('YYYY-MM-DD');
            this.dir_cUupdatescheduleDeadlineTime=moment(data.result.deadlineTime).format('YYYY-MM-DD');
            this.initupdateKebiaoTimePick();
        });
    }

     //新建课表
    public dir_newscheduleName:any;
    public dir_newscheduleStartTime:any;
    public dir_newscheduleEndTime:any;
    public dir_newscheduleDeadlineTime:any;
    private newscheduleRemarks:any;
    private newrecruitId:any;
    private newrecruitName:any;
    public dir_newsemesterList:any;

    //初始化新建课表的时间控件
    initnewKebiaoDateandTimePick(){
        $("#scheduleStartTime").datepicker({
            autoclose: true
        });
        $("#scheduleEndTime").datepicker({
            autoclose: true
        });
        $("#scheduleDeadlineTime").datepicker({
            autoclose: true
        });
    }

    //新建课表时 查询学期列表
    getnewSemesterList(){
        this.directorService.getSemesterList()
            .subscribe(data =>{
                if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                    this.router.navigateByUrl('login');
                    return;
                }
                console.log('学期');
                console.log(data);
                this.dir_newsemesterList=data.result;
            });
    }
    //新建课表
    createSchedule(){
        this.dir_newscheduleStartTime=$("#scheduleStartTime").val();
        this.dir_newscheduleEndTime=$("#scheduleEndTime").val();
        this.dir_newscheduleDeadlineTime=$("#scheduleDeadlineTime").val();
        this.newrecruitId=$("#recruitId").val();
        this.newrecruitName=$("#recruitId").find("option:selected").text();
        this.directorService.createSchedule(this.dir_newscheduleName,this.newrecruitId,this.newrecruitName,
        this.dir_newscheduleStartTime,this.dir_newscheduleEndTime,this.dir_newscheduleDeadlineTime,this.newscheduleRemarks)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            if(resData.successful){
                $('#addScheduleModal').modal('hide');
                this.getSchedule();
                this.dir_newscheduleStartTime="";
                this.dir_newscheduleEndTime="";
                this.dir_newscheduleDeadlineTime="";
                this.newrecruitId="";
                this.dir_newscheduleName="";
            }else{
                $("#alertTip").html(resData.errorMsg);
                $('#alertWrap').modal('show');
            }
        });
    }

    public dir_isHavePptArr=['不展示PPT','不展示PPT','展示PPT'];
    private liveDetailInfoRes:any;
    public dir_liveDetailInfo:any;
    public dir_liveDetailBaseInfo:any;
    public dir_liveDetailCelueInfo:any;
    public dir_liveDetailZhuanyuanInfo:any;
    public dir_liveDetailZhuanYuanInfo:any;
    public dir_isgetLiveDetailInfoTrue=false;
    public dir_liveDetailInfozhuRoom:any[]=[];
    public dir_liveDetailInfohuRoom:any[]=[];
    public dir_yuyinUrl='';
    public dir_liveUrl="";
    public dir_hTowerUrl="";
    private meetZuzhiTypeArr=['','主题授课型','嘉宾访谈型','学生汇报型'];
    private meetZuzhiTypetoShow:any;
    public dir_isHaveHudong=false;
    public dir_isHavehuSchool=false;
    public dir_liveDetailInfotype1=false;
    public dir_liveDetailInfotype2=false;
    public dir_liveDetailInfotype3=false;
    private timeToshow:any;

    getDetailInfo(id:any,lcId:any,ele:any){
        if(!$(ele).hasClass('week8-click')){
            return;
        }
        this.directorService.getLiveDetailDto(id)
        .subscribe(data => {
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获取见面课详情 弹框');
            console.log(eval('('+data['_body']+')'));
            this.dir_liveDetailInfozhuRoom=[];
            this.dir_liveDetailInfohuRoom=[];
            this.liveDetailInfoRes=eval('('+data['_body']+')');
            if(this.liveDetailInfoRes.successful){
                this.dir_liveDetailInfo=this.liveDetailInfoRes.result;
                this.dir_liveDetailBaseInfo=this.dir_liveDetailInfo.baseInfo;
                this.dir_liveDetailCelueInfo=this.dir_liveDetailInfo.strategyInfo;
                this.dir_liveDetailZhuanyuanInfo=this.dir_liveDetailInfo.zhuanYuanInfo;
                this.dir_liveDetailZhuanYuanInfo=this.dir_liveDetailInfo.zhiBanInfo;
                let timer=this.dir_liveDetailBaseInfo.endTime-this.dir_liveDetailBaseInfo.startTime;
                this.timeToshow=Math.floor(timer/60000);
                if(this.dir_liveDetailCelueInfo==null || this.dir_liveDetailCelueInfo.type=='' || this.dir_liveDetailCelueInfo.type==undefined || this.dir_liveDetailCelueInfo.type==null){
                    this.dir_isHaveHudong=false;
                }else{
                    this.dir_isHaveHudong=true;
                    this.meetZuzhiTypetoShow=this.meetZuzhiTypeArr[this.dir_liveDetailCelueInfo.type];
                    if(this.dir_liveDetailCelueInfo.type==1){
                        this.dir_liveDetailInfotype1=true;
                        this.dir_liveDetailInfotype2=false;
                        this.dir_liveDetailInfotype3=false;
                    }else if(this.dir_liveDetailCelueInfo.type==2){
                        this.dir_liveDetailInfotype2=true;
                        this.dir_liveDetailInfotype1=false;
                        this.dir_liveDetailInfotype3=false;
                    }else{
                        this.dir_liveDetailInfotype3=true;
                        this.dir_liveDetailInfotype1=false;
                        this.dir_liveDetailInfotype2=false;
                    }
                    if(this.dir_liveDetailCelueInfo.description == "" || this.dir_liveDetailCelueInfo.description ==null || this.dir_liveDetailCelueInfo.description==undefined){
                        this.dir_liveDetailCelueInfo.description="暂无";
                    }
                }
                for(var i=0;i<this.dir_liveDetailInfo.liveRooms.length;i++){
                    if(this.dir_liveDetailInfo.liveRooms[i].daoboName==null || this.dir_liveDetailInfo.liveRooms[i].daoboName=="" || this.dir_liveDetailInfo.liveRooms[i].daoboName==undefined){
                        this.dir_liveDetailInfo.liveRooms[i].daoboName="—";
                    }
                    if(this.dir_liveDetailInfo.liveRooms[i].daoboPhone==null || this.dir_liveDetailInfo.liveRooms[i].daoboPhone=="" || this.dir_liveDetailInfo.liveRooms[i].daoboPhone==undefined){
                        this.dir_liveDetailInfo.liveRooms[i].daoboPhone="—";
                    }
                    if(this.dir_liveDetailInfo.liveRooms[i].roomTeacherName==null || this.dir_liveDetailInfo.liveRooms[i].roomTeacherName=="" || this.dir_liveDetailInfo.liveRooms[i].roomTeacherName==undefined){
                        this.dir_liveDetailInfo.liveRooms[i].roomTeacherName="—";
                    }
                    if(this.dir_liveDetailInfo.liveRooms[i].roomTeacherPhone==null || this.dir_liveDetailInfo.liveRooms[i].roomTeacherPhone=="" || this.dir_liveDetailInfo.liveRooms[i].roomTeacherPhone==undefined){
                        this.dir_liveDetailInfo.liveRooms[i].roomTeacherPhone="—";
                    }
                    if(this.dir_liveDetailInfo.liveRooms[i].classroomType==0){
                        this.dir_liveDetailInfozhuRoom.push(this.dir_liveDetailInfo.liveRooms[i]);
                    }else{
                        this.dir_liveDetailInfohuRoom.push(this.dir_liveDetailInfo.liveRooms[i]);
                    }
                }
                for(var m=0;m<this.dir_liveDetailInfozhuRoom.length;m++){
                    if(this.dir_liveDetailInfozhuRoom[m].schoolCode=='-999'){
                        this.dir_liveDetailInfozhuRoom[m].schoolName="待定";
                        this.dir_liveDetailInfozhuRoom[m].classroomName="";
                    }else{
                        if(this.dir_liveDetailInfozhuRoom[m].classroomCode=="-888"){
                            this.dir_liveDetailInfozhuRoom[m].classroomName="教室待定";
                        }
                    }
                }
                for(var n=0;n<this.dir_liveDetailInfohuRoom.length;n++){
                    if(this.dir_liveDetailInfohuRoom[n].classroomCode=="-888"){
                        this.dir_liveDetailInfohuRoom[n].classroomName="教室待定";
                    }
                }
                if(this.dir_liveDetailInfohuRoom.length>0){
                    this.dir_isHavehuSchool=true;
                }else{
                   this.dir_isHavehuSchool=false;
                }
                this.dir_liveDetailInfo.liveTypeImg="../../../imgs/liveType"+this.dir_liveDetailBaseInfo.liveType+".png";
                this.dir_hTowerUrl="http://ht.livecourse.com/#/detail/"+lcId;
                if(this.dir_liveDetailBaseInfo.state=='1'){
                    this.dir_liveUrl="";
                }else if(this.dir_liveDetailBaseInfo.state=='2'){
                    this.dir_liveUrl='http://lc.zhihuishu.com/live/live_room.html?liveId='+lcId;
                }else{
                    this.dir_liveUrl='http://lc.zhihuishu.com/live/vod_room.html?liveId='+lcId;
                }
                this.dir_isgetLiveDetailInfoTrue=true;
                setTimeout(()=>{
                    $('#detailInfoPage').modal('show');
                },100);
            }else{
                this.dir_isgetLiveDetailInfoTrue=false;
                setTimeout(()=>{
                    $('#detailInfoPage').modal('hide');
                },300);
                $("#alertTip").html("系统出错！");
                $('#alertWrap').modal('show');
            }
        });
        this.directorService.getZhumuMeettingUrl(lcId)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获取进入语音频道地址');
            console.log(data);
            let resurlData=eval('('+data['_body']+')');
            if(resurlData.successful){
                this.dir_yuyinUrl=resurlData.result.url;
            }else{
                this.dir_yuyinUrl='';
            }
        });
    }

    jumpTolive(){
        if(this.dir_liveUrl==''){
            event.preventDefault();
            $("#alertTip").html("直播未开始!");
            $('#alertWrap').modal('show');
        }
    }

    jumpToyuyin(){
        if(this.dir_yuyinUrl==''){
            event.preventDefault();
            $("#alertTip").html("未找到对应的瞩目会议!");
            $('#alertWrap').modal('show');
        }
    }

    // //跳转到全部课程列表
    // gotoCourseList(sta:any,csta:any){
    //     $($('.treeview')[0]).removeClass('active');
    //     $('.courseLi').addClass('active');
    //     if(csta=='0'){
    //         this.router.navigateByUrl('main/courseList/'+ this.dir_currentScheduleId +'-status');
    //     }else{
    //         this.router.navigateByUrl('main/courseList/'+ this.dir_currentScheduleId +'-6');
    //     }
    // }

    //跳转到已发布见面课列表
    gotoMeetCourseList(){
        $($('.treeview')[0]).removeClass('active');
        $('.courseLi').addClass('active');
        this.router.navigateByUrl('main/meetCourseList/'+ this.showSchedule +'-6');
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



    private maxHeight:any;
    initHeight(){
        if(!this.isSwitchedWeek){
            $('.weekCon')[0].style.height='auto';
            this.maxHeight=$($('.col-xs-week8')[0]).height();
            for(var i=0;i<$('.col-xs-week8').length;i++){
                if($($('.col-xs-week8')[i]).height()>this.maxHeight){
                    this.maxHeight=$($('.col-xs-week8')[i]).height();
                }
            }
            $('.weekCon')[0].style.height=this.maxHeight+20+"px";
            let time=new Date();
            let weekDay=time.getDay();
            if(this.clickCurrentWeekNum==-1){
                if(weekDay==0){
                    $($('.col-xs-week8')[6]).addClass('week8-click');
                }else{
                    $($('.col-xs-week8')[weekDay-1]).addClass('week8-click');
                }
                if(this.isCuKebiao){
                    $('.week8-click').addClass('week8-current');
                }
            }else{
                if(this.clickCurrentWeekNum==6 && weekDay==0){
                    $($('.col-xs-week8')[6]).addClass('week8-click');
                    if(this.isCuKebiao){
                        $('.week8-click').addClass('week8-current');
                    }
                }else if(this.clickCurrentWeekNum+1==weekDay){
                    $($('.col-xs-week8')[weekDay-1]).addClass('week8-click');
                    if(this.isCuKebiao){
                        $('.week8-click').addClass('week8-current');
                    }
                }else{
                    $($('.col-xs-week8')[this.clickCurrentWeekNum]).addClass('week8-click');
                }
            }
        }else{
            $('.weekCon')[0].style.height='auto';
            this.maxHeight=$($('.col-xs-week8')[0]).height();
            for(var i=0;i<$('.col-xs-week8').length;i++){
                if($($('.col-xs-week8')[i]).height()>this.maxHeight){
                    this.maxHeight=$($('.col-xs-week8')[i]).height();
                }
            }
            $('.weekCon')[0].style.height=this.maxHeight+20+"px";
            if(this.dir_cUweekKeep==this.cUweek){
                if(this.isCuKebiao){
                    let time=new Date();
                    let weekDay=time.getDay();
                    if(weekDay==0){
                        $($('.col-xs-week8')[6]).addClass('week8-current');
                    }else{
                        $($('.col-xs-week8')[weekDay-1]).addClass('week8-current');
                    }
                }
            }else{
                $('.week8-current').removeClass('week8-current');
            }
        }
    }

    ngOnInit(): void {
        // this.getSchedule();
        // setTimeout(()=>{
        //     this.initnewKebiaoDateandTimePick();
        //     this.getnewSemesterList();
        // },1000);
        if(this.getCookie('role')=="4"){
            this.getSchedule();
            var _that=this;
            setTimeout(()=>{
                this.initnewKebiaoDateandTimePick();
                this.getnewSemesterList();
                $('#cUfenpei').on('hidden.bs.modal', function (e: any) {
                    _that.cUfenpeizhuanyaunSelectId=null;
                    _that.tijiaoFenpei=[];
                    _that.returnList=[];
                    _that.dir_cUfenpeiCourseSva="";
                });
            },1000);
        }else{
            this.router.navigateByUrl('login');
        }
    }
}
