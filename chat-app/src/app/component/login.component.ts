/**
 * New typescript file
 */
import { Component, OnInit } from '@angular/core';

import { User } from '../entity/user';
import { ResponseData } from '../entity/response.data';

import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: '../template/login.html',
  styleUrls: ['../bootstrap/css/login.css']
})

export class LoginComponent {
  user = new User();

  constructor(private userService: UserService) { }

  login() {
    this.userService.login(this.user).subscribe( (data: ResponseData) => {
      console.log(data.data);
      this.user = data.data;
      console.log(this.user);
    });
  }

  register() {
    this.userService.register(this.user).subscribe( (data: ResponseData) => {
      console.log('response register');
      console.log(data);
    });
  }

}
