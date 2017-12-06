import { Constant } from '../../common/constant';
import { ReponseCode } from '../../common/response.code';
import { ResponseData } from '../../entity/response.data';
import { User } from '../../entity/user';
import { UserImage } from '../../entity/userimage';
import { FileService } from '../../services/file.service';
import { UserService } from '../../services/user.service';
import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef, Renderer, SimpleChanges, OnChanges} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class DialogComponent implements OnInit, OnChanges {

  @Input() closable = true;
  @Input() visible: boolean;
  @Input() friendId: string;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  avatarSrc = Constant.DEFAULT_AVATAR;
  userDetail = new User();

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  constructor(private userService: UserService,
        private router: Router,
        private fileService: FileService,
        private renderer: Renderer ) { }

  ngOnInit() {
    console.log('hihi');
    console.log(this.friendId);
    this.getUserInfo(this.friendId);

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('change');
    if (changes['friendId']) {
      console.log(this.friendId);
      this.avatarSrc = Constant.DEFAULT_AVATAR;
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
    this.fileService.getImageData(this.userDetail.avatar).subscribe( (data: ResponseData) => {
      if (data.code === ReponseCode.SUCCESSFUL) {
        const image = 'data:image/jpeg;base64,' + data.data;
        console.log(image);
        this.avatarSrc = image;
      }
    });
  }

}
