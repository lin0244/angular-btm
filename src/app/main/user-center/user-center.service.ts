import {Injectable} from '@angular/core';
import {Http, Jsonp, Headers,URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

import { Parameter } from '../../parameter.service';
@Injectable()
export class UserCenterService {
    constructor(private http:Http,private jsonp:Jsonp,private parameter: Parameter){}
    //获取用户列表
    getUserList(pageNum:any,seaVal:any,pageSize:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/user/getUsersBySearch';
        let params = new URLSearchParams();
        params.set('searchValue', seaVal);
        params.set('pageNum', pageNum);
        params.set('pageSize', pageSize);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //新增用户
    addUser(zhsId:any,userName:any,realName:any,email:any,phone:any,available:any,role:any,pic:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/user/createUser';
        let params = new URLSearchParams();
        params.set('zhsId', zhsId);
        params.set('userPic',pic);
        params.set('userName', userName);
        params.set('realName', realName);
        params.set('email', email);
        params.set('phone', phone);
        params.set('available', available);
        params.set('role', role);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //新增时根据智慧树账号查询
    getZhsUserInfo(seaVal:any,flag:any){
        let pageSize="20";
        let pageNum="1";
        let apiUrl = this.parameter.apiUrl+'/api-schedule/user/getZhsUserInfo';
        let params = new URLSearchParams();
        params.set('searchValue', seaVal);
        params.set('flag', flag);
        params.set('pageNum', pageNum);
        params.set('pageSize', pageSize);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }

    //删除用户
    deleteUser(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/user/'+ id +'/delete';

        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    //修改时根据id查询
    getUserById(id:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/user/'+ id +'/getUserById';

        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    //修改用户
    updateUser(realName:any,available:any,role:any,id:any,phone:any){
        let apiUrl = this.parameter.apiUrl+'/api-schedule/user/updateUser';
        let params = new URLSearchParams();
        params.set('realName', realName);
        params.set('available', available);
        params.set('role', role);
        params.set('id', id);
        params.set('phone', phone);

        return this.http.get(apiUrl, { search: params })
          .map(res => res.json());
    }
}
