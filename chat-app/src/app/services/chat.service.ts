import { Injectable, OnInit } from '@angular/core';

import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class ChatService {

  messages: Subject<any>;

  // Our constructor calls our wsService connect method
  constructor(private wsService: WebsocketService) {
    console.log('response connect 1');
    this.messages = <Subject<any>>wsService
      .connect()
      .map((response: any): any => {
        console.log('response connect');
        console.log(response);
        return response;
      });
   }

  // Our simplified interface for sending
  // messages back to our socket.io server
  sendMessage(msg) {
    console.log(msg);
    this.messages.next(msg);
  }

}
