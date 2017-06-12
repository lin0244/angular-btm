import { Component,OnInit, ViewChild } from '@angular/core';
import { UserCenterService } from './user-center.service';
import {Router} from "@angular/router";

declare var $: any;
declare var unescape:any;

@Component({
  selector: 'app-user-center',
  templateUrl: './user-center.component.html',
  styleUrls: ['./user-center.component.css'],
  providers: [UserCenterService]
})
export class UserCenterComponent implements OnInit {

  constructor(private userCenterService:UserCenterService,public router: Router){}
    public use_updaterealName:any;

    @ViewChild('guanbiadd') guanbiadd:any;
    @ViewChild('guanbidelete') guanbidelete:any;
    @ViewChild('guanbiupdate') guanbiupdate:any;

    private pageNum=1;
    private pageSize="10";
    public use_seaVal="";
    private userList:any;

    //新增时的参数
    @ViewChild('addBtn') addBtn:any;
    public use_addzhsId="";
    public use_adduserName="";
    public use_addrealName="";
    public use_addemail="";
    public use_addphone="";
    private available="";
    private addrole="";
    private addPic="";
    public use_SearchResult=false;
    public use_zhsSearchResult=false;

    //修改和删除时的参数
    private currentUserId="";
    private currentUser:any;
    private currentUseravaliable="";
    private currentUserrole="";

    private zhsFlag="";
    public use_zhsSeaVal="";
    public use_zhsUserInfo:any;

    private roleArr=[
        '管理员','课程负责人','专员','值班人员','运行主管','保障主管'
    ];

    private statusArr=[
        '未启用','启用'
    ];

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
    bindEvent(){
        var that_=this;
        $(".updateBTN").click(function(){
            let curID=this.attributes.value.value;
            that_.getCurrenUserId(curID);
        });
        $(".deleteBTN").click(function(){
            that_.currentUserId=this.attributes.value.value;
        });
    }

    //获取用户列表
    getUserList(){
        var _that=this;
        var table = $("#userList").dataTable({
            "initComplete": function(settings:any, json:any) {
                _that.bindEvent();
            },
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
                _that.userCenterService.getUserList(_that.pageNum,_that.use_seaVal,_that.pageSize)
                .subscribe(data => {
                    console.log(data);
                    _that.userList=data.result;
                    _that.returnData.draw = dataDraw;
                    _that.returnData.recordsTotal = _that.userList.rowCount;
                    _that.returnData.recordsFiltered = _that.userList.rowCount;
                    _that.returnData.data = _that.userList.pageItems;
                    console.log(_that.returnData);
                    callback(_that.returnData);
                    _that.bindEvent();
                });
            },
            columns: [
                { "data": "userName" },
                { "data": "realName" },
                { "data": "email" },
                { "data": "phone" },
                {
                    targets:4,
                    data: "role",
                    title: "角色",
                    render: function(data:any, type:any, row:any, meta:any){
                        return _that.roleArr[data];
                    }
                },
                {
                    targets:5,
                    data: "available",
                    title: "是否启用",
                    render: function(data:any, type:any, row:any, meta:any){
                        return _that.statusArr[data];
                    }
                },
                {
                    targets: 6,
                    data: "id",
                    title: "操作",
                    render: function (data:any, type:any, row:any, meta:any) {
                        return '<a href="" value='+ data +' data-toggle="modal" class="updateBTN" data-target="#changeModal">修改</a> | <a href="" value='+ data +' class="deleteBTN" data-toggle="modal"  data-target="#delModal">删除</a>';
                    }
                }
            ]
        }).api();
    }

    checkMobile(str:any) {
        let re = /^1\d{10}$/;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    }

    //新增用户
    addUser(){
        if($('.select2-userRole').val()=='' || $('.select2-userRole').val()==null){
            $("#alertTip").html('请选择角色类型!');
            $('#alertWrap').modal('show');
            return;
        }
        let fhoneIsTrue=this.checkMobile(this.use_addphone);
        if(!fhoneIsTrue){
            $("#alertTip").html("请填写正确的手机号码格式!");
            $('#alertWrap').modal('show');
            return;
        }
        this.available=$("input.adduseravaliable:checked").val();
        this.addrole=$('.select2-userRole').val();
        this.userCenterService.addUser(this.use_addzhsId,this.use_adduserName,this.use_addrealName,this.use_addemail,this.use_addphone,this.available,this.addrole,this.addPic)
        .subscribe(data => {
            console.log(data);
            if(data.errorCode!="0"){
                $("#alertTip").html(data.errorMsg);
                $('#alertWrap').modal('show');
                return;
            }else if(data.errorCode=="0"){
                this.guanbiadd.nativeElement.click();
                this.use_addzhsId="";
                this.addPic="";
                this.use_adduserName="";
                this.use_addrealName="";
                this.use_addemail="";
                this.use_addphone="";
                this.use_zhsSeaVal="";
                this.use_zhsSearchResult=false;
                this.use_SearchResult=false;
                $("input.adduseravaliable:checked").removeAttr("checked");
                $('input.adduseravaliable').eq(0).prop("checked",'checked');
                $(".select2-userRole").val(null).trigger("change");
                $(".select2-userRole").val("请选择角色").trigger("change");
                this.getUserList();
            }
        });
    }

    //新增查询智慧树
    getZhsUserInfo(){
        this.zhsFlag=$('input[name="seachflga"]:checked').val();
        this.userCenterService.getZhsUserInfo(this.use_zhsSeaVal,this.zhsFlag)
        .subscribe(data => {
            console.log(data);
            console.log(data.result);
            if(data.result!=null){
                if(data.result[0]!=null){
                    this.use_SearchResult=false;
                    this.use_zhsSearchResult=true;
                    this.use_zhsUserInfo=data.result;
                }else{
                    this.use_zhsSearchResult=false;
                    this.use_SearchResult=true;
                }
            }else{
                this.use_zhsSearchResult=false;
                this.use_SearchResult=true;
            }
        });
    }

    //新增窗清空
    addClear(){
        this.use_addzhsId="";
        this.use_adduserName="";
        this.use_addrealName="";
        this.use_addemail="";
        this.use_addphone="";
        this.use_zhsSeaVal="";
        this.addPic="";
        $("input.adduseravaliable:checked").removeAttr("checked");
        $('input.adduseravaliable').eq(0).prop("checked",'checked');
        $(".select2-userRole").val(null).trigger("change");
        $(".select2-userRole").val("请选择角色").trigger("change");
    }

    //从智慧树查询的结果中新增
    addFromZhs(id:any,username:any,realname:any,email:any,mobile:any,pic:any){
        this.addBtn.nativeElement.removeAttribute("disabled");
        this.use_addzhsId=id;
        this.use_adduserName=username;
        this.use_addrealName=realname;
        this.use_addemail=email;
        this.use_addphone=mobile;
        this.addPic=pic;
    }

    //获取当前用户Id
    getCurrenUserId(id:any){
       this.currentUserId= id;
       this.getUserById();
    }

    //删除用户
    deleteUser(){
        console.log(this.currentUserId);
        this.userCenterService.deleteUser(this.currentUserId)
        .subscribe(data=>{
           console.log(data);
           console.log('delete user succeed!');
           this.guanbidelete.nativeElement.click();
           this.getUserList();
        });
    }

     public use_updetazhsId='';
     public use_updateuserName='';
     public use_updateemail='';
     public use_updatephone='';
    //修改时根据id查询信息
    getUserById(){
        console.log(this.currentUserId);
        this.userCenterService.getUserById(this.currentUserId)
        .subscribe(data=>{
           console.log(data);
           this.currentUser=data.result;
           this.use_updaterealName=this.currentUser.realName;
           this.use_updetazhsId=this.currentUser.zhsId;
           this.use_updateuserName=this.currentUser.userName;
           this.use_updateemail=this.currentUser.email;
           this.use_updatephone=this.currentUser.phone;
           this.currentUseravaliable=this.currentUser.available;
           if(this.currentUseravaliable=="1"){
               $('input:radio[name="updateUserStatus"]').eq(1).removeAttr("checked");
               $('input:radio[name="updateUserStatus"]').eq(0).prop("checked",'checked');
           }else if(this.currentUseravaliable=="0"){
               $('input:radio[name="updateUserStatus"]').eq(0).removeAttr("checked");
               $('input:radio[name="updateUserStatus"]').eq(1).prop("checked",'checked');
           };
           this.currentUserrole=this.currentUser.role.toString();
           $(".select2-updateRole").select2('val',this.currentUserrole);
        });
    }

    //修改保存
    updateUser(){
        var _that=this;
        this.currentUseravaliable=$("input.updateavaliable:checked").val();
        this.currentUserrole=$('.select2-updateRole').val();
        let fhoneIsTrue=this.checkMobile(this.use_updatephone);
        if(!fhoneIsTrue){
            $("#alertTip").html("请填写正确的手机号码格式!");
            $('#alertWrap').modal('show');
            return;
        }
        this.userCenterService.updateUser(this.use_updaterealName,this.currentUseravaliable,this.currentUserrole,this.currentUserId,this.use_updatephone)
        .subscribe(data=>{
           console.log(data);
           if(data.successful){
                $("#alertSuccessTip").html('保存成功!');
                $('#alertSuccessWrap').modal('show');
                setTimeout(()=> {
                    $('#alertSuccessWrap').modal('hide');
                    _that.guanbiupdate.nativeElement.click();
                     _that.getUserList();
                }, 1000);
            }else{
                console.log(data);
                $("#alertTip").html(data.errorMsg);
                $('#alertWrap').modal('show');
                return;
            }
        });
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

    ngOnInit():void{
        if(this.getCookie('role')=="0"){
            $(".content-wrapper")[0].style.minHeight=$("body").height()-50+"px";
            this.getUserList();
            $(".select2-userRole").select2({
                placeholder: "请选择角色",
                minimumResultsForSearch: -1
            });
            $(".select2-updateRole").select2({
                minimumResultsForSearch: -1
            });
        }else{
            this.router.navigateByUrl('login');
        }
    }

}
