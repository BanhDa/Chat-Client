import { Constant } from '../common/constant';
import { FileRequest } from '../entity/request/filerequest';
import { ResponseData } from '../entity/response.data';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileService {

  constructor(private apiService: ApiService) { }

  uploadImage(image: File) {
    const formData = new FormData();
    formData.append('image', image, image.name);
    const url = Constant.BASE_URL + '/file/uploadimage';
    return this.apiService.postImage(url, formData);
  }

  uploadAvatar(file: File): Observable<ResponseData> {
    return Observable.fromPromise(new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('image', file, file.name);
      formData.append('userid', localStorage.getItem(Constant.USER_ID));

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };

  //    xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
      xhr.open('POST', Constant.BASE_URL + '/file/uploadavatar', true);
      xhr.send(formData);
    }));
  }

  postImage(file: File): Observable<ResponseData> {
    return Observable.fromPromise(new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('image', file, file.name);
      formData.append('userid', localStorage.getItem(Constant.USER_ID));

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', Constant.BASE_URL + '/file/uploadimage', true);
      xhr.send(formData);
    }));
  }

  postFile(file: File): Observable<ResponseData> {
    return Observable.fromPromise(new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('file', file, file.name);
      formData.append('userid', localStorage.getItem(Constant.USER_ID));

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', Constant.BASE_URL + '/file/uploadFile', true);
      xhr.send(formData);
    }));
  }

  downloadfile(fileId: string) {
//   return this.apiService.( this.files_api + this.title +"/"+ runname + "/?file="+ type)
//            .catch(this.logAndPassOn);
     if (fileId !== undefined && fileId !== '') {
      console.log('get file');
      const url = Constant.BASE_URL + '/file/downloadfile?fileid=' + fileId;
      return this.apiService.post(url, '');
    }
}

  getImageData(imageId: string): Observable<any> {
    if (imageId !== undefined && imageId !== '') {
      console.log('get image');
      const url = Constant.BASE_URL + '/file/loadimage?imageid=' + imageId;
      return this.apiService.post(url, '');
    }
  }

  getAvatar(): Observable<any> {
    const url = Constant.BASE_URL + '/file/loadavatar';
    return this.apiService.post(url, '');
  }
}
