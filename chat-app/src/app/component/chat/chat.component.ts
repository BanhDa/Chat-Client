import { Constant } from '../../common/constant';
import { ReponseCode } from '../../common/response.code';
import { LastChat } from '../../entity/message/lastchat';
import { Message } from '../../entity/message/message';
import { MessageType } from '../../entity/message/messagetype';
import { ResponseData } from '../../entity/response.data';
import { User } from '../../entity/user';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { WebsocketService } from '../../services/websocket.service';
import { Component, OnInit } from '@angular/core';
import {Router, Routes} from '@angular/router';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public friendId = '';
  public userId = localStorage.getItem(Constant.USER_ID);
  public token = localStorage.getItem(Constant.TOKEN);

  public isUserDetail = false;
  public ischatHistory = false;
  public isListConversation = true;
  public isSearchUser = false;

  public searchName: string;
  public listSearchUser: User[];
  public listConversasions = new Array<LastChat>();

  public messageText = MessageType.TEXT;
  public messageImage = MessageType.IMAGE;

  constructor(private router: Router,
          private userService: UserService,
          private socketService: WebsocketService,
        private chatService: ChatService) { }

  ngOnInit() {

    if (!this.token) {
      this.router.navigate(['/login']);
    }
    this.listenMessageChat();
    this.chatService.connectServer(this.token);
    this.getChatConversation();

  }

  listenMessageChat() {
    this.on('chat', (data) => {
      console.log(data);
    });
  }

  on(event: string, callBack: any): Observable<Message> {
    if (this.existsEvent(event)) {
      return;
    }
    this.socketService.events.push(event);
    if (this.socketService.socket) {
      this.socketService.socket.on(event, (message: Message) => {
        console.log('reveiver data from server');
        console.log(message);

        this.onChange(message);
      });
    }
  }

  existsEvent(event: string): boolean {
    let i: number;
    for (i = 0; i < this.socketService.events.length; i++) {
      if (this.socketService.events[i] === event) {
        return true;
      }
    }

    return false;
  }

  chatHistory(friendId: string) {
    console.log('chat history user id');
    console.log(friendId);
    this.isUserDetail = false;
    this.ischatHistory = true;

    this.isListConversation = true;
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
        this.isListConversation = true;
        this.isSearchUser = false;
        this.listConversasions = data.data;
        this.updateLastChatDateTime();
      } else if (data.code === ReponseCode.INVALID_TOKEN) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  updateLastChatDateTime() {
    let i = 0;
    console.log('update last chat time');
    for (i = 0; i < this.listConversasions.length; i++) {
      const time = this.listConversasions[i].time;
      this.listConversasions[i].timeDate = new Date(time);
      console.log(this.listConversasions[i].timeDate);
    }
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

  onChange(message: Message) {
//    push last chat
    console.log('update last chat');
    console.log(message);

    let newChat = true;
    let i = 0;
    for (i = 0; i < this.listConversasions.length; i++) {
      const lastMessage = this.listConversasions[i];
      if (lastMessage.userId === message.toUserId
        || lastMessage.userId === message.fromUserId) {

        if (message.messageType === MessageType.TEXT) {
          lastMessage.value = message.value;
        } else if (message.messageType === MessageType.IMAGE) {
          lastMessage.value = Constant.MESSAGE_IMAGE;
        }

        lastMessage.timeDate = new Date();
        lastMessage.time = Date.now();

//      if user which send message is not current user, increase unread number
        if (message.fromUserId !== this.friendId && message.fromUserId !== this.userId) {
          if (lastMessage.unreadNumber === null || lastMessage.unreadNumber === 0) {
            lastMessage.unreadNumber = 1;
          } else {
            lastMessage.unreadNumber++;
          }
        }

        newChat = false;
      }
    }

    if (newChat) {
      const newLastChat = this.parseMessageIntoLastChat(message);

      this.userService.getUser(this.friendId).subscribe ( (data: ResponseData) => {
        if (data.code === ReponseCode.SUCCESSFUL) {
          const user: User = data.data;
          newLastChat.userId = user.userId;
          newLastChat.userName = user.userName;
          newLastChat.avatar = user.avatar;
          if (message.fromUserId !== this.friendId && message.fromUserId !== this.userId) {
            newLastChat.unreadNumber = 1;
          }
          this.listConversasions.push(newLastChat);

          this.listConversasions.sort( (last1: LastChat, last2: LastChat) => {
            return last1.time > last2.time ? 1 : last1.time === last2.time ? 0 : -1;
          } );

        } else if (data.code === ReponseCode.INVALID_TOKEN) {
          localStorage.clear();
          this.router.navigate(['/login']);
        }
        });
    } else {
      this.listConversasions.sort( (last1: LastChat, last2: LastChat) => {
        return last1.time > last2.time ? 1 : last1.time === last2.time ? 0 : -1;
      } );
    }
  }

  parseMessageIntoLastChat(message: Message): LastChat {
    const newLastChat = new LastChat();

    newLastChat.id = message.id;
    newLastChat.fromUserId = message.fromUserId;
    newLastChat.toUserId = message.toUserId;
    newLastChat.messageId = message.messageId;
    newLastChat.messageType = message.messageType;
    newLastChat.value = message.value;
//  parse string to number by + operator
    newLastChat.time = +message.time;
    newLastChat.timeDate = new Date(message.time);
    newLastChat.readTime = message.readTime;

    return newLastChat;
  }
}
