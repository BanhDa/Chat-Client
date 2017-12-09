import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ImageUploadModule } from 'angular2-image-upload';

import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';

import { UserService } from './services/user.service';
import { FileService } from './services/file.service';
import { ApiService } from './services/api.service';
import { ChatService } from './services/chat.service';
import { WebsocketService } from './services/websocket.service';

import { AppRoutingModule } from './app.routing';
import { ConversationComponent } from './component/chathistory/conversation.component';
import { UserdetailComponent } from './component/userdetail/userdetail.component';
import { ChatComponent } from './component/chat/chat.component';
import { ChatimageComponent } from './component/chatimage/chatimage.component';
import { DialogComponent } from './component/dialog/dialog.component';
import { DialogimagechatComponent } from './component/dialogimagechat/dialogimagechat.component';
import { ChatfileComponent } from './component/chatfile/chatfile.component';
import { DialogalertComponent } from './component/dialogalert/dialogalert.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    ConversationComponent,
    UserdetailComponent,
    ChatimageComponent,
    DialogComponent,
    DialogimagechatComponent,
    ChatfileComponent,
    DialogalertComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    AppRoutingModule,
    ImageUploadModule.forRoot(),
  ],
  providers: [UserService, ApiService, ChatService, WebsocketService, FileService],
  bootstrap: [AppComponent],
  exports: [ModalModule, TooltipModule, BsDropdownModule],
})
export class AppModule { }
