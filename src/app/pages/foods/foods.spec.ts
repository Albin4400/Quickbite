import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Foods } from './foods';

describe('Foods', () => {
  let component: Foods;
  let fixture: ComponentFixture<Foods>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Foods],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Foods);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('combines live recipes and local QuickBite foods with distinct source keys', () => {
    const liveRecipes = http.expectOne('https://www.themealdb.com/api/json/v1/1/search.php?s');
    const localFoods = http.expectOne('http://localhost:5000/api/foods/local');

    liveRecipes.flush({
      meals: [{
        idMeal: '52772',
        strMeal: 'Teriyaki Chicken',
        strMealThumb: 'https://example.test/teriyaki.jpg',
        strCategory: 'Chicken',
        strArea: 'Japanese',
        strInstructions: 'Cook the chicken.',
        strIngredient1: 'Chicken',
        strIngredient2: 'Soy sauce'
      }]
    });
    localFoods.flush({
      foods: [{
        id: 9,
        food_key: 'admin-9',
        name: 'House soup',
        price: 12.5,
        category: 'Soup',
        area: 'Local',
        description: 'Soup of the day',
        image_url: 'https://example.test/soup.jpg',
        ingredients: ['water', 'vegetables'],
        instructions: 'Simmer gently.',
        source: 'admin'
      }]
    });
    fixture.detectChanges();

    expect(component.foods().map(food => food.key)).toEqual(['admin-9', 'api-52772']);
    expect(component.foods().map(food => food.source)).toEqual(['admin', 'api']);
    expect(component.loading()).toBe(false);
  });
});
