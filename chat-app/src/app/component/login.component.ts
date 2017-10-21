/**
 * New typescript file
 */
import { Component } from '@angular/core';
import { User } from '../entity/user';


@Component({
  selector: 'app-login',
  templateUrl: '../template/login.html',
  styleUrls: ['../bootstrap/css/login.css']
})

export class LoginComponent {
  email = 'tuan';
  password = 'hihi';

  user: User = {
    email : 'hihi',
    password : 'haha'
  };
}
