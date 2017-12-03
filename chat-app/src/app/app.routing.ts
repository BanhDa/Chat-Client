import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './component/login/login.component';
import { ChatComponent } from './component/chat/chat.component';
import { ConversationComponent } from './component/chathistory/conversation.component';
import { UserdetailComponent } from './component/userdetail/userdetail.component';

const appRoutes: Routes = [
  { path : 'conversation', component: ConversationComponent},
  { path : 'user_detail', component: UserdetailComponent},
  { path: 'login', component: LoginComponent },
  { path: 'chat',  component: ChatComponent },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
//  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
