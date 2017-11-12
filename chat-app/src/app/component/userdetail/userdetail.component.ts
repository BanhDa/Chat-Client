import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../entity/user';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css']
})
export class UserdetailComponent implements OnInit, OnChanges {

  @Input()
  friendId: string;
  userDetail = new User();

  constructor(private userService: UserService ) { }

  ngOnInit() {
    console.log('hihi');
    console.log(this.friendId);
    this.userDetail = this.userService.getUser(this.friendId);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('change');
    if (changes['friendId']) {
      console.log(this.friendId);
      this.userDetail = this.userService.getUser(this.friendId);
    }
  }

  getUserInfo() {
    this.userDetail = this.userService.getUser(this.friendId);
  }
}
