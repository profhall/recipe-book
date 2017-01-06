import { Injectable, EventEmitter } from '@angular/core';
import { Headers, Http, Response } from "@angular/http";
import 'rxjs/Rx';

import { Recipe } from './recipe';
import {Ingredient} from "../shared/ingredient";

@Injectable()
export class RecipeService {
  recipesChanged = new EventEmitter<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe('Mixed Veggies', 'Simply Delicious', "http://globaltableadventure.com/wp-content/uploads/2012/09/papua.new_.guinea.food_.reicpe.img_9975.jpg", [
      new Ingredient('Carrots', 2),
      new Ingredient('Broccolli', 1)
    ]),
    new Recipe('Quinoa Patties', 'Will make your heart dance', "http://assets.epicurious.com/photos/54b2e2e03edeef84363b2ceb/master/pass/365029_quinoa-patties_1x1.jpg", [])
  ];
  constructor( private http: Http) {}

  getRecipes() {
    return this.recipes;
  }

  getRecipe(id: number){
    return this.recipes[id];
  }

  deleteRecipe(recipe: Recipe){
    //splice remove from array, this removes 1
    this.recipes.splice(this.recipes.indexOf(recipe), 1)
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
  }

  editRecipe(oldRecipe: Recipe, newRecipe: Recipe){
    this.recipes[this.recipes.indexOf(oldRecipe)]=newRecipe;
  }

  storeData() {
    const body = JSON.stringify(this.recipes);
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.put('https://recipe-book-459f7.firebaseio.com/recipes.json', body, {headers: headers});
  }

  fetchData() {
    return this.http.get('https://recipe-book-459f7.firebaseio.com/recipes.json')
      .map((response: Response) => response.json())
      .subscribe(
        (data: Recipe[]) => {
          this.recipes = data;
          this.recipesChanged.emit(this.recipes);
        }
      );
  }

}
