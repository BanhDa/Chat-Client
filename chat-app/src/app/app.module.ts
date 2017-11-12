import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';

import { UserService } from './services/user.service';
import { ChatComponent } from './component/chat/chat.component';

import { AppRoutingModule } from './app.routing';
import { ConversationComponent } from './component/conversation/conversation.component';
import { UserdetailComponent } from './component/userdetail/userdetail.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    ConversationComponent,
    UserdetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [UserService],
  bootstrap: [AppComponent],
  exports: [ModalModule, TooltipModule, BsDropdownModule],
})
export class AppModule { }
