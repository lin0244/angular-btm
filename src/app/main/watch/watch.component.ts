import {  Component,OnInit  } from '@angular/core';
import { WatchService } from './watch.service';
import {Router} from "@angular/router";
declare var $: any;
declare var moment: any;
declare var unescape:any;

export class fankuiPostObj{
    liveScores:any[]=[];
    liveFeedBack:any;
}

export class daoboPostObj{
    livePersons:any[]=[];
}

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css'],
  providers: [WatchService]
})
export class WatchComponent implements OnInit {

  constructor(private watchService: WatchService,public router: Router) { }
    public wat_classArr=["",'unstartVideo','currentVideo','historyVideo'];
    public wat_colorClassArr=['blueClass','greenClass','redClass'];
    private daoBoConfirmClassArr=['unsure','sure','refuse'];
    private zhibanZhsId:any;
    //获取当前值班人zhsId
    initPage(){
        this.zhibanZhsId=this.getCookie('zhsId');
        this.getOnDutyPersonCurrentLive(this.zhibanZhsId);
        this.getOnDutyPersonHistoryLive(this.zhibanZhsId);
        this.getRecentlyTwoWeekLive(this.zhibanZhsId,'1');
        this.getRoomDaoboDetail();
    }

    public wat_todayVideoList:any;
    public wat_todayLiveEnd=0;
    public wat_todayLiveAll=0;
    public wat_isHaveCuZhiban=true;
    //获得值班人员，当天见面课列表
    getOnDutyPersonCurrentLive(id:any){
        this.watchService.getOnDutyPersonCurrentLive(id)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获得值班人员，当天见面课列表');
            console.log(data);
            if(data.result==null || data.result.result.length==0){
                this.wat_todayLiveEnd=0;
                this.wat_todayLiveAll=0;
                this.wat_isHaveCuZhiban=false;
            }else{
                this.wat_isHaveCuZhiban=true;
                this.wat_todayVideoList=data.result.result;
                this.wat_todayLiveEnd=data.result.finish;
                this.wat_todayLiveAll=data.result.all;
                setTimeout(()=> {
                    $(".nano").nanoScroller();
                    $(".nano").nanoScroller({ preventPageScrolling: true });
                }, 500);
            }
        });
    }

    public wat_historyVideoList:any;
    public wat_isHaveHisZhiban=true;
    //获得值班人员，历史见面课列表(已结束)
    getOnDutyPersonHistoryLive(id:any){
        this.watchService.getOnDutyPersonHistoryLive(id)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获得值班人员，历史见面课列表');
            console.log(data);
            if(data.result.length==0){
                this.wat_isHaveHisZhiban=false;
            }else{
                this.wat_isHaveHisZhiban=true;
                this.wat_historyVideoList=data.result;
                setTimeout(()=> {
                    $(".nano").nanoScroller();
                    $(".nano").nanoScroller({ preventPageScrolling: true });
                }, 500);
            }
        });
    }

    private currentClassRoomList:any[]=[];
    //根据id获取见面课分配教室
    getLiveRoomByLiveId(id:any){
        this.currentClassRoomList=[];
        this.watchService.getLiveRoomByLiveId(id)
        .subscribe(data =>{
            console.log('根据id获取见面课分配的教室列表');
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            this.currentClassRoomList=resData.result;
        });
    }

    public pingfenLivename="";
    private pingfenLiveId:any;
    private pingfenInfoById:any[]=[];
    //查询评分
    getLivePingfenInfo(id:any,name:any){
        this.pingfenLivename=name;
        this.pingfenLiveId=id;
        this.pingfenInfoById=[];
        this.watchService.getLivePingfenInfo(id)
        .subscribe(data=>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("获取评分");
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            for(var i=0;i<resData.result.length;i++){
                if(resData.result[i].classroomRole==0){
                    this.pingfenInfoById.push(resData.result[i]);
                }
            }
            for(var i=0;i<resData.result.length;i++){
                if(resData.result[i].classroomRole==1){
                    this.pingfenInfoById.push(resData.result[i]);
                }
            }
            for(var m=0;m<this.pingfenInfoById.length;m++){
                this.pingfenInfoById[m].pingfenStage1=[];
                this.pingfenInfoById[m].pingfenStage2=[];
                this.pingfenInfoById[m].pingfenStage3=[];
                this.pingfenInfoById[m].pingfenStage4=[];
                this.pingfenInfoById[m].pingfenStage5=[];
                this.pingfenInfoById[m].pingfenStage6=[];
                this.pingfenInfoById[m].pingfenStage1AllScore=0;
                this.pingfenInfoById[m].pingfenStage2AllScore=0;
                this.pingfenInfoById[m].pingfenStage3AllScore=0;
                this.pingfenInfoById[m].pingfenStage4AllScore=0;
                this.pingfenInfoById[m].pingfenStage5AllScore=0;
                this.pingfenInfoById[m].pingfenStage6AllScore=0;
                for(var n=0;n<this.pingfenInfoById[m].reduceScoreDetails.length;n++){
                    if(this.pingfenInfoById[m].reduceScoreDetails[n].reduceScoreStage=='1'){
                        this.pingfenInfoById[m].pingfenStage1.push(this.pingfenInfoById[m].reduceScoreDetails[n]);
                    }else if(this.pingfenInfoById[m].reduceScoreDetails[n].reduceScoreStage=='2'){
                        this.pingfenInfoById[m].pingfenStage2.push(this.pingfenInfoById[m].reduceScoreDetails[n]);
                    }else if(this.pingfenInfoById[m].reduceScoreDetails[n].reduceScoreStage=='3'){
                        this.pingfenInfoById[m].pingfenStage3.push(this.pingfenInfoById[m].reduceScoreDetails[n]);
                    }else if(this.pingfenInfoById[m].reduceScoreDetails[n].reduceScoreStage=='4'){
                        this.pingfenInfoById[m].pingfenStage4.push(this.pingfenInfoById[m].reduceScoreDetails[n]);
                    }else if(this.pingfenInfoById[m].reduceScoreDetails[n].reduceScoreStage=='5'){
                        this.pingfenInfoById[m].pingfenStage5.push(this.pingfenInfoById[m].reduceScoreDetails[n]);
                    }else{
                        this.pingfenInfoById[m].pingfenStage6.push(this.pingfenInfoById[m].reduceScoreDetails[n]);
                    }
                }
            }
            this.jisuanScore();
            console.log(this.pingfenInfoById);
            setTimeout(()=>{
                this.showPFlistEvent();
            },200);
        });
    }

    private pfCurRoomCode:any;
    //获取点击的教室code
    getClickRoomCode(code:any){
        this.pfCurRoomCode=code;
    }

    //初始化分数，计算分数
    jisuanScore(){
        for(var i=0;i<this.pingfenInfoById.length;i++){
            this.pingfenInfoById[i].score=100;
            this.pingfenInfoById[i].pingfenStage1AllScore=0;
            this.pingfenInfoById[i].pingfenStage2AllScore=0;
            this.pingfenInfoById[i].pingfenStage3AllScore=0;
            this.pingfenInfoById[i].pingfenStage4AllScore=0;
            this.pingfenInfoById[i].pingfenStage5AllScore=0;
            this.pingfenInfoById[i].pingfenStage6AllScore=0;
            for(var j=0;j<this.pingfenInfoById[i].pingfenStage1.length;j++){
                this.pingfenInfoById[i].pingfenStage1AllScore+=parseInt(this.pingfenInfoById[i].pingfenStage1[j].reduceScore);
            }
            for(var j=0;j<this.pingfenInfoById[i].pingfenStage2.length;j++){
                this.pingfenInfoById[i].pingfenStage2AllScore+=parseInt(this.pingfenInfoById[i].pingfenStage2[j].reduceScore);
            }
            for(var j=0;j<this.pingfenInfoById[i].pingfenStage3.length;j++){
                this.pingfenInfoById[i].pingfenStage3AllScore+=parseInt(this.pingfenInfoById[i].pingfenStage3[j].reduceScore);
            }
            for(var j=0;j<this.pingfenInfoById[i].pingfenStage4.length;j++){
                this.pingfenInfoById[i].pingfenStage4AllScore+=parseInt(this.pingfenInfoById[i].pingfenStage4[j].reduceScore);
            }
            for(var j=0;j<this.pingfenInfoById[i].pingfenStage5.length;j++){
                this.pingfenInfoById[i].pingfenStage5AllScore+=parseInt(this.pingfenInfoById[i].pingfenStage5[j].reduceScore);
            }
            for(var j=0;j<this.pingfenInfoById[i].pingfenStage6.length;j++){
                this.pingfenInfoById[i].pingfenStage6AllScore+=parseInt(this.pingfenInfoById[i].pingfenStage6[j].reduceScore);
            }
            for(var j=0;j<this.pingfenInfoById[i].reduceScoreDetails.length;j++){
                this.pingfenInfoById[i].score-=parseInt(this.pingfenInfoById[i].reduceScoreDetails[j].reduceScore);
            }
            if(this.pingfenInfoById[i].score<=0){
                this.pingfenInfoById[i].score=0;
            }
        }
    }

    //绑定扣分列表显示事件 ，扣分列表选择事件绑定，扣分列表隐藏事件，扣分删除事件，编辑添加自定义扣分项事件
    showPFlistEvent(){
        var _that=this;
        let kfMsgIndex;
        $('.showPFdivSpan').on('click',function(){
            kfMsgIndex=$(this).attr('id').split('@')[1];
            $('.addKoufenDiv').hide();
            let pfDivCon=$(this).parent().next();
            let kfUlCon=$(pfDivCon).next();
            $(pfDivCon).show();
            let pfList=$(pfDivCon).find('.koufenHoverLi');
            $(pfList).off('click');
            $(pfList).on('click',function(){
                let kfInfo=$(this).find('.pfListInfo').html();
                let kfNum=$(this).attr('data-score');
                let kfInfoSpanList=$(kfUlCon).find('.kfListInfo');
                let kfInfoList=[];
                for(var i=0;i<$(kfInfoSpanList).length;i++){
                    kfInfoList.push($($(kfInfoSpanList)[i]).html());
                }
                if($.inArray(kfInfo, kfInfoList)!=-1){
                    return;
                }
                // let newKoufenObj=$('<li class="koufenHoverLi" data-score=' + kfNum +' style="color: #949FBC;cursor: auto;">'+
                //                     '<span class="dianLi"></span><span class="kfListInfo">'+kfInfo+'</span>'+
                //                     '<span class="koufenDelte">'+
                //                     '<i class="fa fa-minus" style="color: #969696;"></i></span>'+
                //                  '</li>');
                // $(kfUlCon).append(newKoufenObj);
                let pingfenInfoID=_that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).id;
                let resduceObj={
                    "attendanceScoreId":pingfenInfoID,
                    "reduceScoreReason":kfInfo,
                    "reduceScore":kfNum,
                    "reduceScoreStage":kfMsgIndex
                };
                if(kfMsgIndex=='1'){
                    _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage1.push(resduceObj);
                }else if(kfMsgIndex=='2'){
                    _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage2.push(resduceObj);
                }else if(kfMsgIndex=='3'){
                    _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage3.push(resduceObj);
                }else if(kfMsgIndex=='4'){
                    _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage4.push(resduceObj);
                }else if(kfMsgIndex=='5'){
                    _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage5.push(resduceObj);
                }else{
                    _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage6.push(resduceObj);
                }
                _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).reduceScoreDetails.push(resduceObj);
                _that.jisuanScore();
            });
        });
        $('#pingfen').on('click',function(){
            $('.addKoufenDiv').hide();
        });
        $(".addKoufenDiv").click(function(event){
            event.stopPropagation();
        });
        $(".showPFdivSpan").click(function(event){
            event.stopPropagation();
        });
        $('.koufenDelte').off('click');
        $('body').on("click", "span.koufenDelte", function(){
            let kfMsgIndexDelte=$(this).parent().parent().attr('id').split('@')[1];
            let delteMsgInfo=$(this).parent().find('.kfListInfo').html();
            if(kfMsgIndexDelte=='1'){
                let curRoom=_that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage1;
                for(var i=0;i<curRoom.length;i++){
                    if(curRoom[i].reduceScoreReason==delteMsgInfo){
                        _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage1.splice(i,1);
                    }
                }
            }else if(kfMsgIndexDelte=='2'){
                let curRoom=_that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage2;
                for(var i=0;i<curRoom.length;i++){
                    if(curRoom[i].reduceScoreReason==delteMsgInfo){
                        _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage2.splice(i,1);
                    }
                }
            }else if(kfMsgIndexDelte=='3'){
                let curRoom=_that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage3;
                for(var i=0;i<curRoom.length;i++){
                    if(curRoom[i].reduceScoreReason==delteMsgInfo){
                        _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage3.splice(i,1);
                    }
                }
            }else if(kfMsgIndexDelte=='4'){
                let curRoom=_that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage4;
                for(var i=0;i<curRoom.length;i++){
                    if(curRoom[i].reduceScoreReason==delteMsgInfo){
                        _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage4.splice(i,1);
                    }
                }
            }else if(kfMsgIndexDelte=='5'){
                let curRoom=_that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage5;
                for(var i=0;i<curRoom.length;i++){
                    if(curRoom[i].reduceScoreReason==delteMsgInfo){
                        _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage5.splice(i,1);
                    }
                }
            }else{
                let curRoom=_that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage6;
                for(var i=0;i<curRoom.length;i++){
                    if(curRoom[i].reduceScoreReason==delteMsgInfo){
                        _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage6.splice(i,1);
                    }
                }
            }
            let curReduceListInfo=_that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).reduceScoreDetails;
            for(var j=0;j<curReduceListInfo.length;j++){
                if(delteMsgInfo==curReduceListInfo[j].reduceScoreReason){
                    _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).reduceScoreDetails.splice(j,1);
                }
            }
            _that.jisuanScore();
        });

        $('.editorKoufenInfo').on('click',function(){
            let pfDivCon=$(this).parent();
            let kfUlCon=$(this).parent().next();
            if($(kfUlCon).find('.editorAreaConLi')[0]!=undefined){
                $(pfDivCon).hide();
                $('.editorKoufenArea').focus();
                return;
            }
            $(pfDivCon).hide();
            let editorObj=$('<li class="editorAreaConLi">'+
                                '<textarea class="editorKoufenArea" placeholder="请编辑扣分原因，按Enter键完成编辑"></textarea>'+
                                '<span class="editorAreaDelte"><i class="fa fa-minus" style="color: #969696;"></i></span>'+
                            '</li>');
            $(kfUlCon).append(editorObj);
            $('.editorKoufenArea').focus();
            $('.editorKoufenArea').keydown(function(e:any){
                let theEvent = e || window.event;
                let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                let editorInfo=$('.editorKoufenArea').val();
                if (code == 13 && editorInfo!="") {
                    $('.editorAreaConLi').remove();
                    let pingfenInfoID=_that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).id;
                    let resduceObj={
                        "attendanceScoreId":pingfenInfoID,
                        "reduceScoreReason":editorInfo,
                        "reduceScore":5,
                        "reduceScoreStage":kfMsgIndex
                    };
                    if(kfMsgIndex=='1'){
                        _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage1.push(resduceObj);
                    }else if(kfMsgIndex=='2'){
                        _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage2.push(resduceObj);
                    }else if(kfMsgIndex=='3'){
                        _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage3.push(resduceObj);
                    }else if(kfMsgIndex=='4'){
                        _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage4.push(resduceObj);
                    }else if(kfMsgIndex=='5'){
                        _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage5.push(resduceObj);
                    }else{
                        _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).pingfenStage6.push(resduceObj);
                    }
                    _that.pingfenInfoById.find((room:any)=>room.classroomCode==_that.pfCurRoomCode).reduceScoreDetails.push(resduceObj);
                    _that.jisuanScore();
                }else if(code == 13){
                    theEvent.cancelBubble=true;
                    theEvent.preventDefault();
                    theEvent.stopPropagation();
                    return;
                }else{

                }
            });
        });
        $('.editorAreaDelte').off('click');
        $('body').on("click", "span.editorAreaDelte", function(){
            $(this).parent().remove();
        });
    }

    private postpingfenInfo:any[]=[];
    //评分提交
    pingfenPost(){
        this.postpingfenInfo=[];
        for(var i=0;i<this.pingfenInfoById.length;i++){
            let reduceStageStr="";
            if(this.pingfenInfoById[i].pingfenStage1.length>0){
                if(reduceStageStr==""){
                    reduceStageStr=reduceStageStr+'1';
                }else{
                    reduceStageStr=reduceStageStr+','+'1';
                }
            }
            if(this.pingfenInfoById[i].pingfenStage2.length>0){
                if(reduceStageStr==""){
                    reduceStageStr=reduceStageStr+'2';
                }else{
                    reduceStageStr=reduceStageStr+','+'2';
                }
            }
            if(this.pingfenInfoById[i].pingfenStage3.length>0){
                if(reduceStageStr==""){
                    reduceStageStr=reduceStageStr+'3';
                }else{
                    reduceStageStr=reduceStageStr+','+'3';
                }
            }
            if(this.pingfenInfoById[i].pingfenStage4.length>0){
                if(reduceStageStr==""){
                    reduceStageStr=reduceStageStr+'4';
                }else{
                    reduceStageStr=reduceStageStr+','+'4';
                }
            }
            if(this.pingfenInfoById[i].pingfenStage5.length>0){
                if(reduceStageStr==""){
                    reduceStageStr=reduceStageStr+'5';
                }else{
                    reduceStageStr=reduceStageStr+','+'5';
                }
            }
            if(this.pingfenInfoById[i].pingfenStage6.length>0){
                if(reduceStageStr==""){
                    reduceStageStr=reduceStageStr+'6';
                }else{
                    reduceStageStr=reduceStageStr+','+'6';
                }
            }
            let obj={
                "id":this.pingfenInfoById[i].id,
                "liveId":this.pingfenLiveId,
                "classroomCode":this.pingfenInfoById[i].classroomCode,
                "reduceScoreStage":reduceStageStr,
                "daoboZhsId":this.pingfenInfoById[i].daoboZhsId,
                "score":this.pingfenInfoById[i].score,
                "reduceScoreDetails":this.pingfenInfoById[i].reduceScoreDetails
            };
            this.postpingfenInfo.push(obj);
        }
        console.log(this.postpingfenInfo);
        let postInfo=JSON.stringify(this.postpingfenInfo);
        this.watchService.batchSaveOrUpdateScore(postInfo)
        .subscribe(data =>{
            console.log('评分提交');
            console.log(data);
            $('.pingfenClose').click();
        });
    }


    public wat_fanKuiliveName='';
    private fankuiLiveId:any;
    private liveClassRoom:any[]=[];
    private feedBackList:any[]=[];

    public addfeedBack1=true;
    public addfeedBack2=true;
    public addfeedBack3=true;
    public addfeedBack4=true;
    public addfeedBack5=true;
    public addfeedBack6=true;
    //查询反馈
    getLiveFeedBackInfo(id:any,name:any){
        this.getLiveRoomByLiveId(id);
        this.addfeedBack1=true;
        this.addfeedBack2=true;
        this.addfeedBack3=true;
        this.addfeedBack4=true;
        this.addfeedBack5=true;
        this.addfeedBack6=true;
        this.fankuiLiveId=id;
        this.wat_fanKuiliveName=name;
        this.watchService.getLiveFeedBackInfo(id)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log("获取反馈");
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            this.feedBackList=resData.result.attendanceFeedbackList;
            this.initFeedBackList();
            $.AdminLTE.tree(".treeMenuCon");
        });
    }

    public initFeedBackListToshow:any[]=[];
    //初始化反馈列表
    initFeedBackList(){
        this.initFeedBackListToshow=[];
        for (var i=0;i<this.feedBackList.length;i++){
            let obj={
                id:this.feedBackList[i].id,
                liveId:this.feedBackList[i].liveId,
                type:this.feedBackList[i].type,
                classroomCode:this.feedBackList[i].classroomCode,
                description:this.feedBackList[i].description,
                faultTime:this.feedBackList[i].faultTime,
                faultTimeUnit:this.feedBackList[i].faultTimeUnit,
                faultStatge:this.feedBackList[i].faultStatge,
                faultLevel:this.feedBackList[i].faultLevel,
                faultType:this.feedBackList[i].faultType
            };
            this.initFeedBackListToshow.push(obj);
        }
        if(this.initFeedBackListToshow.length>0){
            this.isHaveZhiBanFb=true;
        }else{
            this.isHaveZhiBanFb=false;
        }
        setTimeout(()=>{
            for(var i=0;i<$('.feedBackTypeLi').length;i++){
                let fbInfo=this.initFeedBackListToshow[i];
                $($('.feedBackTypeLi')[i]).find('.guzhangClassroom').val(fbInfo.classroomCode).change();
                $($('.feedBackTypeLi')[i]).find('.guzhangMiaoshu').val(fbInfo.description);
                $($('.feedBackTypeLi')[i]).find('.guzhangTimelong').val(fbInfo.faultTime);
                $($('.feedBackTypeLi')[i]).find('.guzhangTimelongType').val(fbInfo.faultTimeUnit).change();
                $($('.feedBackTypeLi')[i]).find('.guzhangStage').val(fbInfo.faultStatge).change();
                $($('.feedBackTypeLi')[i]).find('.guzhangDengji').val(fbInfo.faultLevel).change();
                $($('.feedBackTypeLi')[i]).find('.guzhangType').val(fbInfo.faultType).change();
            };
        },300);
    }

    private delteFbflag:any;
    fbDelteClick(flag:any){
        this.delteFbflag=flag;
    }

    deleteFBtosure(){
        if(this.initFeedBackListToshow[this.delteFbflag].id!=undefined && this.initFeedBackListToshow[this.delteFbflag].id!=null){
            this.watchService.deleteFeedBackById(this.initFeedBackListToshow[this.delteFbflag].id)
            .subscribe(data=>{
                console.log('删除反馈');
                console.log(data);
            });
        }
        this.initFeedBackListToshow.splice(this.delteFbflag,1);
        if(this.initFeedBackListToshow.length>0){
            this.isHaveZhiBanFb=true;
        }else{
            this.isHaveZhiBanFb=false;
        }
    }
    public isHaveZhiBanFb=false;
    public feedBackMsg=['','LC云平台问题','教室产品问题','保障问题','课程运行问题','工程问题','其他问题'];
    //反馈添加、减少按钮
    feedbackAddClick(flag:any){
        let obj={
                liveId:this.fankuiLiveId,
                type:flag,
                classroomCode:"",
                description:"",
                faultTime:null,
                faultTimeUnit:null,
                faultStatge:null,
                faultLevel:null,
                faultType:null
            };
        this.initFeedBackListToshow.push(obj);
        if(this.initFeedBackListToshow.length>0){
            this.isHaveZhiBanFb=true;
        }else{
            this.isHaveZhiBanFb=false;
        }
    }

    //反馈提交
    feedBackPost(){
        for(var i=0;i<$('.feedBackTypeLi').length;i++){
            this.initFeedBackListToshow[i].classroomCode=$($('.feedBackTypeLi')[i]).find('.guzhangClassroom').val();
            this.initFeedBackListToshow[i].description=$($('.feedBackTypeLi')[i]).find('.guzhangMiaoshu').val();
            this.initFeedBackListToshow[i].faultTime=$($('.feedBackTypeLi')[i]).find('.guzhangTimelong').val();
            this.initFeedBackListToshow[i].faultTimeUnit=$($('.feedBackTypeLi')[i]).find('.guzhangTimelongType').val();
            this.initFeedBackListToshow[i].faultStatge=$($('.feedBackTypeLi')[i]).find('.guzhangStage').val();
            this.initFeedBackListToshow[i].faultLevel=$($('.feedBackTypeLi')[i]).find('.guzhangDengji').val();
            this.initFeedBackListToshow[i].faultType=$($('.feedBackTypeLi')[i]).find('.guzhangType').val();
        }
        for(var k=0;k<this.initFeedBackListToshow.length;k++){
            if(this.initFeedBackListToshow[k].description==undefined || this.initFeedBackListToshow[k].description=="" || this.initFeedBackListToshow[k].description==null){
                 $("#alertTip").html("问题描述不能为空!");
                 $('#alertWrap').modal('show');
                 return;
            }
        }
        console.log(this.initFeedBackListToshow);
        let postInfo=JSON.stringify(this.initFeedBackListToshow);
        this.watchService.batchSaveOrUpdate(postInfo)
        .subscribe(data =>{
            console.log('反馈提交');
            console.log(data);
            $('.guanbiFankui').click();
        });
    }

    private currentWeekinfo:any;
    private nextWeekinfo:any;
    public wat_monLiveAm:any[]=[];
    public wat_monLivePm:any[]=[];
    public wat_monLiveNi:any[]=[];
    public wat_tueLiveAm:any[]=[];
    public wat_tueLivePm:any[]=[];
    public wat_tueLiveNi:any[]=[];
    public wat_wedLiveAm:any[]=[];
    public wat_wedLivePm:any[]=[];
    public wat_wedLiveNi:any[]=[];
    public wat_thuLiveAm:any[]=[];
    public wat_thuLivePm:any[]=[];
    public wat_thuLiveNi:any[]=[];
    public wat_friLiveAm:any[]=[];
    public wat_friLivePm:any[]=[];
    public wat_friLiveNi:any[]=[];
    public wat_setLiveAm:any[]=[];
    public wat_setLivePm:any[]=[];
    public wat_setLiveNi:any[]=[];
    public wat_sunLiveAm:any[]=[];
    public wat_sunLivePm:any[]=[];
    public wat_sunLiveNi:any[]=[];
    //获得两周教室信息和教室导播人员
    getRecentlyTwoWeekLive(id:any,weekFlag:any){
        this.watchService.getRecentlyTwoWeekLive(id)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获得两周教室信息和教室导播人员');
            console.log(data);
            console.log($.parseJSON(data['_body']));
            let res=$.parseJSON(data['_body']);
            this.currentWeekinfo=res.result["1"];
            this.nextWeekinfo=res.result["2"];
            for(var i=0;i<this.currentWeekinfo.length;i++){
                if(this.currentWeekinfo[i].list!=null){
                    if(this.currentWeekinfo[i].list.find((room:any) =>room.daobaoConfirmStatus==2)==undefined){
                        if(this.currentWeekinfo[i].list.find((room:any) =>room.daobaoConfirmStatus==0)==undefined){
                            this.currentWeekinfo[i].daoboStatus=1;
                        }else{
                            this.currentWeekinfo[i].daoboStatus=0;
                        }
                    }

                    for(var j=0;j<this.currentWeekinfo[i].list.length;j++){
                        if(this.currentWeekinfo[i].list[j].daobaoConfirmStatus==2){
                            this.currentWeekinfo[i].daoboStatus=2;
                        }
                        if(this.currentWeekinfo[i].list[j].zhsId=='' || this.currentWeekinfo[i].list[j].zhsId==null || this.currentWeekinfo[i].list[j].zhsId==undefined){
                            this.currentWeekinfo[i].daoboStatus=2;
                        }
                    }
                }else{
                    this.currentWeekinfo[i].daoboStatus=1;
                }
            }

            for(var i=0;i<this.nextWeekinfo.length;i++){
                if(this.nextWeekinfo[i].list!=null){
                    if(this.nextWeekinfo[i].list.find((room:any) =>room.daobaoConfirmStatus==2)==undefined){
                        if(this.nextWeekinfo[i].list.find((room:any) =>room.daobaoConfirmStatus==0)==undefined){
                            this.nextWeekinfo[i].daoboStatus=1;
                        }else{
                            this.nextWeekinfo[i].daoboStatus=0;
                        }
                    }
                    for(var j=0;j<this.nextWeekinfo[i].list.length;j++){
                        if(this.nextWeekinfo[i].list[j].daobaoConfirmStatus==2){
                            this.nextWeekinfo[i].daoboStatus=2;
                        }
                        if(this.nextWeekinfo[i].list[j].zhsId=='' || this.nextWeekinfo[i].list[j].zhsId==null || this.nextWeekinfo[i].list[j].zhsId==undefined){
                            this.nextWeekinfo[i].daoboStatus=2;
                        }
                    }
                }else{
                    this.nextWeekinfo[i].daoboStatus=1;
                }
            }
            this.switchCourseLi(weekFlag);
        });
    }

    private weekFlag='1';
    switchCourseLi(witch:any){
        this.wat_monLiveAm=[];
        this.wat_monLivePm=[];
        this.wat_monLiveNi=[];
        this.wat_tueLiveAm=[];
        this.wat_tueLivePm=[];
        this.wat_tueLiveNi=[];
        this.wat_wedLiveAm=[];
        this.wat_wedLivePm=[];
        this.wat_wedLiveNi=[];
        this.wat_thuLiveAm=[];
        this.wat_thuLivePm=[];
        this.wat_thuLiveNi=[];
        this.wat_friLiveAm=[];
        this.wat_friLivePm=[];
        this.wat_friLiveNi=[];
        this.wat_setLiveAm=[];
        this.wat_setLivePm=[];
        this.wat_setLiveNi=[];
        this.wat_sunLiveAm=[];
        this.wat_sunLivePm=[];
        this.wat_sunLiveNi=[];
        if(witch=='1'){
            this.weekFlag='1';
            //下周
            $('.currentWeekCourseLi').removeClass('clickCourseLi');
            $('.nextWeekCourseLi').addClass('clickCourseLi');
            for(var i=0;i<this.nextWeekinfo.length;i++){
               if(this.nextWeekinfo[i].zhouJi==1){
                   if(this.nextWeekinfo[i].amPm==0){
                       this.wat_monLiveAm.push(this.nextWeekinfo[i]);
                   }else if(this.nextWeekinfo[i].amPm==1){
                       this.wat_monLivePm.push(this.nextWeekinfo[i]);
                   }else{
                       this.wat_monLiveNi.push(this.nextWeekinfo[i]);
                   }
               }
               if(this.nextWeekinfo[i].zhouJi==2){
                   if(this.nextWeekinfo[i].amPm==0){
                       this.wat_tueLiveAm.push(this.nextWeekinfo[i]);
                   }else if(this.nextWeekinfo[i].amPm==1){
                       this.wat_tueLivePm.push(this.nextWeekinfo[i]);
                   }else{
                       this.wat_tueLiveNi.push(this.nextWeekinfo[i]);
                   }
               }
               if(this.nextWeekinfo[i].zhouJi==3){
                   if(this.nextWeekinfo[i].amPm==0){
                       this.wat_wedLiveAm.push(this.nextWeekinfo[i]);
                   }else if(this.nextWeekinfo[i].amPm==1){
                       this.wat_wedLivePm.push(this.nextWeekinfo[i]);
                   }else{
                       this.wat_wedLiveNi.push(this.nextWeekinfo[i]);
                   }
               }
               if(this.nextWeekinfo[i].zhouJi==4){
                   if(this.nextWeekinfo[i].amPm==0){
                       this.wat_thuLiveAm.push(this.nextWeekinfo[i]);
                   }else if(this.nextWeekinfo[i].amPm==1){
                       this.wat_thuLivePm.push(this.nextWeekinfo[i]);
                   }else{
                       this.wat_thuLiveNi.push(this.nextWeekinfo[i]);
                   }
               }
               if(this.nextWeekinfo[i].zhouJi==5){
                   if(this.nextWeekinfo[i].amPm==0){
                       this.wat_friLiveAm.push(this.nextWeekinfo[i]);
                   }else if(this.nextWeekinfo[i].amPm==1){
                       this.wat_friLivePm.push(this.nextWeekinfo[i]);
                   }else{
                       this.wat_friLiveNi.push(this.nextWeekinfo[i]);
                   }
               }
               if(this.nextWeekinfo[i].zhouJi==6){
                   if(this.nextWeekinfo[i].amPm==0){
                       this.wat_setLiveAm.push(this.nextWeekinfo[i]);
                   }else if(this.nextWeekinfo[i].amPm==1){
                       this.wat_setLivePm.push(this.nextWeekinfo[i]);
                   }else{
                       this.wat_setLiveNi.push(this.nextWeekinfo[i]);
                   }
               }
               if(this.nextWeekinfo[i].zhouJi==7){
                   if(this.nextWeekinfo[i].amPm==0){
                       this.wat_sunLiveAm.push(this.nextWeekinfo[i]);
                   }else if(this.nextWeekinfo[i].amPm==1){
                       this.wat_sunLivePm.push(this.nextWeekinfo[i]);
                   }else{
                       this.wat_sunLiveNi.push(this.nextWeekinfo[i]);
                   }
               }
            }
        }else{
            //本周
            this.weekFlag='2';
            $('.nextWeekCourseLi').removeClass('clickCourseLi');
            $('.currentWeekCourseLi').addClass('clickCourseLi');
            for(var i=0;i<this.currentWeekinfo.length;i++){
               if(this.currentWeekinfo[i].zhouJi==1){
                   if(this.currentWeekinfo[i].amPm==0){
                       this.wat_monLiveAm.push(this.currentWeekinfo[i]);
                   }else if(this.currentWeekinfo[i].amPm==1){
                       this.wat_monLivePm.push(this.currentWeekinfo[i]);
                   }else{
                       this.wat_monLiveNi.push(this.currentWeekinfo[i]);
                   }
               }
               if(this.currentWeekinfo[i].zhouJi==2){
                   if(this.currentWeekinfo[i].amPm==0){
                       this.wat_tueLiveAm.push(this.currentWeekinfo[i]);
                   }else if(this.currentWeekinfo[i].amPm==1){
                       this.wat_tueLivePm.push(this.currentWeekinfo[i]);
                   }else{
                       this.wat_tueLiveNi.push(this.currentWeekinfo[i]);
                   }
               }
               if(this.currentWeekinfo[i].zhouJi==3){
                   if(this.currentWeekinfo[i].amPm==0){
                       this.wat_wedLiveAm.push(this.currentWeekinfo[i]);
                   }else if(this.currentWeekinfo[i].amPm==1){
                       this.wat_wedLivePm.push(this.currentWeekinfo[i]);
                   }else{
                       this.wat_wedLiveNi.push(this.currentWeekinfo[i]);
                   }
               }
               if(this.currentWeekinfo[i].zhouJi==4){
                   if(this.currentWeekinfo[i].amPm==0){
                       this.wat_thuLiveAm.push(this.currentWeekinfo[i]);
                   }else if(this.currentWeekinfo[i].amPm==1){
                       this.wat_thuLivePm.push(this.currentWeekinfo[i]);
                   }else{
                       this.wat_thuLiveNi.push(this.currentWeekinfo[i]);
                   }
               }
               if(this.currentWeekinfo[i].zhouJi==5){
                   if(this.currentWeekinfo[i].amPm==0){
                       this.wat_friLiveAm.push(this.currentWeekinfo[i]);
                   }else if(this.currentWeekinfo[i].amPm==1){
                       this.wat_friLivePm.push(this.currentWeekinfo[i]);
                   }else{
                       this.wat_friLiveNi.push(this.currentWeekinfo[i]);
                   }
               }
               if(this.currentWeekinfo[i].zhouJi==6){
                   if(this.currentWeekinfo[i].amPm==0){
                       this.wat_setLiveAm.push(this.currentWeekinfo[i]);
                   }else if(this.currentWeekinfo[i].amPm==1){
                       this.wat_setLivePm.push(this.currentWeekinfo[i]);
                   }else{
                       this.wat_setLiveNi.push(this.currentWeekinfo[i]);
                   }
               }
               if(this.currentWeekinfo[i].zhouJi==7){
                   if(this.currentWeekinfo[i].amPm==0){
                       this.wat_sunLiveAm.push(this.currentWeekinfo[i]);
                   }else if(this.currentWeekinfo[i].amPm==1){
                       this.wat_sunLivePm.push(this.currentWeekinfo[i]);
                   }else{
                       this.wat_sunLiveNi.push(this.currentWeekinfo[i]);
                   }
               }
            }
        }
        setTimeout(() =>{
            $(".nano").nanoScroller();
            $(".nano").nanoScroller({ preventPageScrolling: true });
        },500);
    }

    public wat_clickLiveName='';
    private clickLiveId:any;
    private clickRoomListForGetdaobo:any[]=[];
    public wat_daoboList:any[]=[];
    public wat_isHaveRoomClick=true;
    private clickLiveRoomListToSelectDaobo:any[]=[];
    private clickLiveRoomListToSelectDaoboSort:any[]=[];
    public wat_clickLiveRoomListToSelectDaoboToshow:any[]=[];

    getRoomDaoboDetail(){
        this.watchService.getRoomDaoboDetail()
        .subscribe(data => {
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获取导播人员信息');
            let resData = eval('('+data['_body']+')');
            console.log(resData);
            this.wat_daoboList=resData.result;
        });
    }
    public wat_daoboListArr:any[]=[];
    getClickLiveDaoboById(id:any){
        var _that=this;
        _that.wat_clickLiveRoomListToSelectDaoboToshow=[];
        _that.clickRoomListForGetdaobo=[];
        _that.wat_daoboListArr=[];
        _that.clickLiveId=id;
        if(_that.weekFlag=='1'){
            //下周
            _that.wat_clickLiveName=_that.nextWeekinfo.find((live:any) => live.id ==id).liveName;
            if(_that.nextWeekinfo.find((live:any) => live.id ==_that.clickLiveId).list!=null){
                _that.clickLiveRoomListToSelectDaobo=_that.nextWeekinfo.find((live:any) => live.id ==_that.clickLiveId).list;
            }else{
                _that.clickLiveRoomListToSelectDaobo=[];
            }
        }else{
           //本周
            _that.wat_clickLiveName=_that.currentWeekinfo.find((live:any) => live.id ==id).liveName;
            if(_that.currentWeekinfo.find((live:any) => live.id ==_that.clickLiveId).list!=null){
                _that.clickLiveRoomListToSelectDaobo=_that.currentWeekinfo.find((live:any) => live.id ==_that.clickLiveId).list;
            }else{
                _that.clickLiveRoomListToSelectDaobo=[];
            }
        }
        console.log(_that.clickLiveRoomListToSelectDaobo);

        for(var i=0;i<_that.clickLiveRoomListToSelectDaobo.length;i++){
            if(_that.clickLiveRoomListToSelectDaobo[i].classroomType==0){
                _that.wat_clickLiveRoomListToSelectDaoboToshow.push(_that.clickLiveRoomListToSelectDaobo[i]);
            }
        }
        for(var i=0;i<_that.clickLiveRoomListToSelectDaobo.length;i++){
            if(_that.clickLiveRoomListToSelectDaobo[i].classroomType==1){
                _that.wat_clickLiveRoomListToSelectDaoboToshow.push(_that.clickLiveRoomListToSelectDaobo[i]);
            }
        }
        for(var k=0;k<_that.wat_clickLiveRoomListToSelectDaoboToshow.length;k++){
            if(_that.wat_clickLiveRoomListToSelectDaoboToshow[k].classroomCode!=null && _that.wat_clickLiveRoomListToSelectDaoboToshow[k].classroomCode!='' && _that.wat_clickLiveRoomListToSelectDaoboToshow[k].classroomCode!=" " && _that.wat_clickLiveRoomListToSelectDaoboToshow[k].classroomCode!='-888' && _that.wat_clickLiveRoomListToSelectDaoboToshow[k].schoolCode!='-999' && _that.wat_clickLiveRoomListToSelectDaoboToshow[k].schoolCode!=null && _that.wat_clickLiveRoomListToSelectDaoboToshow[k].schoolCode!=""){
                    _that.wat_daoboListArr.push(_that.wat_daoboList);
                }else{
                    let arrEmpty:any[]=[];
                    _that.wat_daoboListArr.push(arrEmpty);
                }
                if(_that.wat_clickLiveRoomListToSelectDaoboToshow[k].classroomCode=='-888'){
                    if(_that.wat_clickLiveRoomListToSelectDaoboToshow[k].schoolCode==null || _that.wat_clickLiveRoomListToSelectDaoboToshow[k].schoolCode=="-999" || _that.wat_clickLiveRoomListToSelectDaoboToshow[k].schoolCode!=""){
                        _that.wat_clickLiveRoomListToSelectDaoboToshow[k].schoolName="待定";
                        _that.wat_clickLiveRoomListToSelectDaoboToshow[k].classroomName="";
                    }else{
                        _that.wat_clickLiveRoomListToSelectDaoboToshow[k].classroomName="教室待定";
                    }
                }
        }
        console.log(_that.wat_clickLiveRoomListToSelectDaoboToshow);
        setTimeout(()=>{
            for(var i=0;i<_that.wat_clickLiveRoomListToSelectDaoboToshow.length;i++){
                $($('.cUdaoboSelect')[i]).unbind();
                $($('.cUdaoboSelect')[i]).select2();
                $($('.cUdaoboSelect')[i]).val(_that.wat_clickLiveRoomListToSelectDaoboToshow[i].zhsId).change();
                $($('.cUdaoboSelect')[i]).on('select2:select', function (evt:any) {
                    let zhsId=$(this).val();
                    let liveId=$(this).attr('id');
                    _that.findConflict(zhsId,liveId,$(this));
                });
            }
        },500);
    }

    private daoboSelArr:any[]=[];
    private conflictDaoboArr:any[]=[];
    private conflictPostLiveObj:any;
    //校验分配导播冲突
    findConflict(zid:any,lid:any,domE:any){
        this.daoboSelArr=[];
        this.conflictDaoboArr=[];
        for(var i=0;i<$('.cUdaoboSelect').length;i++){
            this.daoboSelArr.push($($('.cUdaoboSelect')[i]).val());
        }
        for(var m=0;m<this.daoboSelArr.length;m++){
            if(this.daoboSelArr[m]==zid){
                this.conflictDaoboArr.push(this.daoboSelArr[m]);
            }
        }
        if(this.conflictDaoboArr.length>1){
            if(zid!=''){
                $("#alertTip").html("同一时间段，同一个导播不能被安排到两个教室，请重新选择！");
                $('#alertWrap').modal('show');
                domE.val("").change();
            }
        }else{
            if(this.weekFlag=='1'){
                this.conflictPostLiveObj=this.nextWeekinfo.find((live:any)=>live.id==lid);
            }else{
                this.conflictPostLiveObj=this.currentWeekinfo.find((live:any)=>live.id==lid);
            }
            this.watchService.daobaoConflictConfirm(this.conflictPostLiveObj.startTime,this.conflictPostLiveObj.endTime,zid,lid)
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
    }



    private fenpeiDaoboPostArr:any[]=[];
    private fenpeiDaoboPostObj:daoboPostObj={
        livePersons:[]
    };
    private selectDaoboVal:any[]=[];

    //分配导播
    createConfirmLiveRoomDaobo(){
        if(!this.wat_isHaveRoomClick){
            $('.guanbiFenpei').click();
            return;
        }
        var _that=this;
        this.fenpeiDaoboPostObj.livePersons=[];
        this.selectDaoboVal=[];
        for(var k=0;k<$('.cUdaoboSelect').length;k++){
            let cC=this.wat_clickLiveRoomListToSelectDaoboToshow[k].classroomCode;
            if(cC==null){
                cC="";
            }
            let fenpeiObj={
                classroomCode:cC,
                liveId:this.clickLiveId,
                role:1
            };
            this.selectDaoboVal.push($($('.cUdaoboSelect option:selected')[k]).val());
            this.fenpeiDaoboPostObj.livePersons.push(fenpeiObj);
        }
        for(var i=0;i<this.selectDaoboVal.length;i++){
            this.fenpeiDaoboPostObj.livePersons[i].zhsId=this.selectDaoboVal[i];
            if(this.fenpeiDaoboPostObj.livePersons[i].zhsId==""){
                this.fenpeiDaoboPostObj.livePersons[i].email="";
                this.fenpeiDaoboPostObj.livePersons[i].phone="";
                this.fenpeiDaoboPostObj.livePersons[i].userName="";
            }else{
                this.fenpeiDaoboPostObj.livePersons[i].email=this.wat_daoboList.find((daobo:any) => daobo.zhsId ==this.fenpeiDaoboPostObj.livePersons[i].zhsId).email;
                this.fenpeiDaoboPostObj.livePersons[i].phone=this.wat_daoboList.find((daobo:any) => daobo.zhsId ==this.fenpeiDaoboPostObj.livePersons[i].zhsId).mobile;
                this.fenpeiDaoboPostObj.livePersons[i].userName=this.wat_daoboList.find((daobo:any) => daobo.zhsId ==this.fenpeiDaoboPostObj.livePersons[i].zhsId).realName;
            }
        }
        let fenPeiPostStr=JSON.stringify(this.fenpeiDaoboPostObj);
        console.log(fenPeiPostStr);
        this.watchService.createConfirmLiveRoomDaobo(fenPeiPostStr)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                _that.router.navigateByUrl('login');
                return;
            }
            console.log('分配导播');
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            if(resData.successful){
                $("#alertSuccessTip").html('分配成功!');
                $('#alertSuccessWrap').modal('show');
                setTimeout(()=> {
                    $('#alertSuccessWrap').modal('hide');
                    $('.guanbiFenpei').click();
                    _that.getRecentlyTwoWeekLive(_that.zhibanZhsId,_that.weekFlag);
                }, 1000);
            }else{
                console.log(resData);
                $("#alertTip").html(resData.errorMsg);
                $('#alertWrap').modal('show');
                return;
            }
        });
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

    initTip(){
        $("#colorTip").hover(function(){
            $("#colorTip").popover('show');
        },function(){
            $("#colorTip").popover('hide');
        });
    }

    public wat_isHavePptArr=['不展示PPT','不展示PPT','展示PPT'];
    private liveDetailInfoRes:any;
    public wat_liveDetailInfo:any;
    public wat_liveDetailBaseInfo:any;
    public wat_liveDetailCelueInfo:any;
    public wat_liveDetailZhuanyuanInfo:any;
    public wat_liveDetailZhibanInfo:any;
    public wat_isgetLiveDetailInfoTrue=false;
    public wat_liveDetailInfozhuRoom:any[]=[];
    public wat_liveDetailInfohuRoom:any[]=[];
    public wat_yuyinUrl='';
    public wat_liveUrl="";
    public wat_hTowerUrl="";
    private meetZuzhiTypeArr=['','主题授课型','嘉宾访谈型','学生汇报型'];
    private meetZuzhiTypetoShow:any;
    public wat_isHaveHudong=false;
    public wat_isHavehuSchool=false;
    public wat_liveDetailInfotype1=false;
    public wat_liveDetailInfotype2=false;
    public wat_liveDetailInfotype3=false;
    private timeToshow:any;

    getDetailInfo(id:any,lcId:any){
        this.watchService.getLiveDetailDto(id)
        .subscribe(data => {
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获取见面课详情 弹框');
            console.log(eval('('+data['_body']+')'));
            this.wat_liveDetailInfozhuRoom=[];
            this.wat_liveDetailInfohuRoom=[];
            this.liveDetailInfoRes=eval('('+data['_body']+')');
            if(this.liveDetailInfoRes.successful){
                this.wat_liveDetailInfo=this.liveDetailInfoRes.result;
                this.wat_liveDetailBaseInfo=this.wat_liveDetailInfo.baseInfo;
                this.wat_liveDetailCelueInfo=this.wat_liveDetailInfo.strategyInfo;
                this.wat_liveDetailZhuanyuanInfo=this.wat_liveDetailInfo.zhuanYuanInfo;
                this.wat_liveDetailZhibanInfo=this.wat_liveDetailInfo.zhiBanInfo;
                let timer=this.wat_liveDetailBaseInfo.endTime-this.wat_liveDetailBaseInfo.startTime;
                this.timeToshow=Math.floor(timer/60000);
                if(this.wat_liveDetailCelueInfo==null || this.wat_liveDetailCelueInfo.type=='' || this.wat_liveDetailCelueInfo.type==undefined || this.wat_liveDetailCelueInfo.type==null){
                    this.wat_isHaveHudong=false;
                }else{
                    this.wat_isHaveHudong=true;
                    this.meetZuzhiTypetoShow=this.meetZuzhiTypeArr[this.wat_liveDetailCelueInfo.type];
                    if(this.wat_liveDetailCelueInfo.type==1){
                        this.wat_liveDetailInfotype1=true;
                        this.wat_liveDetailInfotype2=false;
                        this.wat_liveDetailInfotype3=false;
                    }else if(this.wat_liveDetailCelueInfo.type==2){
                        this.wat_liveDetailInfotype2=true;
                        this.wat_liveDetailInfotype1=false;
                        this.wat_liveDetailInfotype3=false;
                    }else{
                        this.wat_liveDetailInfotype3=true;
                        this.wat_liveDetailInfotype1=false;
                        this.wat_liveDetailInfotype2=false;
                    }
                    if(this.wat_liveDetailCelueInfo.description == "" || this.wat_liveDetailCelueInfo.description ==null || this.wat_liveDetailCelueInfo.description==undefined){
                        this.wat_liveDetailCelueInfo.description="暂无";
                    }
                }
                for(var i=0;i<this.wat_liveDetailInfo.liveRooms.length;i++){
                    if(this.wat_liveDetailInfo.liveRooms[i].daoboName==null || this.wat_liveDetailInfo.liveRooms[i].daoboName=="" || this.wat_liveDetailInfo.liveRooms[i].daoboName==undefined){
                        this.wat_liveDetailInfo.liveRooms[i].daoboName="—";
                    }
                    if(this.wat_liveDetailInfo.liveRooms[i].daoboPhone==null || this.wat_liveDetailInfo.liveRooms[i].daoboPhone=="" || this.wat_liveDetailInfo.liveRooms[i].daoboPhone==undefined){
                        this.wat_liveDetailInfo.liveRooms[i].daoboPhone="—";
                    }
                    if(this.wat_liveDetailInfo.liveRooms[i].roomTeacherName==null || this.wat_liveDetailInfo.liveRooms[i].roomTeacherName=="" || this.wat_liveDetailInfo.liveRooms[i].roomTeacherName==undefined){
                        this.wat_liveDetailInfo.liveRooms[i].roomTeacherName="—";
                    }
                    if(this.wat_liveDetailInfo.liveRooms[i].roomTeacherPhone==null || this.wat_liveDetailInfo.liveRooms[i].roomTeacherPhone=="" || this.wat_liveDetailInfo.liveRooms[i].roomTeacherPhone==undefined){
                        this.wat_liveDetailInfo.liveRooms[i].roomTeacherPhone="—";
                    }
                    if(this.wat_liveDetailInfo.liveRooms[i].classroomType==0){
                        this.wat_liveDetailInfozhuRoom.push(this.wat_liveDetailInfo.liveRooms[i]);
                    }else{
                        this.wat_liveDetailInfohuRoom.push(this.wat_liveDetailInfo.liveRooms[i]);
                    }
                }
                for(var m=0;m<this.wat_liveDetailInfozhuRoom.length;m++){
                    if(this.wat_liveDetailInfozhuRoom[m].schoolCode=='-999'){
                        this.wat_liveDetailInfozhuRoom[m].schoolName="待定";
                        this.wat_liveDetailInfozhuRoom[m].classroomName="";
                    }else{
                        if(this.wat_liveDetailInfozhuRoom[m].classroomCode=="-888"){
                            this.wat_liveDetailInfozhuRoom[m].classroomName="教室待定";
                        }
                    }
                }
                for(var n=0;n<this.wat_liveDetailInfohuRoom.length;n++){
                    if(this.wat_liveDetailInfohuRoom[n].classroomCode=="-888"){
                        this.wat_liveDetailInfohuRoom[n].classroomName="教室待定";
                    }
                }
                if(this.wat_liveDetailInfohuRoom.length>0){
                    this.wat_isHavehuSchool=true;
                }else{
                   this.wat_isHavehuSchool=false;
                }
                this.wat_liveDetailInfo.liveTypeImg="../../../imgs/liveType"+this.wat_liveDetailBaseInfo.liveType+".png";
                this.wat_hTowerUrl="http://ht.livecourse.com/#/detail/"+lcId;
                if(this.wat_liveDetailBaseInfo.state=='1'){
                    this.wat_liveUrl="";
                }else if(this.wat_liveDetailBaseInfo.state=='2'){
                    this.wat_liveUrl='http://lc.zhihuishu.com/live/live_room.html?liveId='+lcId;
                }else{
                    this.wat_liveUrl='http://lc.zhihuishu.com/live/vod_room.html?liveId='+lcId;
                }
                this.wat_isgetLiveDetailInfoTrue=true;
                setTimeout(()=>{
                    $('#detailInfoPage').modal('show');
                },100);
            }else{
                this.wat_isgetLiveDetailInfoTrue=false;
                setTimeout(()=>{
                    $('#detailInfoPage').modal('hide');
                },300);
                $("#alertTip").html("系统出错！");
                $('#alertWrap').modal('show');
            }
        });
        this.watchService.getZhumuMeettingUrl(lcId)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获取进入语音频道地址');
            console.log(data);
            let resurlData=eval('('+data['_body']+')');
            if(resurlData.successful){
                this.wat_yuyinUrl=resurlData.result.url;
            }else{
                this.wat_yuyinUrl='';
            }
        });
    }

    jumpTolive(){
        if(this.wat_liveUrl==''){
            event.preventDefault();
            $("#alertTip").html("直播未开始!");
            $('#alertWrap').modal('show');
        }
    }

    jumpToyuyin(){
        if(this.wat_yuyinUrl==''){
            event.preventDefault();
            $("#alertTip").html("未找到对应的瞩目会议!");
            $('#alertWrap').modal('show');
        }
    }

    ngOnInit(): void {
        if(this.getCookie('role')=="4"){
            this.initPage();
            this.initTip();
            setTimeout(()=>{
                $(function () { $("#colorTip").popover({html : true });});
            },300);
        }else{
            this.router.navigateByUrl('login');
        }
    }

}
