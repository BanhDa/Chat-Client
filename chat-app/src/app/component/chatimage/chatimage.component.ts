import { Constant } from '../../common/constant';
import { ReponseCode } from '../../common/response.code';
import { ResponseData } from '../../entity/response.data';
import { FileService } from '../../services/file.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatimage',
  templateUrl: './chatimage.component.html',
  styleUrls: ['./chatimage.component.css']
})
export class ChatimageComponent implements OnInit {

  @Input()
  public imageId = '';

  public imageSrc = '';
  public messageAlert = '';

  public showDialogChatImage = false;
  public loaded = false;
  public imageLoaded = false;
  public showDialogAlert = false;

  constructor(private fileService: FileService, private router: Router) {}

  ngOnInit() {
    this.fileService.getImageData(this.imageId).subscribe( (data: ResponseData) => {
      const image = 'data:image/jpeg;base64,' + data.data;
      if (data.code === ReponseCode.SUCCESSFUL) {
        this.imageSrc = image;
        this.imageLoaded = true;
      } else if (data.code === ReponseCode.INVALID_TOKEN) {
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  handleImageLoad() {
    console.log('load image id');
    console.log(this.imageId);
    this.fileService.getImageData(this.imageId).subscribe( (data: ResponseData) => {
      const image = 'data:image/jpeg;base64,' + data.data;
      if (data.code === ReponseCode.SUCCESSFUL) {
        this.imageSrc = image;
        this.imageLoaded = true;
      } else if (data.code === ReponseCode.INVALID_TOKEN) {
        localStorage.clear();
        this.router.navigate(['/login']);
      } else {
        this.showDialogAlertError(data.data);
      }
    });
  }

  showImageChat() {
    this.showDialogChatImage = !this.showDialogChatImage;
  }

  showDialogAlertError(message: string) {
    this.messageAlert = message;
    this.showDialogAlert = !this.showDialogAlert;
  }

}
