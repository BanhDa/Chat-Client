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

  @Output('eventChat')
  eventChat: EventEmitter<Message> = new EventEmitter();

  @Input()
  public friendId: string;
  public newMessage: Message;
  @Input()
  set message(message: Message) {
    console.log('new message');
    console.log(message);
  }

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
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('change');
    if (changes['friendId']) {
      console.log(this.friendId);
      this.getChatHistory();
      this.getUserInfo();
    }
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
        console.log('list messae');
        console.log(this.messages);
        this.messages.push(message);
        console.log(this.messages);
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
    console.log(image);
    console.log(event.target.files[0]);
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
            console.log('image source');
            console.log(reader.result);

        this.fileService.postFormData(image).subscribe ( (data: ResponseData) => {
          console.log('data upload image chat');
          console.log(data);
          const dataObject = JSON.parse(data.toString());
          console.log(dataObject);
          if (dataObject.code === ReponseCode.SUCCESSFUL) {
            const userImage: UserImage = dataObject.data;
            console.log(userImage.imageId);
            this.sendMessageFile(MessageType.IMAGE, userImage.imageId);
          }
      } );
    };

  }

 uploadFile() {
    console.log('trigger');
    console.log(this.uploadImage);
    console.log(this.uploadImage.nativeElement);
    const event = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(
    this.uploadImage.nativeElement, 'dispatchEvent', [event]);
  }

}
