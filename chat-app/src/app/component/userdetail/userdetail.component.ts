import { Constant } from '../../common/constant';
import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, Renderer, Output, EventEmitter } from '@angular/core';
import {Router, Routes} from '@angular/router';

import { UserService } from '../../services/user.service';
import { User } from '../../entity/user';
import { ResponseData } from '../../entity/response.data';
import { ReponseCode } from '../../common/response.code';
import { UserImage } from '../../entity/userimage';
import { FileService } from '../../services/file.service';
import { Utils } from '../../common/utils';
import { MessageError } from '../../common/message.error';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css']
})

export class UserdetailComponent implements OnInit, OnChanges {

  @ViewChild('avatarInput') avatarInput: ElementRef;
  @Input() friendId: string;
  @Output('updateAvatarEvent') updateAvatarEvent: EventEmitter<String> = new EventEmitter();
  @Output('updateUserInfoEvent') updateUserInfoEvent: EventEmitter<User> = new EventEmitter();

  avatarSrc = Constant.DEFAULT_AVATAR;
  userDetail = new User();
  public friendUpdate = new User();
  public messageAlert = '';
  public showDialogAlert = false;
  public isEditProfile = false;

  constructor(private userService: UserService,
        private router: Router,
        private fileService: FileService,
        private renderer: Renderer ) { }

  ngOnInit() {
    console.log('hihi');
//    console.log(this.friendId);
//    this.friendId = localStorage.getItem('userId');
//    console.log(this.friendId);

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('change');
    if (changes['friendId']) {
      console.log(this.friendId);
      this.getUserInfo(this.friendId);
    }
  }

  updateUserInfo() {
    console.log(this.friendUpdate);
    if (this.friendUpdate !== undefined && this.friendUpdate !== null) {
      if (this.validateDataUserUpdate()) {
        this.userService.updateUserInfo(this.friendUpdate).subscribe( (data: ResponseData) => {
          if (data.code === ReponseCode.SUCCESSFUL) {
            this.userDetail = data.data;
            this.isEditProfile = false;
            this.updateUserInfoEvent.emit(this.userDetail);
            localStorage.setItem(Constant.USER, JSON.stringify(this.userDetail));
          } else if (data.code === ReponseCode.INVALID_TOKEN) {
            localStorage.clear();
            this.router.navigate(['/login']);
          } else {
            this.messageAlert = data.data;
            this.showDialogAlert = !this.showDialogAlert;
          }
        });
      }
    }
  }

  cancel() {
    this.isEditProfile = false;
  }

  getUserInfo(userId: string) {
    this.userService.getUser(userId).subscribe ( (data: ResponseData) => {
        if (data.code === ReponseCode.SUCCESSFUL) {
          this.userDetail = data.data;
          this.loadAvatar();
        } else if (data.code === ReponseCode.INVALID_TOKEN) {
          localStorage.clear();
          this.router.navigate(['/login']);
        } else {
          this.showDialogAlertError(data.data);
        }
      });
  }

  loadAvatar() {
    console.log('load avat');
    this.fileService.getAvatar().subscribe( (data: ResponseData) => {
      if (data.code === ReponseCode.SUCCESSFUL) {
        const image = 'data:image/jpeg;base64,' + data.data;
        console.log(image);
        this.avatarSrc = image;
      } else if (data.code === ReponseCode.INVALID_TOKEN) {
        localStorage.clear();
        this.router.navigate(['/login']);
      } else {

      }
    });
  }

  uploadAvatar() {
    console.log('trigger');
    console.log(this.avatarInput);
    console.log(this.avatarInput.nativeElement);
    const event = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(
    this.avatarInput.nativeElement, 'dispatchEvent', [event]);
  }

  handleInputImageChange(event) {
    console.log('upload image');
    const image = event.target.files[0];
    console.log(image);
    const pattern = /image-*/;
    const reader = new FileReader();

    if (!image.type.match(pattern)) {
        alert('invalid format');
        return;
    }

    reader.readAsDataURL(image);

    reader.onloadend = () => {
            console.log('image source');
            console.log(reader.result);
        this.avatarSrc = reader.result;

        this.fileService.uploadAvatar(image).subscribe ( (data: ResponseData) => {
          console.log('data upload image chat');
          console.log(data);
          const dataObject = JSON.parse(data.toString());
          console.log(dataObject);
          if (dataObject.code === ReponseCode.SUCCESSFUL) {
            const userImage: UserImage = dataObject.data;
            console.log(userImage.imageId);
            this.userDetail.avatar = userImage.imageId;
            this.avatarSrc = reader.result;
            this.updateAvatarEvent.emit(this.avatarSrc);
          } else if (data.code === ReponseCode.INVALID_TOKEN) {
            localStorage.clear();
            this.router.navigate(['/login']);
          } else {
            this.showDialogAlertError(data.data);
          }
          } );
    };

  }

  showEditProfile() {
    this.friendUpdate = this.userDetail;
    this.isEditProfile = true;
  }

  logout() {
    console.log('logout');
    this.userService.logout().subscribe( (data: ResponseData) => {
      if (data.code === ReponseCode.SUCCESSFUL) {
        console.log('clear data');
        localStorage.clear();
        this.router.navigate(['/login']);
      } else if (data.code === ReponseCode.INVALID_TOKEN) {
        localStorage.clear();
        this.router.navigate(['/login']);
      } else {
        this.showDialogAlertError(data.data);
      }
    });
  }

  validateDataUserUpdate(): boolean {
    return this.validateEmail(this.friendUpdate.email)
          && this.validatePassword(this.friendUpdate.password)
          && this.validDateUserName(this.friendUpdate.userName);
  }

  validateEmail(email: string): boolean {
    if ( !Utils.validString(email) ) {
      this.showDialogAlertError(MessageError.EMAIL_REQUIRED);
      return false;
    } else if (!Constant.EMAIL_REGEX.test(email)) {
      this.showDialogAlertError(MessageError.VALID_EMAIL);
      return false;
    } else {
      return true;
    }
  }

  validDateUserName(userName: string): boolean {
    if (Utils.validString(userName)) {
      return true;
    } else {
      this.showDialogAlertError(MessageError.USER_NAME_REQUIRED);
      return false;
    }
  }

  validatePassword(password: string): boolean {
    if ( Utils.validString(password) ) {
      return true;
    } else {
      this.showDialogAlertError(MessageError.PASSWORD_REQUIRED);
      return false;
    }
  }

  showDialogAlertError(message: string) {
    this.messageAlert = message;
    this.showDialogAlert = !this.showDialogAlert;
  }
}
