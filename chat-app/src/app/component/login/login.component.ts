/**
 * New typescript file
 */
import { Constant } from '../../common/constant';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Router, Routes} from '@angular/router';

import { ReponseCode } from '../../common/response.code';

import { User } from '../../entity/user';
import { ResponseData } from '../../entity/response.data';

import { UserService } from '../../services/user.service';
import { ResponseContentType } from '@angular/http';
import { MessageError } from '../../common/message.error';
import { Utils } from '../../common/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['../../bootstrap/css/login.css']
})

export class LoginComponent implements OnInit {
  loginUser = new User();
  registerUser = new User();
  public messageAlert = '';
  public showDialogAlert = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/chat']);
    }
    this.registerUser.birthday = '1995-01-01';
  }

  login() {
    if (this.validateLogin()) {
      this.userService.login(this.loginUser).subscribe( (data: ResponseData) => {
        console.log(data);
        this.loginUser = data.data;
        if (data.code === ReponseCode.SUCCESSFUL ) {
          localStorage.setItem('user', JSON.stringify(data.data) );
          localStorage.setItem('userId', this.loginUser.userId);
          localStorage.setItem('token', data.token);
          this.router.navigate(['/chat']);
        } else if (data.code === ReponseCode.INVALID_TOKEN) {
          localStorage.clear();
          this.router.navigate(['/login']);
        } else {
          this.showDialogAlertError(data.data);
        }
      });
    }
  }

  validateLogin(): boolean {
    return this.validateEmail(this.loginUser.email) 
          && this.validatePassword(this.loginUser.password);
  }

  validateRegister(): boolean {
    console.log(this.registerUser);
    return this.validateEmail(this.registerUser.email) 
          && this.validatePassword(this.registerUser.password)
          && this.validDateUserName(this.registerUser.userName);
  }

  validateEmail(email: string): boolean {
    if ( !Utils.validString(email) ) {
      this.showDialogAlertError(MessageError.EMAIL_REQUIRED);
      return false;
    } else if (!Constant.EMAIL_REGEX.test(email)) {
      this.showDialogAlertError(MessageError.VALID_EMAIL);
      return false;
    } else {
      return true;
    }
  }

  validDateUserName(userName: string): boolean {
    if (Utils.validString(userName)) {
      return true;
    } else {
      this.showDialogAlertError(MessageError.USER_NAME_REQUIRED);
      return false;
    }
  }

  validatePassword(password: string): boolean {
    if ( Utils.validString(password) ) {
      return true;
    } else {
      this.showDialogAlertError(MessageError.PASSWORD_REQUIRED);
      return false;
    }
  }

  register() {
    if (this.validateRegister()) {
      this.userService.register(this.registerUser).subscribe( (data: ResponseData) => {
        console.log('response register');
        console.log(data);
        this.registerUser = data.data;
        if (data.code === ReponseCode.SUCCESSFUL ) {
          localStorage.setItem('user', JSON.stringify(data.data) );
          localStorage.setItem('userId', this.registerUser.userId);
          localStorage.setItem('token', data.token);
          this.router.navigate(['/chat']);
        } else if (data.code === ReponseCode.INVALID_TOKEN) {
          localStorage.clear();
          this.router.navigate(['/login']);
        } else {
          this.showDialogAlertError(data.data);
        }
      });
    }
  }

  showDialogAlertError(message: string) {
    this.messageAlert = message;
    this.showDialogAlert = !this.showDialogAlert;
  }
}
