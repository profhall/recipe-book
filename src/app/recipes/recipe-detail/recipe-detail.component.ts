import { Component, OnInit, OnDestroy } from '@angular/core';

import { Recipe } from '../recipe';
import {ShoppingListService} from "../../shopping-list/shopping-list.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {RecipeService} from "../recipe.service";

@Component({
  selector: 'rb-recipe-detail',
  templateUrl: './recipe-detail.component.html'
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    private recipeIndex: number;
    selectedRecipe: Recipe;

  constructor(
      private sls: ShoppingListService,
      private route: ActivatedRoute,
      private recipesService: RecipeService,
      private router: Router) { }

  ngOnInit() {
      this.subscription = this.route.params.subscribe(
          (params: any) => {
              this.recipeIndex= params['id'];
              /**I made the mistake of not typing the function correctly below
              this.selectedRecipe = this.recipesService.getRecipes(this.recipeIndex);**/
              this.selectedRecipe = this.recipesService.getRecipe(this.recipeIndex);

          }
      )
  }
    onEdit() {
      //This line navigates to "/recipes/[recipeIndex]/edit" and is an absolute url
        this.router.navigate(['/recipes', this.recipeIndex, 'edit']);
    }

    onDelete() {
        this.recipesService.deleteRecipe(this.selectedRecipe);
        this.router.navigate(['/recipes'])
    }
  onAddToShoppingList(){
      this.sls.addItems(this.selectedRecipe.ingredients);
}

ngOnDestroy(){
      this.subscription.unsubscribe();
}
}
