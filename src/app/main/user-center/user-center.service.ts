import {Injectable} from '@angular/core';
import {Http, Jsonp, Headers,URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

import { Parameter } from '../../parameter.service';
@Injectable()
export class UserCenterService {
    constructor(private http:Http,private jsonp:Jsonp,private parameter: Parameter){}
    //获取用户列表
    getUserList(pageNum:any,seaVal:any,pageSize:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getUserList.json";

        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    //新增用户
    addUser(zhsId:any,userName:any,realName:any,email:any,phone:any,available:any,role:any,pic:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    //新增时根据智慧树账号查询
    getZhsUserInfo(seaVal:any,flag:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getZhsUserInfo.json";

        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    //删除用户
    deleteUser(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    //修改时根据id查询
    getUserById(id:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/getUserById.json";

        return this.http.get(apiUrl)
          .map(res => res.json());
    }

    //修改用户
    updateUser(realName:any,available:any,role:any,id:any,phone:any){
        let apiUrl = "http://localhost:4200/assets/mock-json/returns.json";

        return this.http.get(apiUrl)
          .map(res => res.json());
    }
}
