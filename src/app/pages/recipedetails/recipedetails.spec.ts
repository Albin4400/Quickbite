import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recipedetails } from './recipedetails';

describe('Recipedetails', () => {
  let component: Recipedetails;
  let fixture: ComponentFixture<Recipedetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recipedetails],
    }).compileComponents();

    fixture = TestBed.createComponent(Recipedetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
