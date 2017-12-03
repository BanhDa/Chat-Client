import { ResponseData } from '../../entity/response.data';
import { FileService } from '../../services/file.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chatimage',
  templateUrl: './chatimage.component.html',
  styleUrls: ['./chatimage.component.css']
})
export class ChatimageComponent implements OnInit {

  @Input()
  public imageId = '';

  public loaded = false;
  public imageLoaded = false;
  public imageSrc = '';

  constructor(private fileService: FileService) {}

  ngOnInit() {
    console.log('init image id');
    console.log(this.imageId);
    this.fileService.getImageData(this.imageId).subscribe( (data: ResponseData) => {
      const image = 'data:image/jpeg;base64,' + data.data;
      console.log(image);
      this.imageSrc = image;
      this.imageLoaded = true;
    });
  }

  handleImageLoad() {
    console.log('load image id');
    console.log(this.imageId);
    this.fileService.getImageData(this.imageId).subscribe( (data: ResponseData) => {
      const image = 'data:image/jpeg;base64,' + data.data;
      console.log(image);
      this.imageSrc = image;
      this.imageLoaded = true;
    });
  }
}
