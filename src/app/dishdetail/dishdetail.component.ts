import { Component, OnInit, Inject } from '@angular/core';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

import { switchMap } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: number[];
  dishcopy = null;
  prev: number;
  next: number;
  ff: FormGroup;
  com: Comment;
  errMess: string;

  formErrors ={
    'rating':'',
    'comment':'',
    'author':''
  };

  validationMessages ={
    'rating':{

    },
    'comment':{
    'required':'comment must be requireddd'
    },
    'author':{
    'required':'author must be reuiorqq',
    'minlength': 'name must be at least 2 characters long'
    }
  };
  
  constructor(private dishservice: DishService,
  private route: ActivatedRoute,
  private location: Location,
  private fb: FormBuilder,
  @Inject('BaseURL') private BaseURL) {
  this.createForm(); }

  ngOnInit() { 
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(+params['id'])))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); },
    errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: number) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.ff = this.fb.group({
    comment:['',Validators.required],
    rating: 5,
   
    author:['', [Validators.required, Validators.minLength(2)]],
    });

    this.ff.valueChanges
     .subscribe(data => this.onValueChanged(data));

     this.onValueChanged(); // (re)set form validaiton messages
  }

  onValueChanged(data?: any) {
    if (!this.ff) { return; }
    const form = this.ff;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.com = this.ff.value;
    this.com.date = new Date().toISOString();
    console.log(this.com);
    this.dishcopy.comments.push(this.com);
    this.dishcopy.save()
    .subscribe(dish => {this.dish = dish; console.log(this.dish);});
    this.ff.reset({
    rating: 5,
    comment: '',
    author:''
    });
  }

}