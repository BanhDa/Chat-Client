/**
 * New typescript file
 */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {Router, Routes} from '@angular/router';

import { ReponseCode } from '../common/response.code';

import { User } from '../entity/user';
import { ResponseData } from '../entity/response.data';

import { UserService } from '../services/user.service';
import { ResponseContentType } from '@angular/http';

@Component({
  selector: 'app-login',
  templateUrl: '../template/login.html',
  styleUrls: ['../bootstrap/css/login.css']
})

export class LoginComponent implements OnInit {
  loginUser = new User();
  registerUser = new User();

  constructor(private userService: UserService, private router: Router) { }

  loginForm: FormGroup;
  registerForm: FormGroup;

  ngOnInit() {
    this.registerForm = new FormGroup({
      'registerName' : new FormControl(this.registerUser.userName, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]),
      'registerEmail' : new FormControl(this.registerUser.email, [
        Validators.required
      ]),
      'registerPassword' : new FormControl(this.registerUser.password, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  login() {
    this.userService.login(this.loginUser).subscribe( (data: ResponseData) => {
      console.log(data.data);
      this.loginUser = data.data;
      if (data.code === ReponseCode.SUCCESSFUL ) {
        console.log(data.code);
        this.router.navigate(['/conversation']);
      }
    });
  }

  register() {
    this.userService.register(this.registerUser).subscribe( (data: ResponseData) => {
      console.log('response register');
      console.log(data);
    });
  }

}
