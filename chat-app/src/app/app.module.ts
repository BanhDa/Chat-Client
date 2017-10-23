import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

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
//    RouterModule.forRoot(
//      appRoutes
//    )
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }