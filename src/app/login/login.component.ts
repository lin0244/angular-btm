import { Component, AfterViewInit } from '@angular/core';
import {Router} from '@angular/router';

import { Login } from './login.service';
declare var escape: any;
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ Login ]
})
export class LoginComponent {
  constructor(public router: Router, private login: Login) {}
  public login_userName= '';
  public login_passWord= '';
  setCookie(name: any, value: any) {
        if (name === 'realname') {
            var cookieString = name + '=' + escape(value);
        }else {
            var cookieString = name + '=' + encodeURIComponent(value);
        }
        let newDate = new Date();
        newDate.setTime(newDate.getTime() + 1800 * 1000);   //设置半小时登录过期（清除本地cookie）
        // cookieString=cookieString+"; expires="+newDate.toGMTString();
        cookieString = cookieString + '; expires=' + newDate.toUTCString();
        document.cookie = cookieString;
    }

    useLogin() {
        // this.router.navigateByUrl('main');
        this.login.useLogin(this.login_userName, this.login_passWord)
        .subscribe(data => {
            let resData=eval('('+data['_body']+')');
            console.log(resData);
            if (resData.successful) {
                //以下模拟不同角色登录验证
                if(this.login_userName=='role0'){
                    this.setCookie('role', "0");
                }else if(this.login_userName=='role1'){
                    this.setCookie('role', "1");
                }else if(this.login_userName=='role2'){
                    this.setCookie('role', "2");
                }else if(this.login_userName=='role3'){
                    this.setCookie('role', "3");
                }else if(this.login_userName=='role4'){
                    this.setCookie('role', "4");
                }else{
                    $('#alertTip').html('用户信息错误!');
                    $('#alertWrap').modal('show');
                    return;
                }
                this.setCookie('realname', resData.result.realName);
                this.setCookie('userPic', resData.result.userPic);
                this.router.navigateByUrl('main');
            }else {
                $('#alertTip').html('用户信息错误!');
                $('#alertWrap').modal('show');
            }
        });
    }

    ngAfterViewInit(): void {
         if ($('.modal-backdrop').length > 0) {
             $('.modal-backdrop').remove();
         }
    }
}
