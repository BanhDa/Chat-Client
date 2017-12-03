import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private renderer: Renderer, private eleRef: ElementRef) {}

  public uploader: FileUploader = new FileUploader({url: 'http://localhost:8080/file/uploadimage'});
@ViewChild('myDiv') myDiv: ElementRef;

  uploadFile() {
console.log('trigger');
    const event = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(
    this.myDiv.nativeElement, 'dispatchEvent', [event]);

    console.log(this.myDiv);
    console.log(this.myDiv.nativeElement);
//    const smallBox = this.eleRef.nativeElement.querySelector('#myDiv');
//            /*this didn't work*/
//            smallBox.dispatchEvent(new Event('click'));
  }
}
