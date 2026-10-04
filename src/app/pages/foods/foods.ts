import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Cards } from '../../componets/cards/cards';
import { Fakeapi } from '../../fakeapi';
import { AdminService } from '../../services/admin.service';
import { Food, fromLocalFood, fromMealDb } from '../../models/food.model';
import { catchError, forkJoin, map, of } from 'rxjs';

@Component({
  selector: 'app-foods',
  imports: [Cards],
  templateUrl: './foods.html',
  styleUrl: './foods.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Foods {
  private readonly api = inject(Fakeapi);
  private readonly adminService = inject(AdminService);
  readonly foods = signal<Food[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  constructor() {
    const sourceErrors: string[] = [];
    forkJoin({
      apiFoods: this.api.getfakerecipe().pipe(
        map(response => (response.meals ?? []).map(fromMealDb)),
        catchError(() => {
          sourceErrors.push('The live recipe service is unavailable.');
          return of([]);
        })
      ),
      localFoods: this.adminService.getPublishedFoods().pipe(
        map(response => response.foods.map(fromLocalFood)),
        catchError(() => {
          sourceErrors.push('QuickBite menu dishes could not be loaded.');
          return of([]);
        })
      )
    }).subscribe(({ apiFoods, localFoods }) => {
      this.foods.set([...localFoods, ...apiFoods]);
      this.errorMessage.set(sourceErrors.join(' '));
      this.loading.set(false);
    });
  }
}
