import { Constant } from '../../common/constant';
import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-dialogimagechat',
  templateUrl: './dialogimagechat.component.html',
  styleUrls: ['./dialogimagechat.component.css'],
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
export class DialogimagechatComponent implements OnInit, OnChanges {
  @Input() closable = true;
  @Input() visible: boolean;
  @Input() imageSrc = Constant.DEFAULT_AVATAR;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public loaded = false;
  public imageLoaded = false;

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  ngOnInit() {
    console.log('hihi');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('change');
    if (changes['imageSrc']) {

    }
  }

  handleImageLoad() {
    console.log('load image id');
//    console.log(this.imageId);
//    this.fileService.getImageData(this.imageId).subscribe( (data: ResponseData) => {
//      const image = 'data:image/jpeg;base64,' + data.data;
//      this.imageSrc = image;
//      this.imageLoaded = true;
//    });
  }
}
