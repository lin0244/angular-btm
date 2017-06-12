import { Component,OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MeetCourseListService } from './meet-course-list.service';
import { Parameter } from '../../parameter.service';
import {Router} from "@angular/router";
declare var $: any;
declare var moment: any;

@Component({
  selector: 'app-meet-course-list',
  templateUrl: './meet-course-list.component.html',
  styleUrls: ['./meet-course-list.component.css'],
  providers: [MeetCourseListService]
})
export class MeetCourseListComponent implements OnInit {

  constructor(private route: ActivatedRoute,private listService:MeetCourseListService,public router: Router,private parameter: Parameter){}

    private allScheduleList:any;
    private dir_currentScheduleId:any;
    private dir_notStartScheduleId:any;
    //获取所有课表
    getSchedule(){
        this.listService.getSchedule()
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
                return;
            }
            if(this.allScheduleList.find((schedule:any) => schedule.status =='1')!=undefined){
                this.dir_currentScheduleId=this.allScheduleList.find((schedule:any) => schedule.status =='1').id;
                this.getWeek();
            }else{
                this.getParmsbyUrl();
            }
            if(this.allScheduleList.find((schedule:any) => schedule.status =='2')!=undefined){
                this.dir_notStartScheduleId=this.allScheduleList.find((schedule:any) => schedule.status =='2').id;
            }
        });
    }

    private currentWeek:any;
    private fankuiSt:any;
    private fankuiEt:any;
    private dir_fankuiStToshow:any;
    private dir_fankuiEtToshow:any;
    //获取周信息
    getWeek(){
        this.listService.getWeek(this.dir_currentScheduleId,this.currentWeek)
        .subscribe(data =>{
            if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                this.router.navigateByUrl('login');
                return;
            }
            console.log('获取周信息');
            let resData=eval('('+data['_body']+')');
            let resDataArr=resData.result.split(',');
            this.currentWeek=parseInt(resDataArr[0]);
            this.fankuiSt=resDataArr[1];
            this.fankuiEt=resDataArr[2];
            this.dir_fankuiStToshow=this.fankuiSt.split(' ')[0];
            this.dir_fankuiEtToshow=this.fankuiEt.split(' ')[0];
            $('#starttime').val(this.dir_fankuiStToshow);
            $('#endtime').val(this.dir_fankuiEtToshow);
            this.getParmsbyUrl();
        });
    }


    //获取路径中的课表id以及状态
    getParmsbyUrl(){
        this.route.params.subscribe((params)=>{
            if(params['idSta'].split("-")[0]=='scheduleId'){
                this.schudelId='';
            }else{
                this.schudelId=params['idSta'].split("-")[0];
            }
            if(params['idSta'].split("-")[1]=='status'){
                this.meetCourseSta='';
            }else{
                $('#meetCourseStaSelect').val(params['idSta'].split("-")[1]);
                this.meetCourseSta=params['idSta'].split("-")[1];
            }
            this.getMeetCourseList();
        });
    }

    staChange(){
        this.meetCourseSta=$('#meetCourseStaSelect').val();
        this.getMeetCourseList();
        console.log($('#meetCourseStaSelect').val());
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
            "sPrevious": "上一页",
            "sNext": "下一页",
            "sLast": "末页",
            "sJump": "跳转"
        }
    };

    private returnData={
        "draw":0,
        "recordsTotal":0,
        "recordsFiltered":0,
        "data":[
            {}
        ]
    };

    private schoolCode='';
    public mcl_meetCourseSva='';
    private meetCourseSta='';
    private schudelId='';
    private startTime='';
    private endTime='';
    private pageNum=1;
    private pageSize=10;

    private meetCourseList:any;

    //获取见面课列表
    getMeetCourseList(){
        var _that=this;
        var table = $("#meetCourseList").dataTable({
            "initComplete": function(settings:any, json:any) {
                //初始化后回调
                if(_that.meetCourseList.pageItems.length!=0){
                    let domEle=$(
                        '<a type="button" href="'+_that.parameter.apiUrl +'/api-schedule/l/getLiveInfoPageDownload?schoolCode='+_that.schoolCode + '&searchValue=' + _that.mcl_meetCourseSva + '&status='+ _that.meetCourseSta + '&scheduleId=' + _that.schudelId + '&startTime='+ _that.startTime + '&endTime='+ _that.endTime + '&pageNum=1' + '&pageSize=10000'+'" class="btn btn-block btn-default daochuBtn"' +
                        ' style="float:right;width:80px;">'+
                        '导出</a>'
                    );
                    $($('#meetCourseList_wrapper .row .col-sm-6')[1]).append(domEle);
                }else{
                    let domEle=$(
                        '<a type="button" href="javascript:;" class="btn btn-block btn-default daochuBtnAlert"' +
                        ' style="float:right;width:80px;">'+
                        '导出</a>'
                    );
                    $($('#meetCourseList_wrapper .row .col-sm-6')[1]).append(domEle);
                    setTimeout(()=>{
                        $('.daochuBtnAlert').off('click');
                        $('.daochuBtnAlert').on('click',function(){
                            $("#alertTip").html("当前暂无数据导出!");
                            $('#alertWrap').modal('show');
                            return;
                        });
                    },50);
                }
            },
            "scrollX": true,
            "deferRender": true,
            ordering:false,
            destroy:true,
            language:this.dataTablesLang,
            autoWidth: false,
            stripeClasses: ["odd", "even"],
            processing: true,
            serverSide: true,
            searching: false,
            orderMulti: false,
            order: [],
            renderer: "bootstrap",
            pagingType: "full_numbers",
            columnDefs: [{
                "targets": 'nosort',
                "orderable": false
            }],
            ajax: function (data:any, callback:any, settings:any) {
                var dataDraw=data.draw;
                _that.pageNum=(data.start / data.length)+1;
                _that.pageSize=data.length;
                _that.startTime=$('#starttime').val();
                _that.endTime=$('#endtime').val();
                _that.listService.getMeetCourse(_that.schoolCode,_that.mcl_meetCourseSva,_that.meetCourseSta,_that.schudelId,_that.startTime,_that.endTime,_that.pageNum,_that.pageSize)
                .subscribe(data => {
                    if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                        _that.router.navigateByUrl('login');
                        return;
                    }
                    console.log(eval('('+data['_body']+')'));
                    let resData=eval('('+data['_body']+')');
                    _that.meetCourseList=resData.result;
                    _that.returnData.draw = dataDraw;
                    _that.returnData.recordsTotal = _that.meetCourseList.rowCount;
                    _that.returnData.recordsFiltered = _that.meetCourseList.rowCount;
                    _that.returnData.data = _that.meetCourseList.pageItems;
                    console.log(_that.returnData);
                    callback(_that.returnData);
                });
            },
            columns: [
                { "data": "liveId" },
                { "data": "livecourseId" },
                { "data": "courseName" },
                { "data": "liveName" },
                { "data": "teacherName" },
                {
                    targets:5,
                    data: "startTime",
                    title: "开始时间",
                    render: function(data:any, type:any, row:any, meta:any){
                        if(data==null){
                            return '';
                        }
                        return moment(data).format('YYYY-MM-DD HH:mm');
                    }
                },
                {
                    targets: 6,
                    data: "endTime",
                    title: "结束时间",
                    render: function (data:any, type:any, row:any, meta:any) {
                        if(data==null){
                            return '';
                        }
                        return moment(data).format('YYYY-MM-DD HH:mm');
                    }
                },
                { "data": "provinces" },
                { "data": "schoolName" },
                { "data": "classroomName" },
                {
                    targets: 10,
                    data: "classroomCode",
                    title: "教室编码",
                    render: function (data:any, type:any, row:any, meta:any) {
                        if(data==null || data=='-888'){
                            return '';
                        }else{
                            return data;
                        }
                    }
                },
                { "data": "roomType" },
                { "data": "roomTeacherName" },
                { "data": "roomTeacherPhone" },
                { "data": "daoboName" },
                { "data": "daoBoPhone" },
                { "data": "zhiBanRenName" },
                { "data": "zhiBanRenPhone" },
                { "data": "zhuanYuanName" },
                { "data": "zhuanYuanPhone" }
            ]
        }).api();
    }


    public mcl_schoolList:any;
    getSchoolList(){
        let _that=this;
        this.listService.getSchool()
        .subscribe(data =>{
          console.log('学校列表');
          console.log(data);
          this.mcl_schoolList=data.result;
          $(".schoolListSel").select2();
          $(".schoolListSel").on('change', function (evt:any) {
                _that.schoolCode=this.value;
                _that.getMeetCourseList();
          });
        });
    }

    ngOnInit(): void {
      $(".content-wrapper")[0].style.minHeight=$("body").height()-50+"px";
      this.getSchoolList();
      this.getSchedule();
      $("#starttime").datepicker({
          autoclose: true
      });
      $("#endtime").datepicker({
          autoclose: true
      });
    }

}
