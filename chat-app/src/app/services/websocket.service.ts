import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';

@Injectable()
export class WebsocketService {

  private socket;

  constructor() { }

  connect(): Rx.Subject<MessageEvent> {
    // If you aren't familiar with environment variables then
    // you can hard code `environment.ws_url` as `http://localhost:5000`
    this.socket = io('http://localhost:9092');

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    console.log('connect');
    const observable = new Observable(observers => {
        this.socket.on('chat', (data) => {
          console.log('Received message from Server');
          console.log(data);
          observers.next(data);
        });
        return () => {
          console.log('disconnect');
          this.socket.disconnect();
        };
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    const observer = {
        next: (data: Object) => {
          console.log('emit');
            this.socket.emit('chat', JSON.stringify(data));
        },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Rx.Subject.create(observer, observable);
  }

}
