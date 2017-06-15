import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HeroesComponent } from "../app/component/heroes.component";
import { RouterModule } from "@angular/router";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent }  from './app.component';
import { HeroDetailComponent } from './component/herodetail.component';
import { DashboardComponent } from "../app/component/dashboard.component";



@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,

    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    HeroDetailComponent,
    HeroesComponent
  ],
  bootstrap:    [ AppComponent ],
})

export class AppModule { }
