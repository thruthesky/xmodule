/**
 * app-header.ts
 * 
 * 이 컴포넌트는 각 프로젝트 마다 커스터마이징을 해야한다.
 * 
 */
import { Component, Input } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Xapi } from '../providers/xapi';
import { PageController } from '../providers/page-controller';
@Component({
    selector: 'xapi-header',
    template: `
        <ion-navbar>
            <!--
            <ion-buttons left>
                <button (click)="onClickHome()">
                    <ion-icon name="home"></ion-icon>
                </button>
            </ion-buttons>
            -->

            <ion-title>
                {{ appTitle }}
                {{ subTitle }}
            </ion-title>
            
            <ion-buttons right>
                <button ion-button color="primary" login *ngIf="loggedIn " (click)="onClickLogout()">Logout</button>
                <button ion-button color="primary" login *ngIf=" ! loggedIn " (click)="onClickLogin()">Login</button>
                <button ion-button color="primary" login *ngIf=" ! loggedIn " (click)="onClickRegister()">Register</button>
                <button ion-button (click)="onClickPost( )" *ngIf="!hideCreateButton"><ion-icon name="create"></ion-icon></button>
                <button ion-button (click)="onClickSearch( )"><ion-icon name="search"></ion-icon></button>
            </ion-buttons>

        </ion-navbar>
    `
})
export class HeaderComponent {
    @Input() appTitle: string = "AppTitle";
    @Input() hideCreateButton: boolean;

    static initialized: boolean;
    public loggedIn: boolean = false;
    public subTitle: string = '';
    constructor(
        private navCtrl: NavController,
        private events: Events,
        private x: Xapi
    ) {
        this.initialize();
        // console.log('PageController:', PageController.page);
    }
    initialize() {
        this.x.getLoginData( x => this.loggedIn = true, () => this.loggedIn = false );
        this.events.subscribe( 'login', ( u ) => {
            console.log('HeaderComponent::constructor::event login');
            this.login(u);
        } );
        this.events.subscribe( 'register', (u) => {
            console.log('HeaderComponent::regiter');
            this.login(u);
        });
        this.events.subscribe( 'logout', () => {
            console.log('HeaderComponent::constructor::event logout');
            this.logout();
        } );
        this.events.subscribe( 'resign', () => {
            console.log('HeaderComponent::constructor::event resign');
            this.logout();
        });
    }
    login(u) {
        this.loggedIn = true;
    }
    logout() {
        this.loggedIn = false;
    }

    onClickLogin() {
        console.log('app-header::onClickLogin() : ');
        //this.navCtrl.push( Login );
        PageController.push( 'login', this );
    }
    
    onClickRegister() {
        console.log('app-header::onClickRegister() : ');
        //this.navCtrl.push( Login );
        PageController.push( 'register', this );
    }

    onClickLogout() {
        this.x.logout();
        this.x.alert("로그아웃", "로그아웃하였습니다.");
        this.loggedIn = false;
    }

    onClickPost( ) {
        console.log('HeaderComponent::onClickPost()');
        PageController.push( 'postEdit', this );
    }

    onClickSearch() {

    }

}
