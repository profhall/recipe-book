import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs/Rx";
import {
  FormArray,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";

import { RecipeService } from "../recipe.service";
import { Recipe } from "../recipe";

@Component({
  selector: 'rb-recipe-edit',
  templateUrl: './recipe-edit.component.html'
})
export class RecipeEditComponent implements OnInit, OnDestroy{
  private recipeIndex: number;
  private subscription: Subscription;
  private recipe: Recipe;
  private isNew = true;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
        (params: any) => {
          if (params.hasOwnProperty('id')){
            this.isNew= false; //I'm editing a recipe so therefore I already have an ID so it's not new
            this.recipeIndex = +params['id'];// "+" sign converts to a number
            this.recipe = this.recipeService.getRecipe(this.recipeIndex)
          }
          else{
            this.isNew = true;
            this.recipe = null;
          }
          this.initForm();
          //console.log("Is This a new recipe?: " + this.isNew);//quick way to make sure your in the right state
        }
    );
  }

  onSubmit(){
      const newRecipe = this.recipeForm.value;
      if(this.isNew){
          this.recipeService.addRecipe(newRecipe);
      }
      else {
          this.recipeService.editRecipe(this.recipe, newRecipe);
      }
      this.navigateBack();
  }

    onCancel(){
      this.navigateBack();
    }

    onAddItem(name:string, amount:string){
        (<FormArray>this.recipeForm.controls['ingredients']).push(
            new FormGroup({
                name: new FormControl(name, Validators.required),
                amount: new FormControl(amount, [
                    Validators.required,
                    Validators.pattern("\\d+")
                ])
            })
        );
    }

    onRemoveItem(index: number){
        (<FormArray>this.recipeForm.controls['ingredients']).removeAt(index);
    }
  ngOnDestroy(){
      this.subscription.unsubscribe(); //no memory leaks once component gets destroyed, very important!
  }

  private navigateBack(){
      this.router.navigate(['../']); //navigate up/back one step/folder
  }

  private initForm(){
      let recipeName = '';
      let recipeImageUrl = '';
      let recipeContent = '';
      let recipeIngredients: FormArray = new FormArray([]);

    if (!this.isNew) {
      if (this.recipe.hasOwnProperty('ingredients')) {
        for (let i = 0; i < this.recipe.ingredients.length; i++) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(this.recipe.ingredients[i].name, Validators.required),
              amount: new FormControl(this.recipe.ingredients[i].amount, [
                Validators.required,
                Validators.pattern("\\d+")
              ])
            })
          );
        }
      }
      recipeName = this.recipe.name;
      recipeImageUrl = this.recipe.imagePath;
      recipeContent = this.recipe.description;
    }


    this.recipeForm = this.formBuilder.group({
      name: [recipeName, Validators.required],
      imagePath: [recipeImageUrl, Validators.required],
      description: [recipeContent, Validators.required],
      ingredients: recipeIngredients
    });

  }
}
