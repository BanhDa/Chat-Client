import { Component, OnInit } from '@angular/core';
import {Router, Routes} from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public friendId: string;
  public userId: string;

  public isUserDetail = true;
  public isConversation = false;

  constructor(private router: Router) { }

  ngOnInit() {
//    localStorage.removeItem('token');
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }
  }

  conversation() {
    this.isUserDetail = false;
    this.isConversation = true;
  }

  userDetail() {
    console.log('user detail');
    this.friendId = localStorage.getItem('userId');
    console.log(this.friendId);
    this.isConversation = false;
    this.isUserDetail = true;
  }
}
