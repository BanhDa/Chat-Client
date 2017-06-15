/**
 * Created by tuan on 6/15/17.
 */
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {DashboardComponent} from  "./component/dashboard.component";
import {HeroesComponent} from "./component/heroes.component";
import {HeroDetailComponent} from "./component/herodetail.component";

const routes : Routes = [
  {
    path : "heroes",
    component : HeroesComponent
  },
  {
    path : "my-dashboard",
    component : DashboardComponent
  },
  {
    path : "detail/:id",
    component : HeroDetailComponent
  }
];

@NgModule ({
  imports : [RouterModule.forRoot(routes)],
  exports : [RouterModule]
})

export class AppRoutingModule {

}
