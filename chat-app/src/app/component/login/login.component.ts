/**
 * New typescript file
 */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Router, Routes} from '@angular/router';

import { ReponseCode } from '../../common/response.code';

import { User } from '../../entity/user';
import { ResponseData } from '../../entity/response.data';

import { UserService } from '../../services/user.service';
import { ResponseContentType } from '@angular/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['../../bootstrap/css/login.css']
})

export class LoginComponent implements OnInit {
  loginUser = new User();
  registerUser = new User();

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/chat']);
    }
  }

  login() {
    this.userService.login(this.loginUser).subscribe( (data: ResponseData) => {
      console.log(data);
      this.loginUser = data.data;
      if (data.code === ReponseCode.SUCCESSFUL ) {
        localStorage.setItem('user', JSON.stringify(data.data) );
        localStorage.setItem('userId', this.loginUser.userId);
        localStorage.setItem('token', data.token);
        this.router.navigate(['/chat']);
      }
    });
  }

  register() {
    this.userService.register(this.registerUser).subscribe( (data: ResponseData) => {
      console.log('response register');
      console.log(data);
      this.registerUser = data.data;
      if (data.code === ReponseCode.SUCCESSFUL ) {
        localStorage.setItem('user', JSON.stringify(data.data) );
        localStorage.setItem('userId', this.registerUser.userId);
        localStorage.setItem('token', data.token);
        this.router.navigate(['/chat']);
      }
    });
  }

}
