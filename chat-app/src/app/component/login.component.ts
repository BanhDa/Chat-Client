/**
 * New typescript file
 */
import { Component, OnInit } from '@angular/core';
import { User } from '../entity/user';

import { UserService } from '../services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: '../template/login.html',
  styleUrls: ['../bootstrap/css/login.css']
})

export class LoginComponent {
  user: User = {
    email : 'hihi',
    password : 'haha'
  };

  constructor(private userService: UserService) { }

  data = {};

//  ngOnInit() {
//    this.user.email = 'tuan@gmail.com';
//    this.user.password = '1234';
//    this.login();
//  }


  login() {
    this.userService.getUser().subscribe(data => {
      console.log(data);
      this.user = data;
    });
  }

}
