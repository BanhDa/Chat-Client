import { Constant } from '../../common/constant';
import { ReponseCode } from '../../common/response.code';
import { Message } from '../../entity/message/message';
import { MessageType } from '../../entity/message/messagetype';
import { ResponseData } from '../../entity/response.data';
import { ChatService } from '../../services/chat.service';
import { WebsocketService } from '../../services/websocket.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit, OnChanges {

  @Input()
  public friendId: string;

  public token = localStorage.getItem(Constant.TOKEN);
  public userId = localStorage.getItem(Constant.USER_ID);
  public inputMessage: string;
  public messages = new Array<Message>();
  public skip = 0;
  public take = 10;

  constructor(private chatService: ChatService,
          private router: Router,
          private socketService: WebsocketService ) { }

  ngOnInit() {

    this.chatService.connect(this.token);
    console.log('on event chat');
    console.log(this.friendId);
    this.on('chat', (data) => {
      console.log(data);
    });
    this.chatService.getChatHistory(this.friendId, this.skip, this.take).subscribe( (data: ResponseData) => {
      if (data.code === ReponseCode.SUCCESSFUL) {
        this.messages = data.data;
        console.log(this.messages);
        this.skip = this.take;
        this.take = this.take + 10;
      } else if (data.code === ReponseCode.INVALID_TOKEN) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    } );
  }

  on(event: string, callBack: any): Observable<Message> {
    if (this.existsEvent(event)) {
      return;
    }
    this.socketService.events.push(event);
    if (this.socketService.socket) {
      this.socketService.socket.on(event, (data) => {
        console.log('reveiver data from server');
        console.log(data);
        this.messages.push(data);
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

  ngOnChanges(changes: SimpleChanges) {
    console.log('change');
    if (changes['friendId']) {
      console.log(this.friendId);
      this.chatService.getChatHistory(this.friendId, this.skip, this.take).subscribe( (data: ResponseData) => {
      if (data.code === ReponseCode.SUCCESSFUL) {
        this.messages = data.data;
        console.log(this.messages);
        this.skip = this.take;
        this.take = this.take + 10;
      } else if (data.code === ReponseCode.INVALID_TOKEN) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    } );
    }
  }

  sendMessage() {
    console.log('send msg');

    const message = new Message();
    message.fromUserId = this.userId;
    message.toUserId = this.friendId;
    message.value = this.inputMessage;
    message.messageType = MessageType.TEXT;
    const currentTime = Date.now();
    message.time = '' + currentTime;

    message.token = this.token;

    this.messages.push(message);
    this.chatService.sendMessage(message);

    this.inputMessage = '';
  }

}
