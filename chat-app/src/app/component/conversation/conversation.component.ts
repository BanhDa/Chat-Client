import { ChatService } from '../../services/chat.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  @Input()
  public friendId: string;

  public message: string;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  sendMessage() {
    console.log('send msg');
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

}
