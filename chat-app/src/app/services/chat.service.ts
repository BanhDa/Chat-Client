import { Constant } from '../common/constant';
import { Message } from '../entity/message/message';
import { SearchRequest } from '../entity/request/searchrequest';
import { ResponseData } from '../entity/response.data';
import { ApiService } from './api.service';
import { Injectable, OnInit } from '@angular/core';

import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class ChatService {

  messages: Subject<any>;

  // Our constructor calls our wsService connect method
  constructor(private wsService: WebsocketService, private apiService: ApiService) {
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
  sendMessage(msg: Message) {
    console.log(msg);
    this.messages.next(msg);
  }

  getChatHistory(friendId: string, skip: number, take: number): Observable<ResponseData> {
    const path = '/chat/history';
    const url = Constant.BASE_URL + path;

    const data = new SearchRequest();
    data.friendId = friendId;
    data.skip = skip;
    data.take = take;

    return this.apiService.post(url, JSON.stringify(data));
  }

  getChatConversasion(): Observable<ResponseData> {
    const url = Constant.BASE_URL + '/chat/conversations';
    return this.apiService.post(url, '');
  }

  connect(token: string) {
    this.wsService.ping(token);
  }

}
