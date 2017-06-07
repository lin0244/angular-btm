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
  // tslint:disable-next-line:member-ordering
  public login_userName= '';
  public login_passWord= '';
  setCookie(name: any, value: any) {
        if (name === 'realname') {
            var cookieString = name + '=' + escape(value);
        }else {
            var cookieString = name + '=' + encodeURIComponent(value);
        }
        let newDate = new Date();
        newDate.setTime(newDate.getTime() + 1800 * 1000);
        // cookieString=cookieString+"; expires="+newDate.toGMTString();
        cookieString = cookieString + '; expires=' + newDate.toUTCString();
        document.cookie = cookieString;
    }

    useLogin() {
        // this.router.navigateByUrl('main');
        this.login.useLogin(this.login_userName, this.login_passWord)
        .subscribe(data => {
            console.log(data);
            if (data.successful) {
                this.setCookie('role', data.result.role);
                this.setCookie('realname', data.result.realName);
                this.setCookie('userPic', data.result.userPic);
                this.setCookie('zhsId', data.result.zhsId);
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
