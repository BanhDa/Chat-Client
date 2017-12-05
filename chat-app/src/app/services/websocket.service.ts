import { Message } from '../entity/message/message';
import { Socket } from '../entity/message/socket';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';

@Injectable()
export class WebsocketService {

  public socket;
  public events = new Array<string>();

  constructor() { }

  connect(): Rx.Subject<MessageEvent> {
    // If you aren't familiar with environment variables then
    // you can hard code `environment.ws_url` as `http://localhost:5000`
    this.socket = io('http://localhost:9092');

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    const observable = new Observable(observers => {
        this.socket.on('chat', (data) => {
          console.log('Received message from Server');
          console.log(data);
          observers.next(data);
        });
        return () => {
          console.log('disconnect');
          this.socket.emit('disconn', '');
          this.socket.disconnect();
        };
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    const observer = {
        next: (data: Object) => {
            this.socket.emit(Socket.EVENT_CHAT, data);
        },
    };

    const observerEventRead = {
      read: (data: Object) => {
        console.log('send message read');
        console.log(data);
        this.socket.emit(Socket.EVENT_MARK_READ, data);
      }
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Rx.Subject.create(observer, observerEventRead, observable);
  }

//  on(event: string, callBack: any): Observable<Message> {
//    if (this.existsEvent(event)) {
//      return;
//    }
//    this.events.push(event);
//    if (this.socket) {
//      this.socket.on(event, (data) => {
//        console.log('reveiver data from server');
//        console.log(data);
//      });
//    }
//  }

  existsEvent(event: string): boolean {
    let i: number;
    for (i = 0; i < this.events.length; i++) {
      if (this.events[i] === event) {
        return true;
      }
    }

    return false;
  }

  ping(token: string) {
    this.socket.emit(Socket.EVENT_CONNECTION, token);
  }
}
