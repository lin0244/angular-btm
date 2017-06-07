import {  Component,OnInit } from '@angular/core';
import { GuaranteeService } from './guarantee.service';
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
  selector: 'app-guarantee',
  templateUrl: './guarantee.component.html',
  styleUrls: ['./guarantee.component.css'],
  providers: [GuaranteeService]
})
export class GuaranteeComponent implements OnInit {
  constructor(private guaranteeService: GuaranteeService,public router: Router) { }

    private currents=false;
    private notStarts=false;
    public gua_isHaveKebiao=true;
    private allScheduleList:any;
    private currentScheduleId:any;
    private notStartScheduleId:any;
    //获取所有课表
    getSchedule(){
        this.guaranteeService.getSchedule()
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
                this.gua_isHaveKebiao=false;
                return;
            }else{
                this.gua_isHaveKebiao=true;
            }
            if(this.allScheduleList.find((schedule:any) => schedule.status =='1')!=undefined){
                this.currentScheduleId=this.allScheduleList.find((schedule:any) => schedule.status =='1').id;
                this.currents=true;
                this.initSchedule(this.currentScheduleId,'1');
            }
            if(this.allScheduleList.find((schedule:any) => schedule.status =='2')!=undefined){
                this.notStartScheduleId=this.allScheduleList.find((schedule:any) => schedule.status =='2').id;
                this.notStarts=true;
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

    private showSchedule:any;
    private isCuKebiao=true;
    //课表切换event
    scheduleSwitch(flag:any){
        if(flag=='1'){
            this.isCuKebiao=true;
            $('.nSkebiaoBtn').removeClass('kebiaoactive');
            $('.cUkebiaoBtn').addClass('kebiaoactive');
            this.showSchedule=this.currentScheduleId;
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
        this.getZhiBanPersonInfor(this.showSchedule);
        this.getWeekZhiBanPersonInfo(this.showSchedule,'','');
        this.cutScheduleByWeek(this.showSchedule);
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

    //获取课表名
    private cUkebiaoName='';
    private nSkebiaoName='';
    schedulecourseinfor(id:any,sta:any){
        if(sta=='1'){
            this.guaranteeService.schedulecourseinfor(id)
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
            this.guaranteeService.schedulecourseinfor(id)
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

    private zhibanPeopleList:any;
    private owlFlag=false;
    //获取值班人
   getZhiBanPersonInfor(id:any){
        this.guaranteeService.getZhiBanPersonInfor(id)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('值班人信息');
            console.log(data);
            this.zhibanPeopleList=data.result;
            $('#owl-demo').hide();
            setTimeout(()=>{
                var owl = $("#owl-demo");
                if(this.owlFlag){
                    owl.data('owlCarousel').destroy();
                    $('.owl-wrapper').remove();
                    $("#owl-demo").owlCarousel({
                        navigation: true,
                        navigationText: [
                        "<i class='fa  fa-chevron-left'></i>",
                        "<i class='fa fa-chevron-right'></i>"
                        ],
                        //Call beforeInit callback, elem parameter point to $("#owl-demo")
                        beforeInit : function(elem:any){
                        }
                    });
                }else{
                    this.owlFlag=true;
                    $("#owl-demo").owlCarousel({
                        navigation: true,
                        navigationText: [
                        "<i class='fa  fa-chevron-left'></i>",
                        "<i class='fa fa-chevron-right'></i>"
                        ],
                        //Call beforeInit callback, elem parameter point to $("#owl-demo")
                        beforeInit : function(elem:any){
                        }
                    });
                }
                $('#owl-demo').show();
            },300);
        });
    }

    private uNfenPeiredColorArr:any[]=[];
    private shijianDuanArr:any;
    private shijianDuan:any;
    private cUweek:number;
    private cUweekKeep:number;
    private isGetWeek=false;
    private zhibanInfo:any;
    private monZhiban:dayLiveObj={
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
    private tueZhiban:dayLiveObj={
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
    private wedZhiban:dayLiveObj={
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
    private thuZhiban:dayLiveObj={
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
    private friZhiban:dayLiveObj={
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
    private satZhiban:dayLiveObj={
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
    private sunZhiban:dayLiveObj={
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
    //获取某周见面课值班人员分配情况信息
    getWeekZhiBanPersonInfo(id:any,week:any,zhsId:any){
        this.guaranteeService.getWeekZhiBanPersonInfo(id,week,zhsId)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('进行中 见面课值班人员分配情况');
            console.log(data);
            let resData=eval('('+data['_body']+')');
            this.zhibanInfo=resData.result;
            if(this.isGetWeek){

            }else{
                for(var i=0;i<=7;i++){
                    if(i in this.zhibanInfo){
                        if(this.zhibanInfo[i].currentweek!=undefined){
                            this.cUweek=this.zhibanInfo[i].currentweek;
                            this.cUweekKeep=this.zhibanInfo[i].currentweek;
                        }
                    }
                }
                this.isGetWeek=true;
            };
            this.uNfenPeiredColorArr=[];
            if(this.zhibanInfo['0']!=undefined){
                this.monZhiban=this.zhibanInfo["0"];
                for(var i=0;i<this.monZhiban.amtimeperiods.length;i++){
                    if(this.monZhiban.amtimeperiods[i].zhsId==null || this.monZhiban.amtimeperiods[i].zhsId==undefined){
                        this.monZhiban.amtimeperiods[i].color="#fff";
                    }
                    this.monZhiban.amtimeperiods[i].title=this.monZhiban.amtimeperiods[i].courseName +'\n'+ this.monZhiban.amtimeperiods[i].liveName;
                }
                for(var i=0;i<this.monZhiban.pmtimeperiods.length;i++){
                    if(this.monZhiban.pmtimeperiods[i].zhsId==null || this.monZhiban.pmtimeperiods[i].zhsId==undefined){
                        this.monZhiban.pmtimeperiods[i].color="#fff";
                    }
                    this.monZhiban.pmtimeperiods[i].title=this.monZhiban.pmtimeperiods[i].courseName +'\n'+ this.monZhiban.pmtimeperiods[i].liveName;
                }
                for(var i=0;i<this.monZhiban.nighttimeperiods.length;i++){
                    if(this.monZhiban.nighttimeperiods[i].zhsId==null || this.monZhiban.nighttimeperiods[i].zhsId==undefined){
                        this.monZhiban.nighttimeperiods[i].color="#fff";
                    }
                    this.monZhiban.nighttimeperiods[i].title=this.monZhiban.nighttimeperiods[i].courseName +'\n'+ this.monZhiban.nighttimeperiods[i].liveName;
                }
                if(this.monZhiban.amtimeperiods.find((live:any)=>live.zhsId==null)!=undefined || this.monZhiban.pmtimeperiods.find((live:any)=>live.zhsId==null)!=undefined || this.monZhiban.nighttimeperiods.find((live:any)=>live.zhsId==null)!=undefined){
                    this.uNfenPeiredColorArr.push('0');
                }
            }else{
                this.monZhiban={
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
            if(this.zhibanInfo['1']!=undefined){
                this.tueZhiban=this.zhibanInfo["1"];
                for(var i=0;i<this.tueZhiban.amtimeperiods.length;i++){
                    if(this.tueZhiban.amtimeperiods[i].zhsId==null || this.tueZhiban.amtimeperiods[i].zhsId==undefined){
                        this.tueZhiban.amtimeperiods[i].color="#fff";
                    }
                    this.tueZhiban.amtimeperiods[i].title=this.tueZhiban.amtimeperiods[i].courseName +'\n'+ this.tueZhiban.amtimeperiods[i].liveName;
                }
                for(var i=0;i<this.tueZhiban.pmtimeperiods.length;i++){
                    if(this.tueZhiban.pmtimeperiods[i].zhsId==null || this.tueZhiban.pmtimeperiods[i].zhsId==undefined){
                        this.tueZhiban.pmtimeperiods[i].color="#fff";
                    }
                    this.tueZhiban.pmtimeperiods[i].title=this.tueZhiban.pmtimeperiods[i].courseName +'\n'+ this.tueZhiban.pmtimeperiods[i].liveName;
                }
                for(var i=0;i<this.tueZhiban.nighttimeperiods.length;i++){
                    if(this.tueZhiban.nighttimeperiods[i].zhsId==null || this.tueZhiban.nighttimeperiods[i].zhsId==undefined){
                        this.tueZhiban.nighttimeperiods[i].color="#fff";
                    }
                    this.tueZhiban.nighttimeperiods[i].title=this.tueZhiban.nighttimeperiods[i].courseName +'\n'+ this.tueZhiban.nighttimeperiods[i].liveName;
                }
                if(this.tueZhiban.amtimeperiods.find((live:any)=>live.zhsId==null)!=undefined || this.tueZhiban.pmtimeperiods.find((live:any)=>live.zhsId==null)!=undefined || this.tueZhiban.nighttimeperiods.find((live:any)=>live.zhsId==null)!=undefined){
                    this.uNfenPeiredColorArr.push('1');
                }
            }else{
                this.tueZhiban={
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
            if(this.zhibanInfo['2']!=undefined){
                this.wedZhiban=this.zhibanInfo["2"];
                for(var i=0;i<this.wedZhiban.amtimeperiods.length;i++){
                    if(this.wedZhiban.amtimeperiods[i].zhsId==null || this.wedZhiban.amtimeperiods[i].zhsId==undefined){
                        this.wedZhiban.amtimeperiods[i].color="#fff";
                    }
                    this.wedZhiban.amtimeperiods[i].title=this.wedZhiban.amtimeperiods[i].courseName +'\n'+ this.wedZhiban.amtimeperiods[i].liveName;
                }
                for(var i=0;i<this.wedZhiban.pmtimeperiods.length;i++){
                    if(this.wedZhiban.pmtimeperiods[i].zhsId==null || this.wedZhiban.pmtimeperiods[i].zhsId==undefined){
                        this.wedZhiban.pmtimeperiods[i].color="#fff";
                    }
                    this.wedZhiban.pmtimeperiods[i].title=this.wedZhiban.pmtimeperiods[i].courseName +'\n'+ this.wedZhiban.pmtimeperiods[i].liveName;
                }
                for(var i=0;i<this.wedZhiban.nighttimeperiods.length;i++){
                    if(this.wedZhiban.nighttimeperiods[i].zhsId==null || this.wedZhiban.nighttimeperiods[i].zhsId==undefined){
                        this.wedZhiban.nighttimeperiods[i].color="#fff";
                    }
                    this.wedZhiban.nighttimeperiods[i].title=this.wedZhiban.nighttimeperiods[i].courseName +'\n'+ this.wedZhiban.nighttimeperiods[i].liveName;
                }
                if(this.wedZhiban.amtimeperiods.find((live:any)=>live.zhsId==null)!=undefined || this.wedZhiban.pmtimeperiods.find((live:any)=>live.zhsId==null)!=undefined || this.wedZhiban.nighttimeperiods.find((live:any)=>live.zhsId==null)!=undefined){
                    this.uNfenPeiredColorArr.push('2');
                }
            }else{
                this.wedZhiban={
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
            if(this.zhibanInfo['3']!=undefined){
                this.thuZhiban=this.zhibanInfo["3"];
                for(var i=0;i<this.thuZhiban.amtimeperiods.length;i++){
                    if(this.thuZhiban.amtimeperiods[i].zhsId==null || this.thuZhiban.amtimeperiods[i].zhsId==undefined){
                        this.thuZhiban.amtimeperiods[i].color="#fff";
                    }
                    this.thuZhiban.amtimeperiods[i].title=this.thuZhiban.amtimeperiods[i].courseName +'\n'+ this.thuZhiban.amtimeperiods[i].liveName;
                }
                for(var i=0;i<this.thuZhiban.pmtimeperiods.length;i++){
                    if(this.thuZhiban.pmtimeperiods[i].zhsId==null || this.thuZhiban.pmtimeperiods[i].zhsId==undefined){
                        this.thuZhiban.pmtimeperiods[i].color="#fff";
                    }
                    this.thuZhiban.pmtimeperiods[i].title=this.thuZhiban.pmtimeperiods[i].courseName +'\n'+ this.thuZhiban.pmtimeperiods[i].liveName;
                }
                for(var i=0;i<this.thuZhiban.nighttimeperiods.length;i++){
                    if(this.thuZhiban.nighttimeperiods[i].zhsId==null || this.thuZhiban.nighttimeperiods[i].zhsId==undefined){
                        this.thuZhiban.nighttimeperiods[i].color="#fff";
                    }
                    this.thuZhiban.nighttimeperiods[i].title=this.thuZhiban.nighttimeperiods[i].courseName +'\n'+ this.thuZhiban.nighttimeperiods[i].liveName;
                }
                if(this.thuZhiban.amtimeperiods.find((live:any)=>live.zhsId==null)!=undefined || this.thuZhiban.pmtimeperiods.find((live:any)=>live.zhsId==null)!=undefined || this.thuZhiban.nighttimeperiods.find((live:any)=>live.zhsId==null)!=undefined){
                    this.uNfenPeiredColorArr.push('3');
                }
            }else{
                this.thuZhiban={
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
            if(this.zhibanInfo['4']!=undefined){
                this.friZhiban=this.zhibanInfo["4"];
                for(var i=0;i<this.friZhiban.amtimeperiods.length;i++){
                    if(this.friZhiban.amtimeperiods[i].zhsId==null || this.friZhiban.amtimeperiods[i].zhsId==undefined){
                        this.friZhiban.amtimeperiods[i].color="#fff";
                    }
                    this.friZhiban.amtimeperiods[i].title=this.friZhiban.amtimeperiods[i].courseName +'\n'+ this.friZhiban.amtimeperiods[i].liveName;
                }
                for(var i=0;i<this.friZhiban.pmtimeperiods.length;i++){
                    if(this.friZhiban.pmtimeperiods[i].zhsId==null || this.friZhiban.pmtimeperiods[i].zhsId==undefined){
                        this.friZhiban.pmtimeperiods[i].color="#fff";
                    }
                    this.friZhiban.pmtimeperiods[i].title=this.friZhiban.pmtimeperiods[i].courseName +'\n'+ this.friZhiban.pmtimeperiods[i].liveName;
                }
                for(var i=0;i<this.friZhiban.nighttimeperiods.length;i++){
                    if(this.friZhiban.nighttimeperiods[i].zhsId==null || this.friZhiban.nighttimeperiods[i].zhsId==undefined){
                        this.friZhiban.nighttimeperiods[i].color="#fff";
                    }
                    this.friZhiban.nighttimeperiods[i].title=this.friZhiban.nighttimeperiods[i].courseName +'\n'+ this.friZhiban.nighttimeperiods[i].liveName;
                }
                if(this.friZhiban.amtimeperiods.find((live:any)=>live.zhsId==null)!=undefined || this.friZhiban.pmtimeperiods.find((live:any)=>live.zhsId==null)!=undefined || this.friZhiban.nighttimeperiods.find((live:any)=>live.zhsId==null)!=undefined){
                    this.uNfenPeiredColorArr.push('4');
                }
            }else{
                this.friZhiban={
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
            if(this.zhibanInfo['5']!=undefined){
                this.satZhiban=this.zhibanInfo["5"];
                for(var i=0;i<this.satZhiban.amtimeperiods.length;i++){
                    if(this.satZhiban.amtimeperiods[i].zhsId==null || this.satZhiban.amtimeperiods[i].zhsId==undefined){
                        this.satZhiban.amtimeperiods[i].color="#fff";
                    }
                    this.satZhiban.amtimeperiods[i].title=this.satZhiban.amtimeperiods[i].courseName +'\n'+ this.satZhiban.amtimeperiods[i].liveName;
                }
                for(var i=0;i<this.satZhiban.pmtimeperiods.length;i++){
                    if(this.satZhiban.pmtimeperiods[i].zhsId==null || this.satZhiban.pmtimeperiods[i].zhsId==undefined){
                        this.satZhiban.pmtimeperiods[i].color="#fff";
                    }
                    this.satZhiban.pmtimeperiods[i].title=this.satZhiban.pmtimeperiods[i].courseName +'\n'+ this.satZhiban.pmtimeperiods[i].liveName;
                }
                for(var i=0;i<this.satZhiban.nighttimeperiods.length;i++){
                    if(this.satZhiban.nighttimeperiods[i].zhsId==null || this.satZhiban.nighttimeperiods[i].zhsId==undefined){
                        this.satZhiban.nighttimeperiods[i].color="#fff";
                    }
                    this.satZhiban.nighttimeperiods[i].title=this.satZhiban.nighttimeperiods[i].courseName +'\n'+ this.satZhiban.nighttimeperiods[i].liveName;
                }
                if(this.satZhiban.amtimeperiods.find((live:any)=>live.zhsId==null)!=undefined || this.satZhiban.pmtimeperiods.find((live:any)=>live.zhsId==null)!=undefined || this.satZhiban.nighttimeperiods.find((live:any)=>live.zhsId==null)!=undefined){
                    this.uNfenPeiredColorArr.push('5');
                }
            }else{
                this.satZhiban={
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
            if(this.zhibanInfo['6']!=undefined){
                this.sunZhiban=this.zhibanInfo["6"];
                for(var i=0;i<this.sunZhiban.amtimeperiods.length;i++){
                    if(this.sunZhiban.amtimeperiods[i].zhsId==null || this.sunZhiban.amtimeperiods[i].zhsId==undefined){
                        this.sunZhiban.amtimeperiods[i].color="#fff";
                    }
                    this.sunZhiban.amtimeperiods[i].title=this.sunZhiban.amtimeperiods[i].courseName +'\n'+ this.sunZhiban.amtimeperiods[i].liveName;
                }
                for(var i=0;i<this.sunZhiban.pmtimeperiods.length;i++){
                    if(this.sunZhiban.pmtimeperiods[i].zhsId==null || this.sunZhiban.pmtimeperiods[i].zhsId==undefined){
                        this.sunZhiban.pmtimeperiods[i].color="#fff";
                    }
                    this.sunZhiban.pmtimeperiods[i].title=this.sunZhiban.pmtimeperiods[i].courseName +'\n'+ this.sunZhiban.pmtimeperiods[i].liveName;
                }
                for(var i=0;i<this.sunZhiban.nighttimeperiods.length;i++){
                    if(this.sunZhiban.nighttimeperiods[i].zhsId==null || this.sunZhiban.nighttimeperiods[i].zhsId==undefined){
                        this.sunZhiban.nighttimeperiods[i].color="#fff";
                    }
                    this.sunZhiban.nighttimeperiods[i].title=this.sunZhiban.nighttimeperiods[i].courseName +'\n'+ this.sunZhiban.nighttimeperiods[i].liveName;
                }
                if(this.sunZhiban.amtimeperiods.find((live:any)=>live.zhsId==null)!=undefined || this.sunZhiban.pmtimeperiods.find((live:any)=>live.zhsId==null)!=undefined || this.sunZhiban.nighttimeperiods.find((live:any)=>live.zhsId==null)!=undefined){
                    this.uNfenPeiredColorArr.push('6');
                }
            }else{
                this.sunZhiban={
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
            if(this.zhibanInfo['7']!=undefined){
                this.isHaveWeekInfo=true;
                this.shijianDuanArr=this.zhibanInfo['7'].startTimeOneDay.split(',');
                this.shijianDuan=this.initcUshijianDuan(this.shijianDuanArr);
                this.weekToshow=this.initWeekToshow();
                this.initweekBtntoShow();
                this.weekTimeSt=this.shijianDuanArr[0].split('#')[0];
                this.weekTimeEt=this.shijianDuanArr[6].split('#')[1];
                this.gua_infoStToshow=this.weekTimeSt.split(' ')[0].split('-')[1]+'/'+this.weekTimeSt.split(' ')[0].split('-')[2];
                this.gua_infoEtToshow=this.weekTimeEt.split(' ')[0].split('-')[1]+'/'+this.weekTimeEt.split(' ')[0].split('-')[2];
                this.countFeedBackByDateInterval();
                setTimeout(()=>{
                    this.initHeight();
                    for(var j=0;j<$('.col-xs-week8 .fa-user').length;j++){
                        $('.col-xs-week8 .fa-user')[j].style.color="#2570D3";
                        if($($('.col-xs-week8')[j]).hasClass('week8-current')){
                            $('.col-xs-week8 .fa-user')[j].style.color="#fff";
                        }
                    }
                    for(var i=0;i<this.uNfenPeiredColorArr.length;i++){
                        let indexFlag=this.uNfenPeiredColorArr[i];
                        $('.col-xs-week8 .fa-user')[indexFlag].style.color="#F15151";
                    }
                },300);
            }else{
                this.endLiveQuantity=0;
                this.zhibanrenFeedbackQuantity=0;
                this.daoboFeedbackQuantity=0;
                this.liveQuantity=0;
                this.runcommissionFeedbackQuantity=0;
                this.isHaveWeekInfo=false;
            }
            console.log(this.zhibanInfo);
        });
    }

    public gua_infoStToshow:any;
    public gua_infoEtToshow:any;
    private weekTimeSt:any;
    private weekTimeEt:any;
    public gua_todayFeedBack:any;
    public gua_isHaveZhuanyaunfankui=true;
    //获取专员反馈
    findLiveFeedbackInfo(){
        this.guaranteeService.findLiveFeedbackInfo(this.showSchedule,this.weekTimeSt,this.weekTimeEt,'')
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("获取专员反馈");
            console.log(eval('('+data['_body']+')'));
            let resData=eval('('+data['_body']+')');
            this.gua_todayFeedBack=resData.result;
            for(var j=0;j<this.gua_todayFeedBack.length;j++){
                for(var k = j + 1;k<this.gua_todayFeedBack.length;k++){
                    if(this.gua_todayFeedBack[j].createTime>this.gua_todayFeedBack[k].createTime){
                        let change = this.gua_todayFeedBack[j];
                        this.gua_todayFeedBack[j] = this.gua_todayFeedBack[k];
                        this.gua_todayFeedBack[k] = change;
                    }
                }
            };
            this.gua_todayFeedBack.reverse();
            for(var i=0;i<this.gua_todayFeedBack.length;i++){
                if(this.gua_todayFeedBack[i].teacherProblem==null || this.gua_todayFeedBack[i].teacherProblem==undefined){
                    this.gua_todayFeedBack[i].teacherProblem="暂无";
                }
                if(this.gua_todayFeedBack[i].speakerClassroomProblem==null || this.gua_todayFeedBack[i].speakerClassroomProblem==undefined){
                    this.gua_todayFeedBack[i].speakerClassroomProblem="暂无";
                }
                if(this.gua_todayFeedBack[i].interactiveClassroomProblem==null || this.gua_todayFeedBack[i].interactiveClassroomProblem==undefined){
                    this.gua_todayFeedBack[i].interactiveClassroomProblem="暂无";
                }
                if(this.gua_todayFeedBack[i].daoboProblem==null || this.gua_todayFeedBack[i].daoboProblem==undefined){
                    this.gua_todayFeedBack[i].daoboProblem="暂无";
                }
                if(this.gua_todayFeedBack[i].otherProblem==null || this.gua_todayFeedBack[i].otherProblem==undefined){
                    this.gua_todayFeedBack[i].otherProblem="暂无";
                }
                if(this.gua_todayFeedBack[i].feedbackDescription==null || this.gua_todayFeedBack[i].feedbackDescription==undefined){
                    this.gua_todayFeedBack[i].feedbackDescription="暂无";
                }
            }
            if(resData.result.length==0){
                this.gua_isHaveZhuanyaunfankui=false;
            }else{
                this.gua_isHaveZhuanyaunfankui=true;
            }
        });
    }

    public gua_zhibanWeekFeedBack:any;
    public gua_isHaveZhibanfankui=true;
    public bumenType=['','云平台','教室产品','保障','课程运行','工程','其他'];
    public zhibanFeedBackDengji=['','非常严重','严重','一般'];
    public zhibanFeedbackStage=['','课前','课中'];
    public zhibanFeedbackTimeDanwei=['','秒','分'];
    public zhibanFeedbackType=['','直播','互动'];
    //获取值班人反馈
    findZhibanFeedbackInfo(){
        this.guaranteeService.findByTimeAndScheduleId(this.showSchedule,this.weekTimeSt,this.weekTimeEt)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("获取值班人反馈");
            console.log(eval('('+data['_body']+')'));
            let resData=eval('('+data['_body']+')');
            this.gua_zhibanWeekFeedBack=resData.result;
            if(resData.result.length==0){
                this.gua_isHaveZhibanfankui=false;
            }else{
                this.gua_isHaveZhibanfankui=true;
            }
        });
    }

    public gua_zhibanWeekPingfen:any;
    public gua_isHaveZhibanPingfen=true;
    //获取值班人评分
    findByTimeAndScheduleIdZhibanPingfen(){
        this.guaranteeService.findByTimeAndScheduleIdZhibanPingfen(this.showSchedule,this.weekTimeSt,this.weekTimeEt)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("获取值班人评分");
            console.log(eval('('+data['_body']+')'));
            let resData=eval('('+data['_body']+')');
            this.gua_zhibanWeekPingfen=resData.result;
            if(resData.result.length==0){
                this.gua_isHaveZhibanPingfen=false;
            }else{
                this.gua_isHaveZhibanPingfen=true;
            }
        });
    }

    public satisfactAllArr=['','满意','一般','不满意'];
    public paisheInfo=['','有效','一般','无'];
    public keqianzhunbei=['正常','设备运转出现错误','场地环境（黑板/讲台/课桌）不达标','麦克风出现无声/噪声等不良情况','教师课件（PPT，视频等）预演出现问题'];
    public otherDaoboFB=['','互动远程教室声音太小','互动远程学生画面不清楚','互动远程教室声音不连续','互动远程学生画面卡顿','导播切换场景不及时','互动远程学生声音图像不同步','设备不稳定'];
    public gua_daoboFeedbackInfo:any;
    public gua_isHaveDaoboFeedback=true;
    //获取导播反馈
    findWeekDaoboFeedBack(){
        this.guaranteeService.findWeekDaoboFeedBack(this.showSchedule,this.weekTimeSt,this.weekTimeEt)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("获取导播反馈");
            console.log(eval('('+data['_body']+')'));
            let resData=eval('('+data['_body']+')');
            this.gua_daoboFeedbackInfo=resData.result;
            for(var i=0;i<this.gua_daoboFeedbackInfo.length;i++){
                for(var j=0;j<this.gua_daoboFeedbackInfo[i].directeFeedbackList.length;j++){
                    if(this.gua_daoboFeedbackInfo[i].directeFeedbackList[j].preparationBeforeLive!=null && this.gua_daoboFeedbackInfo[i].directeFeedbackList[j].preparationBeforeLive!=""){
                        let typeArr=this.gua_daoboFeedbackInfo[i].directeFeedbackList[j].preparationBeforeLive.split(',');
                        let typeInfo="";
                        this.gua_daoboFeedbackInfo[i].directeFeedbackList[j].preparationBeforeLiveInfoArr=typeArr;
                    }else{
                        this.gua_daoboFeedbackInfo[i].directeFeedbackList[j].preparationBeforeLiveInfoArr=['0'];
                    }
                    if(this.gua_daoboFeedbackInfo[i].directeFeedbackList[j].otherRecommendations!=null && this.gua_daoboFeedbackInfo[i].directeFeedbackList[j].otherRecommendations!=""){
                        let otherArr=this.gua_daoboFeedbackInfo[i].directeFeedbackList[j].otherRecommendations.split(',');
                        let otherinfo="";
                        for(var m=0;m<otherArr.length;m++){
                            if(otherinfo==""){
                                otherinfo+=this.keqianzhunbei[otherArr[m]];
                            }else{
                                otherinfo=otherinfo+';'+this.keqianzhunbei[otherArr[m]];
                            }
                        }
                        this.gua_daoboFeedbackInfo[i].directeFeedbackList[j].otherinfo=otherinfo;
                    }else{
                        this.gua_daoboFeedbackInfo[i].directeFeedbackList[j].otherinfo='暂无';
                    }
                }
            }
            if(resData.result.length==0){
                this.gua_isHaveDaoboFeedback=false;
            }else{
                this.gua_isHaveDaoboFeedback=true;
            }
        });
    }

    private weinxinIds="";
    private weixinTuisongTime=true;;
    //微信推送
    sendHandWechatMsg(){
        if(this.weixinTuisongTime){
            this.weinxinIds="";
            this.weixinTuisongTime=false;
            for(var weekDay in this.zhibanInfo){
                for(var i=0;i<this.zhibanInfo[weekDay].amtimeperiods.length;i++){
                    this.weinxinIds+=this.zhibanInfo[weekDay].amtimeperiods[i].liveId+',';
                }
                for(var m=0;m<this.zhibanInfo[weekDay].pmtimeperiods.length;m++){
                    this.weinxinIds+=this.zhibanInfo[weekDay].pmtimeperiods[m].liveId+',';
                }
                for(var n=0;n<this.zhibanInfo[weekDay].nighttimeperiods.length;n++){
                    this.weinxinIds+=this.zhibanInfo[weekDay].nighttimeperiods[n].liveId+',';
                }
            }
            this.weinxinIds=this.weinxinIds.substring(0,this.weinxinIds.length-i);
            this.guaranteeService.sendHandWechatMsg(this.weinxinIds)
            .subscribe(data =>{
                if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                    this.router.navigateByUrl('login');
                    return;
                }
                console.log('微信推送');
                let resData=eval('('+data['_body']+')');
                console.log(resData);
                if(resData.successful){
                    $("#alertSuccessTip").html('推送成功!');
                    $('#alertSuccessWrap').modal('show');
                    setTimeout(()=>{
                        this.weixinTuisongTime=true;
                    },600000);
                    setTimeout(()=> {
                        $('#alertSuccessWrap').modal('hide');
                    }, 1000);
                }else{
                    $("#alertTip").html(resData.errorMsg);
                    $('#alertWrap').modal('show');
                }
            });
        }else{
            $("#alertTip").html('操作次数过于频繁，请休息十分钟后再试！');
            $('#alertWrap').modal('show');
        }
    }

    private runcommissionFeedbackQuantity=0;
    private zhibanrenScoreQuantity=0;
    private isHaveWeekInfo=true;
    private liveQuantity=0;
    private endLiveQuantity=0;
    private zhibanrenFeedbackQuantity=0;
    private daoboFeedbackQuantity=0;
    //获取见面课进程数据
    countFeedBackByDateInterval(){
        this.guaranteeService.countFeedBackByDateInterval(this.showSchedule,this.weekTimeSt,this.weekTimeEt)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('见面课进程信息');
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            if(resData.result==null){
                this.endLiveQuantity=0;
                this.zhibanrenFeedbackQuantity=0;
                this.daoboFeedbackQuantity=0;
                this.liveQuantity=0;
                this.runcommissionFeedbackQuantity=0;
                this.zhibanrenScoreQuantity=0;
            }else{
                this.endLiveQuantity=resData.result.endLiveQuantity;
                this.zhibanrenFeedbackQuantity=resData.result.zhibanrenFeedbackQuantity;
                this.daoboFeedbackQuantity=resData.result.daoboFeedbackQuantity;
                this.runcommissionFeedbackQuantity=resData.result.runcommissionFeedbackQuantity;
                this.liveQuantity=resData.result.liveQuantity;
                this.zhibanrenScoreQuantity=resData.result.zhibanrenScoreQuantity;
            }
        });
    }

    private weekToshow:any;
    initWeekToshow(){
        if(this.cUweekKeep==this.cUweek){
            return '第'+(this.cUweek+1)+'周（本周）';
        }else if(this.cUweekKeep+1==this.cUweek){
            return '第'+(this.cUweek+1)+'周（下周）';
        }else{
            return '第'+(this.cUweek+1)+'周 ';
        }
    }

    private weekArr:any[]=[];
    private allWeekNum:any;
    //切割周 获取总周数与对应时间段
    cutScheduleByWeek(id:any){
      if(this.isCuKebiao){
          this.guaranteeService.cutScheduleByWeek(id)
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
          this.guaranteeService.getScheduleInfoFindByid(id)
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
        if(this.cUweekKeep==this.cUweek){
            this.oldWeekShow='上周';
            this.newWeekShow='下周';
        }else if(this.cUweekKeep+1==this.cUweek){
            this.oldWeekShow='本周';
            this.newWeekShow='第'+ (this.cUweek+2) +'周';
        }else if(this.cUweekKeep-1==this.cUweek){
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

    private currentzhsId='';
    private currentzhsIdArr:any[]=[];
    //切换值班人
    switchZhibanPeople(id:any){
        if($.inArray(id,this.currentzhsIdArr)==-1){
            $("#"+id).addClass('zhibanpeopleCheck');
            this.currentzhsIdArr.push(id);
        }else{
            $("#"+id).removeClass('zhibanpeopleCheck');
            this.currentzhsIdArr.splice($.inArray(id,this.currentzhsIdArr), 1);
        }
        this.currentzhsId=this.currentzhsIdArr.join();
        this.getWeekZhiBanPersonInfo(this.showSchedule,this.cUweek,this.currentzhsId);
    }

    private isSwitchedWeek=false;
    //切换周（加、减）
    switchWeek(flag:any){
        if(flag=='1'){
            this.isSwitchedWeek=true;
            this.cUweek++;
            this.getWeekZhiBanPersonInfo(this.showSchedule,this.cUweek,this.currentzhsId);
        }
        if(flag=='0'){
            this.isSwitchedWeek=true;
            if(this.cUweek<=0){
                $("#alertTip").html('已经是当前阶段第一周了!');
                $('#alertWrap').modal('show');
                return;
            }else{
                this.cUweek--;
                this.getWeekZhiBanPersonInfo(this.showSchedule,this.cUweek,this.currentzhsId);
            }
        }
    }

    private cUfenpeiLiveInfo:any;
    private cUgetStartTime:any;
    private cUgetEndTime:any;

    //获取一段时间内导播、值班人
    getZhibanDaobo(flag:any){
        if(flag=='0'){
            this.cUgetStartTime=this.shijianDuanArr[0].split('#')[0];
            this.cUgetEndTime=this.shijianDuanArr[0].split('#')[1];
        }
        if(flag=='1'){
            this.cUgetStartTime=this.shijianDuanArr[1].split('#')[0];
            this.cUgetEndTime=this.shijianDuanArr[1].split('#')[1];
        }
        if(flag=='2'){
            this.cUgetStartTime=this.shijianDuanArr[2].split('#')[0];
            this.cUgetEndTime=this.shijianDuanArr[2].split('#')[1];
        }
        if(flag=='3'){
            this.cUgetStartTime=this.shijianDuanArr[3].split('#')[0];
            this.cUgetEndTime=this.shijianDuanArr[3].split('#')[1];
        }
        if(flag=='4'){
            this.cUgetStartTime=this.shijianDuanArr[4].split('#')[0];
            this.cUgetEndTime=this.shijianDuanArr[4].split('#')[1];
        }
        if(flag=='5'){
            this.cUgetStartTime=this.shijianDuanArr[5].split('#')[0];
            this.cUgetEndTime=this.shijianDuanArr[5].split('#')[1];
        }
        if(flag=='6'){
            this.cUgetStartTime=this.shijianDuanArr[6].split('#')[0];
            this.cUgetEndTime=this.shijianDuanArr[6].split('#')[1];
        }
        this.guaranteeService.getSafeLeaderOneDayLive(this.cUgetStartTime,this.cUgetEndTime,this.showSchedule)
        .subscribe(data =>{
            console.log('获取一段时间内导播、值班人');
            console.log(eval('('+data['_body']+')'));
            let resDate=eval('('+data['_body']+')');
            let info=resDate.result;
            this.getRoomDaoboDetail(info);
            setTimeout(()=> {
                $(".nano").nanoScroller();
                $(".nano").nanoScroller({ preventPageScrolling: true });
            }, 500);
        });
    }

    private cUroomDaoboDetailList:any[]=[];
    private cUdaoboListArr:any[]=[];

    //获取导播人员信息
    getRoomDaoboDetail(info:any){
        var _that=this;
        var chuanInfo=info;
        _that.cUdaoboListArr=[];
        _that.cUroomDaoboDetailList=[];
        _that.guaranteeService.getRoomDaoboDetail()
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获取导播人员信息');
            let resData = eval('('+data['_body']+')');
            console.log(resData);
            _that.cUdaoboListArr = resData.result;
            for(var i=0;i<chuanInfo.length;i++){
                if(chuanInfo[i].classroomCode!=null && chuanInfo[i].classroomCode!='' && chuanInfo[i].classroomCode!=" " && chuanInfo[i].classroomCode!='-888' && chuanInfo[i].schoolName!='待定' && chuanInfo[i].schoolName!=null && chuanInfo[i].schoolName!=""){
                    _that.cUroomDaoboDetailList.push(_that.cUdaoboListArr);
                }else{
                    let arrEmpty:any[]=[];
                    _that.cUroomDaoboDetailList.push(arrEmpty);
                }
                if(chuanInfo[i].classroomCode=='-888'){
                    if(chuanInfo[i].schoolName==null || chuanInfo[i].schoolName==""){
                        chuanInfo[i].schoolName="待定";
                        chuanInfo[i].classroomName="";
                    }else{
                        chuanInfo[i].classroomName="教室待定";
                    }
                }
            }
            console.log(_that.cUroomDaoboDetailList);
            _that.cUfenpeiLiveInfo=chuanInfo;
            setTimeout(()=>{
                for(var i=0;i<_that.cUfenpeiLiveInfo.length;i++){
                    $($('.cUdaoboSelect')[i]).unbind();
                    $($('.cUdaoboSelect')[i]).select2();
                    $($('.cUzhibanSelect')[i]).val(_that.cUfenpeiLiveInfo[i].zhibanrenZhsId).change();
                    $($('.cUdaoboSelect')[i]).val(_that.cUfenpeiLiveInfo[i].daoboZhsId).change();
                    $($('.cUdaoboSelect')[i]).on('select2:select', function (evt:any) {
                        let zhsId=$(this).val();
                        let liveId=$(this).attr('id');
                        _that.findConflict(liveId,zhsId,$(this));
                    });
                }
            },300);
            console.log(_that.cUfenpeiLiveInfo);
        });
    }

    private daoboSelArr:any[]=[];
    private conflictDaoboArr:any[]=[];
    private conflictPostLiveObj:any;
    //校验分配导播冲突
    findConflict(lid:any,id:any,domE:any){
        if(id==""){
            return;
        }
        this.daoboSelArr=[];
        this.conflictDaoboArr=[];
        for(var i=0;i<this.cUfenpeiLiveInfo.length;i++){
            let liveTime={
                startTime:this.cUfenpeiLiveInfo[i].startTime,
                endTime:this.cUfenpeiLiveInfo[i].endTime,
                liveName:this.cUfenpeiLiveInfo[i].liveName,
                courseName:this.cUfenpeiLiveInfo[i].courseName,
                zhsId:$($('.cUdaoboSelect option:selected')[i]).val()
            };
            this.daoboSelArr.push(liveTime);
        }
        for(var m=0;m<this.daoboSelArr.length;m++){
            if(this.daoboSelArr[m].zhsId==id){
                this.conflictDaoboArr.push(this.daoboSelArr[m]);
            }
        }
        if(this.conflictDaoboArr.length>1){
            for(var j=0;j<this.conflictDaoboArr.length-1;j++){
                for(var k=j+1;k<this.conflictDaoboArr.length;k++){
                    if(this.conflictDaoboArr[j].startTime>=this.conflictDaoboArr[k].startTime && this.conflictDaoboArr[j].startTime<this.conflictDaoboArr[k].endTime){
                        let errorMsg='安排的导播存在时间冲突，请重新选择！'+'冲突的见面课为：'+this.conflictDaoboArr[j].liveName +'&nbsp;&nbsp;和&nbsp;&nbsp;'+this.conflictDaoboArr[k].liveName;
                        domE.val("").change();
                        $("#alertTip").html(errorMsg);
                        $('#alertWrap').modal('show');
                    }else if(this.conflictDaoboArr[j].endTime>this.conflictDaoboArr[k].startTime && this.conflictDaoboArr[j].endTime<=this.conflictDaoboArr[k].endTime){
                        let errorMsg='安排的导播存在时间冲突，请重新选择！'+'冲突的见面课为：'+this.conflictDaoboArr[j].liveName +'&nbsp;&nbsp;和&nbsp;&nbsp;'+this.conflictDaoboArr[k].liveName;
                        domE.val("").change();
                        $("#alertTip").html(errorMsg);
                        $('#alertWrap').modal('show');
                    }else if(this.conflictDaoboArr[j].startTime<=this.conflictDaoboArr[k].startTime && this.conflictDaoboArr[j].endTime>=this.conflictDaoboArr[k].endTime){
                        let errorMsg='安排的导播存在时间冲突，请重新选择！'+'冲突的见面课为：'+this.conflictDaoboArr[j].liveName +'&nbsp;&nbsp;和&nbsp;&nbsp;'+this.conflictDaoboArr[k].liveName;
                        domE.val("").change();
                        $("#alertTip").html(errorMsg);
                        $('#alertWrap').modal('show');
                    }else{
                    }
                }
            }
        }
        this.conflictPostLiveObj=this.cUfenpeiLiveInfo.find((live:any)=>live.id==lid);
        this.guaranteeService.daobaoConflictConfirm(this.conflictPostLiveObj.startTime,this.conflictPostLiveObj.endTime,id,lid)
            .subscribe(data =>{
                console.log('校验导播分配是否冲突！');
                console.log(eval('('+data['_body']+')'));
                let resData=eval('('+data['_body']+')');
                if(resData.successful){
                    if(resData.result=='' || resData.result==null || resData.result==undefined){
                    }else{
                        let errorMsg="安排的导播存在时间冲突，请重新选择！"+resData.result;
                        domE.val("").change();
                        $("#alertTip").html(errorMsg);
                        $('#alertWrap').modal('show');
                    }
                }else{
                    console.log("校验失败！");
                }
            });
    }

    private cUfenpeiPostArr:any[]=[];
    //保障主管分配值班人员、导播
    assignZhibanrenDaobo(){
        var _that=this;
        this.cUfenpeiPostArr=[];
        for(var i=0;i<this.cUfenpeiLiveInfo.length;i++){
            let fenpeiObj={
                classroomCode:this.cUfenpeiLiveInfo[i].classroomCode,
                liveId:this.cUfenpeiLiveInfo[i].id
            };
            this.cUfenpeiPostArr.push(fenpeiObj);
        }
        for(var i=0;i<$('.cUzhibanSelect').length;i++){
            this.cUfenpeiPostArr[i].zhibanrenZhsId=$($('.cUzhibanSelect')[i]).val();
        }
        for(var i=0;i<$('.cUdaoboSelect').length;i++){
            this.cUfenpeiPostArr[i].daoboZhsId=$($('.cUdaoboSelect option:selected')[i]).val();
            if(this.cUfenpeiPostArr[i].daoboZhsId=="" || this.cUfenpeiPostArr[i].daoboZhsId==null){
                this.cUfenpeiPostArr[i].daoboEmail="";
                this.cUfenpeiPostArr[i].daoboPhone="";
                this.cUfenpeiPostArr[i].daoboUserName="";
            }else{
                this.cUfenpeiPostArr[i].daoboEmail=this.cUdaoboListArr.find((daobo:any) => daobo.zhsId ==this.cUfenpeiPostArr[i].daoboZhsId).email;
                this.cUfenpeiPostArr[i].daoboPhone=this.cUdaoboListArr.find((daobo:any) => daobo.zhsId ==this.cUfenpeiPostArr[i].daoboZhsId).mobile;
                this.cUfenpeiPostArr[i].daoboUserName=this.cUdaoboListArr.find((daobo:any) => daobo.zhsId ==this.cUfenpeiPostArr[i].daoboZhsId).realName;
            }
        }
        let fenpeiPostString=JSON.stringify(this.cUfenpeiPostArr);
        console.log(fenpeiPostString);
        this.guaranteeService.assignZhibanrenDaobo(fenpeiPostString)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('分配导播和值班人员');
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            if(resData.successful){
                this.isSwitchedWeek=true;
                $("#alertSuccessTip").html('分配成功!');
                $('#alertSuccessWrap').modal('show');
                setTimeout(()=> {
                    $('#alertSuccessWrap').modal('hide');
                    _that.getZhiBanPersonInfor(_that.showSchedule);
                    $('.guanbiFenpei').click();
                    _that.getWeekZhiBanPersonInfo(_that.showSchedule,_that.cUweek,_that.currentzhsId);
                }, 1000);
            }else{
                $("#alertTip").html(resData.errorMsg);
                $('#alertWrap').modal('show');
            }
        });
    }

    private isHavePptArr=['不展示PPT','不展示PPT','展示PPT'];
    private liveDetailInfoRes:any;
    private liveDetailInfo:any;
    private liveDetailBaseInfo:any;
    private liveDetailCelueInfo:any;
    private liveDetailZhuanyuanInfo:any;
    private liveDetailZhibanInfo:any;
    public gua_isgetLiveDetailInfoTrue=false;
    private liveDetailInfozhuRoom:any[]=[];
    private liveDetailInfohuRoom:any[]=[];
    private yuyinUrl='';
    private liveUrl="";
    private hTowerUrl="";
    private meetZuzhiTypeArr=['','主题授课型','嘉宾访谈型','学生汇报型'];
    private meetZuzhiTypetoShow:any;
    private isHaveHudong=false;
    private isHavehuSchool=false;
    private liveDetailInfotype1=false;
    private liveDetailInfotype2=false;
    private liveDetailInfotype3=false;
    private timeToshow:any;

    getDetailInfo(id:any,lcId:any,ele:any){
        if(!$(ele).hasClass('week8-click')){
            return;
        }
        this.guaranteeService.getLiveDetailDto(id)
        .subscribe(data => {
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获取见面课详情 弹框');
            console.log(eval('('+data['_body']+')'));
            this.liveDetailInfozhuRoom=[];
            this.liveDetailInfohuRoom=[];
            this.liveDetailInfoRes=eval('('+data['_body']+')');
            if(this.liveDetailInfoRes.successful){
                this.liveDetailInfo=this.liveDetailInfoRes.result;
                this.liveDetailBaseInfo=this.liveDetailInfo.baseInfo;
                this.liveDetailCelueInfo=this.liveDetailInfo.strategyInfo;
                this.liveDetailZhuanyuanInfo=this.liveDetailInfo.zhuanYuanInfo;
                this.liveDetailZhibanInfo=this.liveDetailInfo.zhiBanInfo;
                let timer=this.liveDetailBaseInfo.endTime-this.liveDetailBaseInfo.startTime;
                this.timeToshow=Math.floor(timer/60000);
                if(this.liveDetailCelueInfo==null || this.liveDetailCelueInfo.type=='' || this.liveDetailCelueInfo.type==undefined || this.liveDetailCelueInfo.type==null){
                    this.isHaveHudong=false;
                }else{
                    this.isHaveHudong=true;
                    this.meetZuzhiTypetoShow=this.meetZuzhiTypeArr[this.liveDetailCelueInfo.type];
                    if(this.liveDetailCelueInfo.type==1){
                        this.liveDetailInfotype1=true;
                        this.liveDetailInfotype2=false;
                        this.liveDetailInfotype3=false;
                    }else if(this.liveDetailCelueInfo.type==2){
                        this.liveDetailInfotype2=true;
                        this.liveDetailInfotype1=false;
                        this.liveDetailInfotype3=false;
                    }else{
                        this.liveDetailInfotype3=true;
                        this.liveDetailInfotype1=false;
                        this.liveDetailInfotype2=false;
                    }
                    if(this.liveDetailCelueInfo.description == "" || this.liveDetailCelueInfo.description ==null || this.liveDetailCelueInfo.description==undefined){
                        this.liveDetailCelueInfo.description="暂无";
                    }
                }
                for(var i=0;i<this.liveDetailInfo.liveRooms.length;i++){
                    if(this.liveDetailInfo.liveRooms[i].daoboName==null || this.liveDetailInfo.liveRooms[i].daoboName=="" || this.liveDetailInfo.liveRooms[i].daoboName==undefined){
                        this.liveDetailInfo.liveRooms[i].daoboName="—";
                    }
                    if(this.liveDetailInfo.liveRooms[i].daoboPhone==null || this.liveDetailInfo.liveRooms[i].daoboPhone=="" || this.liveDetailInfo.liveRooms[i].daoboPhone==undefined){
                        this.liveDetailInfo.liveRooms[i].daoboPhone="—";
                    }
                    if(this.liveDetailInfo.liveRooms[i].roomTeacherName==null || this.liveDetailInfo.liveRooms[i].roomTeacherName=="" || this.liveDetailInfo.liveRooms[i].roomTeacherName==undefined){
                        this.liveDetailInfo.liveRooms[i].roomTeacherName="—";
                    }
                    if(this.liveDetailInfo.liveRooms[i].roomTeacherPhone==null || this.liveDetailInfo.liveRooms[i].roomTeacherPhone=="" || this.liveDetailInfo.liveRooms[i].roomTeacherPhone==undefined){
                        this.liveDetailInfo.liveRooms[i].roomTeacherPhone="—";
                    }
                    if(this.liveDetailInfo.liveRooms[i].classroomType==0){
                        this.liveDetailInfozhuRoom.push(this.liveDetailInfo.liveRooms[i]);
                    }else{
                        this.liveDetailInfohuRoom.push(this.liveDetailInfo.liveRooms[i]);
                    }
                }
                for(var m=0;m<this.liveDetailInfozhuRoom.length;m++){
                    if(this.liveDetailInfozhuRoom[m].schoolCode=='-999'){
                        this.liveDetailInfozhuRoom[m].schoolName="待定";
                        this.liveDetailInfozhuRoom[m].classroomName="";
                    }else{
                        if(this.liveDetailInfozhuRoom[m].classroomCode=="-888"){
                            this.liveDetailInfozhuRoom[m].classroomName="教室待定";
                        }
                    }
                }
                for(var n=0;n<this.liveDetailInfohuRoom.length;n++){
                    if(this.liveDetailInfohuRoom[n].classroomCode=="-888"){
                        this.liveDetailInfohuRoom[n].classroomName="教室待定";
                    }
                }
                if(this.liveDetailInfohuRoom.length>0){
                    this.isHavehuSchool=true;
                }else{
                   this.isHavehuSchool=false;
                }
                this.liveDetailInfo.liveTypeImg="../../../imgs/liveType"+this.liveDetailBaseInfo.liveType+".png";
                this.hTowerUrl="http://ht.livecourse.com/#/detail/"+lcId;
                if(this.liveDetailBaseInfo.state=='1'){
                    this.liveUrl="";
                }else if(this.liveDetailBaseInfo.state=='2'){
                    this.liveUrl='http://lc.zhihuishu.com/live/live_room.html?liveId='+lcId;
                }else{
                    this.liveUrl='http://lc.zhihuishu.com/live/vod_room.html?liveId='+lcId;
                }
                this.gua_isgetLiveDetailInfoTrue=true;
                setTimeout(()=>{
                    $('#detailInfoPage').modal('show');
                },100);
            }else{
                this.gua_isgetLiveDetailInfoTrue=false;
                setTimeout(()=>{
                    $('#detailInfoPage').modal('hide');
                },300);
                $("#alertTip").html("系统出错！");
                $('#alertWrap').modal('show');
            }
        });
        this.guaranteeService.getZhumuMeettingUrl(lcId)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获取进入语音频道地址');
            console.log(data);
            let resurlData=eval('('+data['_body']+')');
            if(resurlData.successful){
                this.yuyinUrl=resurlData.result.url;
            }else{
                this.yuyinUrl='';
            }
        });
    }

    jumpTolive(){
        if(this.liveUrl==''){
            event.preventDefault();
            $("#alertTip").html("直播未开始!");
            $('#alertWrap').modal('show');
        }
    }

    jumpToyuyin(){
        if(this.yuyinUrl==''){
            event.preventDefault();
            $("#alertTip").html("未找到对应的瞩目会议!");
            $('#alertWrap').modal('show');
        }
    }

    getCookie(name:any) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
            return unescape(c.substring(nameEQ.length,c.length));
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
            if(this.cUweekKeep==this.cUweek){
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
        if(this.getCookie('role')=="5"){
             this.getSchedule();
        }else{
            this.router.navigateByUrl('login');
        }
    }
}
