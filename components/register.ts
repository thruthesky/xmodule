import { Component, Output, EventEmitter } from '@angular/core';
import { Xapi } from '../providers/xapi';
import * as wi from '../interfaces/wordpress';
@Component({
  selector: 'xapi-register',
  template: `
    <ion-list>
      <ion-item>
        <ion-label primary stacked>{{t.User_ID}}</ion-label>
        <ion-input [(ngModel)]="user.user_login" placeholder="{{t.Input_User_ID}}"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label primary stacked>{{t.Password}}</ion-label>
        <ion-input [(ngModel)]="user.user_pass" placeholder="{{t.Input_Password}}"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label primary stacked>{{t.Email}}</ion-label>
        <ion-input [(ngModel)]="user.user_email" placeholder="{{t.Input_Email}}"></ion-input>
      </ion-item>

      <ion-item *ngIf="o.Name">
        <ion-label primary stacked>{{t.Name}}</ion-label>
        <ion-input [(ngModel)]="user.name" placeholder="{{t.Input_Name}}"></ion-input>
      </ion-item>

      <ion-item *ngIf="o.Mobile">
        <ion-label primary stacked>{{t.Mobile}}</ion-label>
        <ion-input [(ngModel)]="user.mobile" placeholder="{{t.Input_Mobile}}"></ion-input>
      </ion-item>

      <ion-item *ngIf="o.Birthday">
        <ion-label primary stacked>{{t.Birthday}}</ion-label>
        <ion-input [(ngModel)]="user.birthday" placeholder="{{t.Input_Birthday}}"></ion-input>
      </ion-item>

      <ion-item *ngIf="o.Gender">
        <ion-label primary stacked>{{t.Gender}}</ion-label>
        <ion-input [(ngModel)]="user.gender" placeholder="{{t.Input_Gender}}"></ion-input>
      </ion-item>

      <ion-item>
        <button ion-button (click)="onClickRegister()">{{t.Register}}</button>
        <button ion-button (click)="onClickCancel()">{{t.Cancel}}</button>
      </ion-item>

  </ion-list>
  `,
  providers: [ Xapi ]
})
export class RegisterComponent {
  private user: wi.UserRegisterData = wi.userRegisterData;
  t = {
    User_ID: 'User ID',
    Password: 'Password',
    Name: 'Name',
    Email: 'Email',
    Mobile: 'Mobile No.',
    Birthday: 'Birthday',
    Gender: 'Gender',
    Input_User_ID: 'Input User ID',
    Input_Password: 'Input Password',
    Input_Email: 'Input Email',
    Input_Name: 'Input Name',
    Input_Mobile: 'Input Mobile',
    Input_Birthday: 'Input Birthday',
    Input_Gender: 'Input Gender',
    Register: 'Register',
    Update: 'Update',
    Cancel: 'Cancel'
  };
  /**
   * 이 값을 앱에서 변경하여 원하는 필드를 보이지 않게 할 수 있다.
   */
  public o = {
    Name: true,
    Mobile: true,
    Birthday: true,
    Gender: true
  };
  @Output() beforeRequest = new EventEmitter<RegisterComponent>();
  @Output() afterRequest = new EventEmitter<RegisterComponent>();
  @Output() success = new EventEmitter<wi.UserData>();
  @Output() cancel = new EventEmitter<RegisterComponent>();
  @Output() error = new EventEmitter<string>();

  constructor(
    private x: Xapi
  ) {
    console.log('RegisterComponent::constructor()');
    this.x.getLoginData( user => this.userLoggedIn( user ) );
  }

  /**
   * 회원이 이미 로그인을 한 경우 이 함수가 호출된다.
   * 회원이 로그인을 했으면,
   *  1. 로그인 관련 정보 출력
   *  2. 서버로 부터 로그인 사용자의 정보를 추출하여 폼에 입력
   */
  userLoggedIn( user: wi.UserData ) {
    this.t.Register = this.t.Update;
//    this.x.get_user( user.user_login, u => onGetUser( u ), e => onGetUserError( e ) )
  }

  /**
   * 회원 가입
   * @attention 서버 에러가 발생한 겨우에는 이벤트가 발생되지 않는다.
   *    'error' 이벤트는 서버로 쿼리가 올바로 되었는데, 프로그램적으로 logical 에러가 발생한 경우 이벤트를 trigger 한다.
   */
  onClickRegister() {
    console.log("RegisterComponent::onClickRegister()");
    this.beforeRequest.emit(this);
    this.x.register( this.user, ( re: wi.RegisterResponse ) => {
      this.afterRequest.emit(this);
      if ( re.success ) {
        console.log("RegisterComponent::onClickRegister() success");
        this.success.emit( re.data );
      }
      else {
        console.log("RegisterComponent::onClickRegister() error");
        this.error.emit( <string>re.data );
      }
    },
    ( err ) => {
      this.afterRequest.emit(this);
      console.log('RegisterComponent::onClickRegister() error: ', err);
      // 서버 에러가 발생한 경우에는 이벤트가 발생하지 않는다.
      //this.error.emit('server_error');
    });
  }

  onClickCancel() {
    console.log("RegisterComponent::onClickCancel()");
    this.cancel.emit(this);
  }
  


}
