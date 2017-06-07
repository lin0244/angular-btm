import { Component,OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseListService } from './course-list.service';
import {Router} from "@angular/router";
declare var $: any;
declare var moment: any;

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
  providers: [CourseListService]
})
export class CourseListComponent implements OnInit {

  constructor(private route: ActivatedRoute,private listService:CourseListService,public router: Router){}

    private pageNum=1;
    private pageSize=10;
    private courseList:any;
    private courseSta='';
    private scheduleId='';
    public col_courseSva='';

    private statusArr=['未开始','待排','进行中','预排完成','异常','已确认','已发布'];

    //获取路径中的课表id以及状态
    getParmsbyUrl(){
        this.route.params.subscribe((params)=>{
            if(params['idSta'].split("-")[0]=='scheduleId'){
                this.scheduleId='';
            }else{
                this.scheduleId=params['idSta'].split("-")[0];
            }
            if(params['idSta'].split("-")[1]=='status'){
                this.courseSta='';
            }else{
                $('#courseStaSelect').val(params['idSta'].split("-")[1]);
                this.courseSta=params['idSta'].split("-")[1];
            }
            this.getCourseList();
        });
    }

    //切换课程状态
    staChange(){
        this.courseSta=$('#courseStaSelect').val();
        this.getCourseList();
        console.log($('#courseStaSelect').val());
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

    //获取课程列表
    getCourseList(){
        var _that=this;
        var table = $("#courseList").dataTable({
            "initComplete": function(settings:any, json:any) {
                //初始化后回调
            },
            "scrollX": true,
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
                _that.listService.getCourse(_that.courseSta,_that.scheduleId,_that.col_courseSva,_that.pageNum,_that.pageSize)
                .subscribe(data => {
                    if(data['url']=='http://previewpk.livecourse.com/index.html' || data['url']=='http://pk.livecourse.com/index.html'){
                        _that.router.navigateByUrl('login');
                        return;
                    }
                    console.log(eval('('+data['_body']+')'));
                    let resData=eval('('+data['_body']+')');
                    _that.courseList=resData.result;
                    _that.returnData.draw = dataDraw;
                    _that.returnData.recordsTotal = _that.courseList.rowCount;
                    _that.returnData.recordsFiltered = _that.courseList.rowCount;
                    _that.returnData.data = _that.courseList.pageItems;
                    console.log(_that.returnData);
                    callback(_that.returnData);
                });
            },
            columns: [
                { "data": "recruitName" },
                { "data": "id" },
                { "data": "courseName" },
                { "data": "schoolName" },
                { "data": "liveQuantity" },
                { "data": "courseDirector" },
                {
                    targets:6,
                    data: "status",
                    title: "状态",
                    render: function(data:any, type:any, row:any, meta:any){
                        return _that.statusArr[data];
                    }
                },
                {
                    targets: 7,
                    data: "updateTime",
                    title: "更新时间",
                    render: function (data:any, type:any, row:any, meta:any) {
                        if(data==null){
                            return '';
                        }
                        return moment(data).format('YYYY-MM-DD HH:mm');
                    }
                }
            ]
        }).api();
    }

    ngOnInit(): void {
        $(".content-wrapper")[0].style.minHeight=$("body").height()-50+"px";
        this.getParmsbyUrl();
    }

}
