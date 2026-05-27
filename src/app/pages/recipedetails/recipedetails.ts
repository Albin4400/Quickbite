import { Component } from '@angular/core';
import { Fakeapi } from "../../fakeapi";
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipedetails',
  imports: [CommonModule],
  templateUrl: './recipedetails.html',
  styleUrl: './recipedetails.css',
})
export class Recipedetails {

  poductdetail: any;

  id:any;

  constructor(
    private api: Fakeapi,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');

    this.api.getfakerecipebyid(this.id).subscribe((res: any) => {

      this.poductdetail = res.meals[0];

      console.log(this.poductdetail);

      this.cdr.detectChanges();

    });

  }

}