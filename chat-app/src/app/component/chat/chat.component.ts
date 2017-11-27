import { Constant } from '../../common/constant';
import { ReponseCode } from '../../common/response.code';
import { LastChat } from '../../entity/message/lastchat';
import { ResponseData } from '../../entity/response.data';
import { User } from '../../entity/user';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { WebsocketService } from '../../services/websocket.service';
import { Component, OnInit } from '@angular/core';
import {Router, Routes} from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public friendId: string;
  public userId = localStorage.getItem(Constant.USER_ID);

  public isUserDetail = false;
  public ischatHistory = false;
  public isListConversation = true;
  public isSearchUser = false;

  public searchName: string;
  public listSearchUser: User[];
  public listConversasions = new Array<LastChat>();

  constructor(private router: Router,
          private userService: UserService,
          private socketService: WebsocketService,
        private chatService: ChatService) { }

  ngOnInit() {

    if (!localStorage.getItem(Constant.TOKEN)) {
      this.router.navigate(['/login']);
    }
    this.getChatConversation();

  }

  chatHistory(friendId: string) {
    this.isUserDetail = false;
    this.ischatHistory = true;
    this.friendId = friendId;
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
    this.chatService.getChatConversasion().subscribe((data: ResponseData) => {
      if (data.code === ReponseCode.SUCCESSFUL) {
        this.listConversasions = data.data;
      } else if (data.code === ReponseCode.INVALID_TOKEN) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
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
