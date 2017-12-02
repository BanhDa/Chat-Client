import { Constant } from '../../common/constant';
import { ReponseCode } from '../../common/response.code';
import { Message } from '../../entity/message/message';
import { MessageType } from '../../entity/message/messagetype';
import { ResponseData } from '../../entity/response.data';
import { User } from '../../entity/user';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { WebsocketService } from '../../services/websocket.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit, OnChanges {

  @Output('eventChat')
  eventChat: EventEmitter<Message> = new EventEmitter();

  @Input()
  public friendId: string;

  public friend = new User();

  public token = localStorage.getItem(Constant.TOKEN);
  public userId = localStorage.getItem(Constant.USER_ID);
  public inputMessage: string;
  public messages = new Array<Message>();
  public skip = 0;
  public take = 100;

  constructor(private chatService: ChatService,
          private router: Router,
          private socketService: WebsocketService,
          private userService: UserService ) { }

  ngOnInit() {

    console.log('on event chat');
    console.log(this.friendId);
    this.chatService.connectServer(this.token);
    this.listenMessageChat();
    this.getChatHistory();
    this.getUserInfo();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('change');
    if (changes['friendId']) {
      console.log(this.friendId);
      this.getChatHistory();
      this.getUserInfo();
    }
  }

  listenMessageChat() {
    this.on('chat', (data) => {
      console.log(data);
    });
  }

  getChatHistory() {
    console.log(this.friendId);
    this.chatService.getChatHistory(this.friendId, this.skip, this.take).subscribe( (data: ResponseData) => {
      if (data.code === ReponseCode.SUCCESSFUL) {
        this.messages = data.data;
        console.log(this.messages);
      } else if (data.code === ReponseCode.INVALID_TOKEN) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    } );
  }

  getUserInfo() {
    this.userService.getUser(this.friendId).subscribe ( (data: ResponseData) => {
        if (data.code === ReponseCode.SUCCESSFUL) {
        this.friend = data.data;
      } else if (data.code === ReponseCode.INVALID_TOKEN) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
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
        if (message.toUserId === this.friendId) {
          this.messages.push(message);
        } else {
          this.eventChat.emit(message);
        }
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

  sendMessage() {
    console.log('send msg');

    const currentTime = Date.now();

    const message = new Message();
    message.messageId = this.userId + '&' + this.friendId + '&' + currentTime;
    message.fromUserId = this.userId;
    message.toUserId = this.friendId;
    message.value = this.inputMessage;
    message.messageType = MessageType.TEXT;
    message.time = currentTime;

    message.token = this.token;

    this.messages.push(message);
    this.chatService.sendMessage(message);

    this.inputMessage = '';

    this.eventChat.emit(message);
  }

}
