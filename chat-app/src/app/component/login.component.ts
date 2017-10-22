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

export class LoginComponent implements OnInit {
  email = 'tuan';
  password = 'hihi';

  user: User = {
    email : 'hihi',
    password : 'haha'
  };

  constructor(private userService: UserService) { }

  data = {};

  ngOnInit() {
    this.user.email = 'tuan@gmail.com';
    this.user.password = '1234';
    this.login();
  }


  login() {
    this.userService.getUser().subscribe(data => {
      this.data = data;
      console.log('data : ' + data);
      this.user.email = 'tuan@gmail.com';
      this.user.password = '1234';
    });
  }

}
