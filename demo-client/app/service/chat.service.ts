/**
 * Created by tuantran on 3/4/2017.
 */
import {Observable} from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class ChatService {
    private url = 'http://localhost:8088';
    private socket:any;

    sendMessage(message : any){
        this.socket.emit('add-message', message);
    }

    getMessages() {
        let observable = new Observable( (observer : any ) => {
            // this.socket = io(this.url);
            this.socket.on('message', (data : any) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }
}