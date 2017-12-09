import { Constant } from '../../common/constant';
import { ReponseCode } from '../../common/response.code';
import { ResponseData } from '../../entity/response.data';
import { FileService } from '../../services/file.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatfile',
  templateUrl: './chatfile.component.html',
  styleUrls: ['./chatfile.component.css']
})
export class ChatfileComponent implements OnInit {

  @Input()
  public valueMessageFile = '';

  public fileName = '';
  public fileId = '';
  public messageAlert = '';

  public showDialogAlert = false;

  constructor(private fileService: FileService, private router: Router) { }

  ngOnInit() {
    console.log('init show message file');
    console.log(this.valueMessageFile);
    if (this.valueMessageFile !== undefined && this.valueMessageFile !== '') {
      const parts: string[] = this.valueMessageFile.split('|');
      console.log(parts);
      this.fileId = parts[0];
      this.fileName = parts[1];
    }
  }

  downLoadFile() {
    console.log('down load file');
    this.fileService.downloadfile(this.fileId).subscribe( (data: ResponseData) => {
      if (data.code === ReponseCode.SUCCESSFUL) {
        console.log(data.data);
        const blob = new Blob([data.data], { type: 'text/plain;charset=utf-8' });
        console.log(blob);
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          console.log('if');
            window.navigator.msSaveOrOpenBlob(blob, this.fileName);
        } else {
          console.log('else');
          const url = Constant.BASE_URL + '/file/downloadfile?fileid=' + this.fileId;
          const blod = new Blob([data.data], { type: 'text/docx/plain;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blod);

            a.download = this.fileName;
            document.body.appendChild(a);
          console.log(a);
            a.click();
            document.body.removeChild(a);
        }
      } else if (data.code === ReponseCode.INVALID_TOKEN) {
        localStorage.clear();
        this.router.navigate(['/login']);
      } else {
        this.showDialogAlertError(data.data);
      }
    });
  }

  showDialogAlertError(message: string) {
    this.messageAlert = message;
    this.showDialogAlert = !this.showDialogAlert;
  }

}
