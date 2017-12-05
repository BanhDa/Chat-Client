import { Constant } from '../../common/constant';
import { ReponseCode } from '../../common/response.code';
import { Message } from '../../entity/message/message';
import { MessageType } from '../../entity/message/messagetype';
import { ResponseData } from '../../entity/response.data';
import { User } from '../../entity/user';
import { UserImage } from '../../entity/userimage';
import { ChatService } from '../../services/chat.service';
import { FileService } from '../../services/file.service';
import { UserService } from '../../services/user.service';
import { WebsocketService } from '../../services/websocket.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output, ElementRef, ViewChild, Renderer } from '@angular/core';
import { RequestOptions, ResponseContentType } from '@angular/http';
import { Router } from '@angular/router';
import { ImageUploadComponent } from 'angular2-image-upload';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit, OnChanges {

  @ViewChild('uploadImage') uploadImage: ElementRef;
  @ViewChild('conversationElement') private myScrollContainer: ElementRef;

  @Output('eventChat')
  eventChat: EventEmitter<Message> = new EventEmitter();

  @Input()
  public friendId: string;
  @Input() newMessage: Message;

  public friend = new User();
  public friendAvatarSrc = Constant.DEFAULT_AVATAR;

  public token = localStorage.getItem(Constant.TOKEN);
  public userId = localStorage.getItem(Constant.USER_ID);
  public inputMessage: string;
  public messages = new Array<Message>();
  public skip = 0;
  public take = 100;

  public messageText = MessageType.TEXT;
  public messageImage = MessageType.IMAGE;

  constructor(private chatService: ChatService,
          private router: Router,
          private socketService: WebsocketService,
          private userService: UserService,
          private renderer: Renderer,
          private fileService: FileService) { }

  ngOnInit() {

    console.log('on event chat');
    console.log(this.friendId);
    this.chatService.connectServer(this.token);
    this.listenMessageChat();
    this.getChatHistory();
    this.getUserInfo();
    this.loadFriendAvatar();
    this.markRead();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('change');
    if (changes['friendId']) {
      console.log(this.friendId);
      this.getChatHistory();
      this.getUserInfo();
      this.loadFriendAvatar();
      this.markRead();
    } else if (changes['newMessage']) {
      console.log('event new message from server');
      console.log(this.newMessage);
      if (this.newMessage.toUserId === this.userId
            && this.newMessage.fromUserId === this.friendId) {

        if (this.newMessage.messageType === MessageType.IMAGE
              || this.newMessage.messageType === MessageType.TEXT) {
          this.messages.push(this.newMessage);
          this.markRead();
        } else if (this.newMessage.messageType === MessageType.READ) {
          this.updateReadTime();
        }
      }
    }
  }

  updateReadTime() {
    if (this.messages !== null && this.messages.length > 0) {
      let i = 0;
      for (i = 0; i < this.messages.length; i++) {
        const message: Message = this.messages[i];
        if (message.readTime === undefined || message.readTime === null || message.readTime === '') {
          const now = new Date();
          message.readTime = now.toDateString();
          this.messages[i] = message;
        }
      }
    }
  }

  markRead() {
    console.log('mark read');
    const messageRead = new Message();
    messageRead.fromUserId = this.userId;
    messageRead.toUserId = this.friendId;
    messageRead.messageType = MessageType.READ;
    messageRead.token = this.token;

    this.chatService.sendMessage(messageRead);
    this.updateReadTime();
  }

  private scrollToBottom(): void {
    console.log('scrollToBottom');
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  loadFriendAvatar() {
    console.log('load avat friend');
    this.fileService.getImageData(this.friendId).subscribe( (data: ResponseData) => {
      if (data.code === ReponseCode.SUCCESSFUL) {
        this.friendAvatarSrc = Constant.BASE64_HEADER + data.data;
      }
    });
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
        this.scrollToBottom();
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
        this.messages.push(message);
        this.scrollToBottom();
        this.eventChat.emit(message);
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
    if (this.inputMessage !== null && this.inputMessage.trim() !== '') {
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
      this.scrollToBottom();
      this.chatService.sendMessage(message);
      this.inputMessage = '';

      this.eventChat.emit(message);
    }
  }

  sendMessageFile(messageType: string, fileId: string) {
    if (fileId !== null && fileId.trim() !== '') {
      const currentTime = Date.now();

      const message = new Message();
      message.messageId = this.userId + '&' + this.friendId + '&' + currentTime;
      message.fromUserId = this.userId;
      message.toUserId = this.friendId;
      message.value = fileId;
      message.messageType = messageType;
      message.time = currentTime;

      message.token = this.token;
      console.log('send message image');
      console.log(message);
      this.messages.push(message);
      this.chatService.sendMessage(message);

      this.inputMessage = '';

      this.eventChat.emit(message);
    }
  }

  handleInputImageChange(event) {
    console.log('upload image');
    const image = event.target.files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

    if (!image.type.match(pattern)) {
        alert('invalid format');
        return;
    }

//        this.loaded = false;
//        reader.onload = this._handleReaderLoaded.bind(this);


    reader.readAsDataURL(image);

    reader.onloadend = () => {
        this.fileService.postFormData(image).subscribe ( (data: ResponseData) => {
          const dataObject = JSON.parse(data.toString());
          if (dataObject.code === ReponseCode.SUCCESSFUL) {
            const userImage: UserImage = dataObject.data;
            this.sendMessageFile(MessageType.IMAGE, userImage.imageId);
          }
        } );
    };

  }

 uploadFile() {
    const event = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(
    this.uploadImage.nativeElement, 'dispatchEvent', [event]);
  }

}
