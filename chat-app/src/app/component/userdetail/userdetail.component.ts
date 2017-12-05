import { Constant } from '../../common/constant';
import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, Renderer, Output, EventEmitter } from '@angular/core';
import {Router, Routes} from '@angular/router';

import { UserService } from '../../services/user.service';
import { User } from '../../entity/user';
import { ResponseData } from '../../entity/response.data';
import { ReponseCode } from '../../common/response.code';
import { UserImage } from '../../entity/userimage';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css']
})

export class UserdetailComponent implements OnInit, OnChanges {

  @ViewChild('avatarInput') avatarInput: ElementRef;
  @Input() friendId: string;
  @Output('updateAvatarEvent') updateAvatarEvent: EventEmitter<String> = new EventEmitter();

  avatarSrc = Constant.DEFAULT_AVATAR;
  userDetail = new User();

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

  getUserInfo(userId: string) {
    this.userService.getUser(userId).subscribe ( (data: ResponseData) => {
        if (data.code === ReponseCode.SUCCESSFUL) {
          this.userDetail = data.data;
          this.loadAvatar();
        } else if (data.code === ReponseCode.INVALID_TOKEN) {
          localStorage.clear();
          this.router.navigate(['/login']);
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
          }
          } );
    };

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
      }
    });
  }
}
