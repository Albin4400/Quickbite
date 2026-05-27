import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class Fakeapi {
  constructor(private http: HttpClient) {}
  getfakerecipe(){
    return this.http.get('https://www.themealdb.com/api/json/v1/1/search.php?s');
  }
  getfakerecipebyid(id: string){
    return this.http.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  }
}