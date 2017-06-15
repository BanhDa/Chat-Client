import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
     <nav>
       <a routerLink="/my-dashboard">Dashboard</a>
       <a routerLink="/heroes">Heroes</a>
     </nav>
     <router-outlet></router-outlet>
  `,
  styleUrls : ['app/css/app.css']
})
export class AppComponent {
  title = 'Tour of Heroes';
}
