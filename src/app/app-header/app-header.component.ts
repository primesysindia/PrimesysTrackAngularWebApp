import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { User } from '../core/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {

  navbarOpen: boolean = false;
  isUserLoggedIn: boolean;
  loggedUserInfo: User;
  showPayment: boolean = true;
  USAUser: boolean = false;
  getFeatureAddress: any;
  showFeatureAddress: boolean = false;
  showLoadedMsg: boolean = false;

  constructor(private logServ: LoginService, private router: Router) { }

  ngOnInit() {
    // this.getFeatureAddress = localStorage.getItem('featureAdrsAvailable')
    // if (this.getFeatureAddress == 'true') {
    //   this.showFeatureAddress = true;
    //   this.showLoadedMsg = true;
    // }

    this.getLoginStatus()
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  //close navbar after click
  onMenuClick() {
    this.navbarOpen = false;
  }

  getCurrentUserName(){
    return this.loggedUserInfo.userName.charAt(0).toUpperCase() + this.loggedUserInfo.userName.substring(1)
  }

  getLoginStatus(){
    this.isUserLoggedIn = this.logServ.isLoggedIn;
     if(this.isUserLoggedIn){
       this.loggedUserInfo = JSON.parse(localStorage.getItem('currentUserInfo'))
       if(this.loggedUserInfo.socketUrl == '157.230.228.152'){
          this.USAUser = true;
          localStorage.setItem('USAUser',JSON.stringify(this.USAUser))
       }
       else{
          this.USAUser = false;
          localStorage.setItem('USAUser',JSON.stringify(this.USAUser))
       }
       if(this.loggedUserInfo.roleId == 7){
         this.showPayment = true;
       }
       else{
        this.showPayment = false;
       }
     }
     return this.isUserLoggedIn;
  }

  doLogout(){
    this.logServ.logout();
    window.location.reload();
  }
}
