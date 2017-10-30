import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AppComponent } from './app.component';
import { LoginComponent } from './component/login.component';

import { UserService } from './services/user.service';

const appRoutes: Routes = [
  {
    path: '/login',
    component: LoginComponent,
    data: { title: 'Chat Client' }
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
//    RouterModule.forRoot(
//      appRoutes
//    )
  ],
  providers: [UserService],
  bootstrap: [AppComponent],
  exports: [ModalModule, TooltipModule, BsDropdownModule],
})
export class AppModule { }
