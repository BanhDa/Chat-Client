import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import {Router, Routes} from '@angular/router';

import { UserService } from '../../services/user.service';
import { User } from '../../entity/user';
import { ResponseData } from '../../entity/response.data';
import { ReponseCode } from '../../common/response.code';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css']
})

export class UserdetailComponent implements OnInit, OnChanges {

  @Input() friendId: string;

  userDetail = new User();

  constructor(private userService: UserService, private router: Router ) { }

  ngOnInit() {
    console.log('hihi');
//    console.log(this.friendId);
//    this.friendId = localStorage.getItem('userId');
//    console.log(this.friendId);
//    this.userService.getUser(this.friendId).subscribe ( (data: ResponseData) => {
//      if (data.code === ReponseCode.SUCCESSFUL) {
//        this.userDetail = data.data;
//      } else if (data.code === ReponseCode.INVALID_TOKEN) {
//        localStorage.clear();
//        this.router.navigate(['/login']);
//      }
//    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('change');
    if (changes['friendId']) {
      console.log(this.friendId);
      this.getUserInfo(this.friendId);
    }
  }

  getUserInfo(userId: string) {
    this.userService.getUser(userId).subscribe ( (data: ResponseData) => {
        if (data.code === ReponseCode.SUCCESSFUL) {
        this.userDetail = data.data;
      } else if (data.code === ReponseCode.INVALID_TOKEN) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
      });
  }

  logout() {
    console.log('logout');
    this.userService.logout().subscribe( (data: ResponseData) => {
      if (data.code === ReponseCode.SUCCESSFUL) {
        console.log('clear data');
        localStorage.clear();
        this.router.navigate(['/login']);
      } else if (data.code === ReponseCode.INVALID_TOKEN) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
