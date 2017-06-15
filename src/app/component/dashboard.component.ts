/**
 * Created by tuan on 6/14/17.
 */
import { Component } from '@angular/core';
import { Hero } from "../entity/hero";
import {HeroService} from "../service/hero.service";
import {Location} from "@angular/common";
@Component({
  selector: 'my-dashboard',
  templateUrl: 'app/template/dashboard.component.html',
  styleUrls : ['app/css/dashboard.css'],
  providers : [
    HeroService
  ]
})
export class DashboardComponent {
  heroes: Hero[] = [];

  constructor(private heroService: HeroService, private location : Location) { }

  ngOnInit(): void {
    this.heroService.getHeroes().then(heroes => this.heroes = heroes);
  }

  goBack() : void {
    this.location.back();
  }
}
