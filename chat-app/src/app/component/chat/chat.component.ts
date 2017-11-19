import { ReponseCode } from '../../common/response.code';
import { ResponseData } from '../../entity/response.data';
import { User } from '../../entity/user';
import { UserService } from '../../services/user.service';
import { Component, OnInit } from '@angular/core';
import {Router, Routes} from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public friendId: string;
  public userId = localStorage.getItem('userId');

  public isUserDetail = true;
  public ischatHistory = false;
  public isListConversation = false;
  public isSearchUser = false;

  public searchName: string;
  public listSearchUser: User[];

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }
  }

  chatHistory() {
    this.isUserDetail = false;
    this.ischatHistory = true;
  }

  userDetail(userId: string) {
    console.log('user detail');

    this.friendId = userId;
    console.log(this.friendId);
    this.ischatHistory = false;
    this.isUserDetail = true;
  }

  getChatConversation() {
    console.log('chat conversation');
  }

  searchUser() {
    console.log('search user');
    console.log(this.searchName);
    this.userService.searchUser(this.searchName, 0, 10).subscribe( (data: ResponseData) => {
      console.log('resutl search :');
      console.log(data);
      if (data.code === ReponseCode.SUCCESSFUL) {

        this.isSearchUser = true;
        this.isListConversation = false;

        this.listSearchUser = data.data;
        console.log('list search user');
        console.log(this.listSearchUser);
      } else if (data.code === ReponseCode.INVALID_TOKEN) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
