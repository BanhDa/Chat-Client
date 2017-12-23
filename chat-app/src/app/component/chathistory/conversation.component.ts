import { Constant } from '../../common/constant';
import { ReponseCode } from '../../common/response.code';
import { Message } from '../../entity/message/message';
import { MessageType } from '../../entity/message/messagetype';
import { ResponseData } from '../../entity/response.data';
import { User } from '../../entity/user';
import { UserFile } from '../../entity/userfile';
import { UserImage } from '../../entity/userimage';
import { ChatService } from '../../services/chat.service';
import { FileService } from '../../services/file.service';
import { UserService } from '../../services/user.service';
import { WebsocketService } from '../../services/websocket.service';
import { EventEmitter, Output, ElementRef, ViewChild, Renderer, AfterViewChecked } from '@angular/core';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RequestOptions, ResponseContentType } from '@angular/http';
import { Router } from '@angular/router';
import { ImageUploadComponent } from 'angular2-image-upload';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit, OnChanges, AfterViewChecked {

  @ViewChild('uploadImage') uploadImage: ElementRef;
  @ViewChild('uploadfile') uploadfile: ElementRef;
  @ViewChild('conversationElement') private myScrollContainer: ElementRef;

  @Output('eventChat')
  eventChat: EventEmitter<Message> = new EventEmitter();

  @Input()
  public friendId: string;
  @Input() newMessage: Message;

  public friend = new User();
  public showDialogUserDetail = false;
  public showDialogAlert = false;

  public token = localStorage.getItem(Constant.TOKEN);
  public userId = localStorage.getItem(Constant.USER_ID);
  public inputMessage: string;
  public messages = new Array<Message>();
  public skip = 0;
  public take = 100;
  public messageAlert = '';

  public messageText = MessageType.TEXT;
  public messageImage = MessageType.IMAGE;
  public messageFile = MessageType.FILE;

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
    this.markRead();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('change');
    if (changes['friendId']) {
      console.log(this.friendId);
      this.getChatHistory();
      this.getUserInfo();
      this.markRead();
    } else if (changes['newMessage']) {
      console.log('event new message from server');
      console.log(this.newMessage);
      if (this.newMessage.toUserId === this.userId
            && this.newMessage.fromUserId === this.friendId) {

        if (this.newMessage.messageType === MessageType.IMAGE
              || this.newMessage.messageType === MessageType.TEXT
              || this.newMessage.messageType === MessageType.FILE) {
          this.messages.push(this.newMessage);
          this.markRead();
        } else if (this.newMessage.messageType === MessageType.READ) {
          this.updateReadTime();
        }
      }
    }
  }

  userDetail() {
    this.showDialogUserDetail = !this.showDialogUserDetail;
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

 scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  listenMessageChat() {
    console.log('add event chat');
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
      } else {

      }
    } );
  }

  getUserInfo() {
    this.userService.getUser(this.friendId).subscribe ( (data: ResponseData) => {
        if (data.code === ReponseCode.SUCCESSFUL) {
          this.friend = data.data;
          this.loadFriendAvatar();
         } else if (data.code === ReponseCode.INVALID_TOKEN) {
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
  }

  loadFriendAvatar() {
    this.friend.avatarSrc = Constant.DEFAULT_AVATAR;
    if (this.friend.avatar !== null
          && this.friend.avatar !== undefined
          && this.friend.avatar !== '') {
      this.fileService.getImageData(this.friend.avatar).subscribe( (data: ResponseData) => {
        if (data.code === ReponseCode.SUCCESSFUL) {
          this.friend.avatarSrc = Constant.BASE64_HEADER + data.data;
        } else if (data.code === ReponseCode.INVALID_TOKEN) {
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
    }
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

  sendMessageFile(messageType: string, fileId: string, fileName: string) {
    if (fileId !== undefined && fileId.trim() !== '') {
      const currentTime = Date.now();

      const message = new Message();
      message.messageId = this.userId + '&' + this.friendId + '&' + currentTime;
      message.fromUserId = this.userId;
      message.toUserId = this.friendId;
      message.value = fileId;
      if (fileName !== undefined && fileName !== '') {
        message.value = fileId + '|' + fileName;
      }
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

  handleInputFileChange(event) {
    console.log('upload file');
    const file = event.target.files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

//    file is image
    if (file.type.match(pattern)) {
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            this.fileService.postImage(file).subscribe ( (data: ResponseData) => {
              const dataObject = JSON.parse(data.toString());
              if (dataObject.code === ReponseCode.SUCCESSFUL) {
                const userImage: UserImage = dataObject.data;
                this.sendMessageFile(MessageType.IMAGE, userImage.imageId, undefined);
              } else if (data.code === ReponseCode.INVALID_TOKEN) {
                localStorage.clear();
                this.router.navigate(['/login']);
              } else {
                this.showDialogAlertError(data.data);
              }
            } );
        };
    } else {
//      file is not image
      reader.readAsDataURL(file);

      reader.onloadend = () => {
          this.fileService.postFile(file).subscribe ( (data: ResponseData) => {
            const dataObject = JSON.parse(data.toString());
            if (dataObject.code === ReponseCode.SUCCESSFUL) {
              const userFile: UserFile = dataObject.data;
              const fileName = file.name;
              this.sendMessageFile(MessageType.FILE, userFile.fileId, fileName);
            } else if (data.code === ReponseCode.INVALID_TOKEN) {
              localStorage.clear();
              this.router.navigate(['/login']);
            } else {
              this.showDialogAlertError(data.data);
            }
          } );
      };
    }
  }

 choseImage() {
    const event = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(
    this.uploadImage.nativeElement, 'dispatchEvent', [event]);
  }

  choseFile() {
    const event = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(
    this.uploadfile.nativeElement, 'dispatchEvent', [event]);
  }

  showDialogAlertError(message: string) {
    this.messageAlert = message;
    this.showDialogAlert = !this.showDialogAlert;
  }

}
