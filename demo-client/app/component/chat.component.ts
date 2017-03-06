/**
 * Created by tuantran on 3/4/2017.
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Control }           from '@angular/common';
import { ChatService }       from '../service/chat.service';
import any = jasmine.any;

@Component({
    moduleId: module.id,
    selector: 'chat',
    template: `<div *ngFor="let message of messages">
                     {{message.text}}
                   </div>
                   <input [(ngModel)]="message"  /><button (click)="sendMessage()">Send</button>`,
    providers: [ChatService]
})
export class ChatComponent implements OnInit, OnDestroy {
    messages = String[10];
    connection : any;
    message : String;

    constructor(private chatService:ChatService) {}

    sendMessage(){
        this.chatService.sendMessage(this.message);
        this.message = '';
    }

    ngOnInit() {
        this.connection = this.chatService.getMessages().subscribe(message => {
            this.messages.push(message);
        })
    }

    ngOnDestroy() {
        this.connection.unsubscribe();
    }
}
