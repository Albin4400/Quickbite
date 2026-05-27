import { Component } from '@angular/core';
import { Cards } from "../../componets/cards/cards";
import { Fakeapi } from "../../fakeapi";
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-foods',
  imports: [Cards],
  templateUrl: './foods.html',
  styleUrl: './foods.css',
})
export class Foods {
  constructor(private api: Fakeapi,private cdr: ChangeDetectorRef){}
  data: any[] = [];

  ngOnInit(){
    this.api.getfakerecipe().subscribe((res: any) => {
      console.log(res);
      this.data = res.meals ;
      this.cdr.detectChanges();
    });
  } 
}

