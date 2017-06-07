import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { Login } from '../login/login.service';
declare var unescape: any;
declare var $: any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [Login]
})
export class MainComponent implements OnInit {
    constructor(public router: Router, private login: Login) {}
    public main_role0 = false;
    public main_role2 = false;
    public main_role3 = false;
    public main_role4 = false;
    public main_role5 = false;
    public main_roleArr = ['管理员', '课程负责人', '专员', '值班人员', '运行主管', '保障主管'];
    public main_role= '';
    public main_realname= '';
    public main_userPic= '';
    deleteCookie(name: any) {
        var date = new Date();
        date.setTime(date.getTime() - 10000); // 设定一个过去的时间即可
        // document.cookie=name+"=v; expires="+date.toGMTString();
        document.cookie = name + '=v; expires=' + date.toUTCString();
    }

    getCookie(name: any) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');    // 把cookie分割成组
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];                      // 取得字符串
            while (c.charAt(0) == ' ') {          // 判断一下字符串有没有前导空格
            c = c.substring(1, c.length);      // 有的话，从第二位开始取
            }
            if (c.indexOf(nameEQ) == 0) {       // 如果含有我们要的name
            return unescape(c.substring(nameEQ.length, c.length));    // 解码并截取我们要值
            }
        }
        return null;
    }

    logOut() {
        this.deleteCookie('role');
        this.deleteCookie('realname');
        this.deleteCookie('userPic');
        this.deleteCookie('zhsId');
        this.login.invalidateSession()
        .subscribe(data => {
            console.log(data);
        });
        this.router.navigateByUrl('login');
    }

    // 修复bootstrap模态框上面弹出模态框，当一个模态框隐藏后 滚动鼠标 整个页面滚动问题
    addCeng() {
        $('#alertWrap').on('hidden.bs.modal', function (e: any) {
           if ($('#fankui').hasClass('in') || $('#arrangeRenyuan').hasClass('in') || $('#daobo').hasClass('in') || $('#cUfenpei').hasClass('in') || $('#nSfenpei').hasClass('in') ||$('#arrangementDetail').hasClass('in') || $('#pingfen').hasClass('in') || $('#feedback').hasClass('in')) {
                $('body').addClass('modal-open');
            }
        });
    }

    ngOnInit(): void {
        $(".content-wrapper")[0].style.minHeight=$("body").height()-50+"px";
        // this.router.navigateByUrl('main/watch');
        if(this.getCookie('role') != null) {
            this.main_role=this.getCookie('role');
            this.main_realname=decodeURIComponent(this.getCookie('realname'));
            if(decodeURIComponent(this.getCookie('userPic'))=="" || decodeURIComponent(this.getCookie('userPic'))==null || decodeURIComponent(this.getCookie('userPic'))==undefined){
                this.main_userPic='http://pk.livecourse.com/imgs/people.png';
            }else{
                this.main_userPic=decodeURIComponent(this.getCookie('userPic'));
            }
            setTimeout(()=>{
                this.addCeng();
            },1000);
            if(this.getCookie('role') == "0"){
                this.main_role0=true;
                this.router.navigateByUrl('main/userCenter');
                return;
            }else if(this.getCookie('role') == "2"){
                this.main_role2=true;
                this.router.navigateByUrl('main/commissioner');
                return;
            }else if(this.getCookie('role') == "3"){
                this.main_role3=true;
                this.router.navigateByUrl('main/watch');
                return;
            }else if(this.getCookie('role') == "4"){
                this.main_role4=true;
                this.router.navigateByUrl('main/director');
                return;
            }else if(this.getCookie('role') == "5"){
                this.main_role5=true;
                this.router.navigateByUrl('main/guarantee');
                return;
            }
        }else{
            this.router.navigateByUrl('login');
        }
    }
}
