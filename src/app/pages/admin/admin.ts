import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdminFoodPayload, AdminUser, Food, fromLocalFood } from '../../models/food.model';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

type AdminSection = 'overview' | 'users' | 'add-food' | 'foods';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboard {
  private readonly adminService = inject(AdminService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  readonly section = signal<AdminSection>('overview');
  readonly users = signal<AdminUser[]>([]);
  readonly localFoods = signal<Food[]>([]);
  readonly editingFoodKey = signal<string | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly adminName = computed(() => this.authService.currentUser()?.name ?? 'Admin');

  readonly foodForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['', [Validators.required, Validators.maxLength(100)]],
    area: [''],
    description: [''],
    image_url: [''],
    ingredients: [''],
    instructions: ['']
  });

  constructor() {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    let pending = 2;
    const completed = (): void => {
      pending -= 1;
      if (pending === 0) this.loading.set(false);
    };

    this.adminService.getUsers().pipe(finalize(completed)).subscribe({
      next: response => this.users.set(response.users),
      error: () => this.errorMessage.set('Could not load users. Check the backend connection and your admin access.')
    });
    this.adminService.getFoods().pipe(finalize(completed)).subscribe({
      next: response => this.localFoods.set(response.foods.map(fromLocalFood)),
      error: () => this.errorMessage.set('Could not load admin foods. Check the backend connection and your admin access.')
    });
  }

  changeUserRole(user: AdminUser, role: AdminUser['role']): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.adminService.updateUserRole(user.id, role).subscribe({
      next: response => {
        this.users.update(users => users.map(item => item.id === user.id ? response.user : item));
        this.successMessage.set(`${user.name}'s role was updated. They must sign in again for it to take effect.`);
        if (this.authService.currentUser()?.id === user.id && role !== 'admin') {
          this.authService.logout();
        }
      },
      error: () => this.errorMessage.set(`Could not update ${user.name}'s role.`)
    });
  }

  editFood(food: Food): void {
    this.editingFoodKey.set(food.key);
    this.foodForm.setValue({
      name: food.name,
      price: food.price,
      category: food.category,
      area: food.area,
      description: food.description,
      image_url: food.imageUrl,
      ingredients: food.ingredients.join('\n'),
      instructions: food.instructions
    });
    this.section.set('add-food');
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  cancelEdit(): void {
    this.editingFoodKey.set(null);
    this.foodForm.reset({
      name: '',
      price: 0,
      category: '',
      area: '',
      description: '',
      image_url: '',
      ingredients: '',
      instructions: ''
    });
  }

  saveFood(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    if (this.foodForm.invalid) {
      this.foodForm.markAllAsTouched();
      return;
    }

    const form = this.foodForm.getRawValue();
    const payload: AdminFoodPayload = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      area: form.area.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim(),
      ingredients: form.ingredients.split('\n').map(item => item.trim()).filter(Boolean),
      instructions: form.instructions.trim()
    };
    const foodKey = this.editingFoodKey();
    this.saving.set(true);
    const request = foodKey === null
      ? this.adminService.createFood(payload)
      : this.adminService.updateFood(foodKey, payload);

    request.subscribe({
      next: response => {
        const updated = fromLocalFood(response.food);
        this.localFoods.update(foods => foodKey === null
          ? [updated, ...foods]
          : foods.map(food => food.key === foodKey ? updated : food));
        this.successMessage.set(foodKey === null ? 'Food added to the customer menu.' : 'Food changes saved.');
        this.cancelEdit();
        this.section.set('foods');
        this.saving.set(false);
      },
      error: error => {
        this.errorMessage.set(error.error?.message ?? 'Could not save this food. Please check the details and try again.');
        this.saving.set(false);
      }
    });
  }

  deleteFood(food: Food): void {
    if (!window.confirm(`Remove "${food.name}" from the customer menu?`)) return;
    this.errorMessage.set('');
    this.adminService.deleteFood(food.key).subscribe({
      next: () => {
        this.localFoods.update(foods => foods.filter(item => item.key !== food.key));
        this.successMessage.set(`${food.name} was removed from the menu.`);
      },
      error: () => this.errorMessage.set(`Could not remove ${food.name}.`)
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
