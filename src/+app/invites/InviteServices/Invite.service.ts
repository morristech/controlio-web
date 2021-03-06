import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'

import { AppConfig } from '../../app.config';
import { AppHeaders, AppHttp } from '../../HTTPHelper';
import { ProjectModel } from '../../projects';
import { InviteModel } from '../models';

import { UserModel } from '../../users';


@Injectable()
export class InviteService {
  private baseUrl: string = '/projects';
  private mainUrl: string;
  constructor(private http: AppHttp, private headers: AppHeaders ){
    this.mainUrl = AppConfig.API_ENDPOINT;
  }

  getInvites( userid: string ){
    let request = this.http
      .get( this.baseUrl + '/invites', { userid });
    return request
      .map((res) => {
        return res.map((elem)=> {
          elem.sender = new UserModel(elem.sender)
          elem.project = new ProjectModel(elem.project)
          return new InviteModel(elem)
        });
      });
  }

  accept(userid: string, inviteid: string, accept: boolean){
    let request = this.http
      .post( this.baseUrl + '/invite', { userid, inviteid, accept });
    return request
      .map((res) => {
        console.log(res);
        return res;
      });
  }

  delete(userId: string, inviteId: string){
    let request = this.http
      .delete( this.baseUrl + '/invite',{},{ userId, inviteId });
    return request
      .map((res) => {
        console.log(res);
        return res;
      });
  }
}
