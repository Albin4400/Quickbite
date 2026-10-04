import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { Fakeapi } from '../../fakeapi';
import { Food, fromLocalFood, fromMealDb } from '../../models/food.model';

@Component({
  selector: 'app-recipedetails',
  imports: [CommonModule],
  templateUrl: './recipedetails.html',
  styleUrl: './recipedetails.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Recipedetails {
  private readonly api = inject(Fakeapi);
  private readonly adminService = inject(AdminService);
  private readonly route = inject(ActivatedRoute);
  readonly food = signal<Food | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  constructor() {
    this.route.paramMap.subscribe(params => {
      const key = params.get('id') ?? '';
      this.food.set(null);
      this.errorMessage.set('');
      this.loading.set(true);

      if (key.startsWith('admin-')) {
        const localId = Number(key.slice('admin-'.length));
        if (!Number.isInteger(localId) || localId < 1) {
          this.showNotFound();
          return;
        }
        this.adminService.getPublishedFood(localId).subscribe({
          next: response => this.showFood(fromLocalFood(response.food)),
          error: () => this.showNotFound()
        });
        return;
      }

      const mealId = key.startsWith('api-') ? key.slice('api-'.length) : key;
      this.api.getfakerecipebyid(mealId).subscribe({
        next: response => {
          const meal = response.meals?.[0];
          if (meal) this.showFood(fromMealDb(meal));
          else this.showNotFound();
        },
        error: () => this.showNotFound()
      });
    });
  }

  private showFood(food: Food): void {
    this.food.set(food);
    this.loading.set(false);
  }

  private showNotFound(): void {
    this.errorMessage.set('This menu item could not be loaded.');
    this.loading.set(false);
  }
}