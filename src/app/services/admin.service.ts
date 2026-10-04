import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminFoodPayload, AdminUser, LocalFoodRecord } from '../models/food.model';

interface UsersResponse {
  users: AdminUser[];
}

interface FoodsResponse {
  foods: LocalFoodRecord[];
}

interface FoodResponse {
  food: LocalFoodRecord;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api';

  getUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}/admin/users`);
  }

  updateUserRole(userId: number, role: AdminUser['role']): Observable<{ user: AdminUser }> {
    return this.http.put<{ user: AdminUser }>(`${this.apiUrl}/admin/users/${userId}`, { role });
  }

  getFoods(): Observable<FoodsResponse> {
    return this.http.get<FoodsResponse>(`${this.apiUrl}/admin/foods`);
  }

  createFood(food: AdminFoodPayload): Observable<FoodResponse> {
    return this.http.post<FoodResponse>(`${this.apiUrl}/admin/foods`, food);
  }

  updateFood(foodKey: string, food: AdminFoodPayload): Observable<FoodResponse> {
    return this.http.put<FoodResponse>(`${this.apiUrl}/admin/foods/${encodeURIComponent(foodKey)}`, food);
  }

  deleteFood(foodKey: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/admin/foods/${encodeURIComponent(foodKey)}`);
  }

  getPublishedFoods(): Observable<FoodsResponse> {
    return this.http.get<FoodsResponse>(`${this.apiUrl}/foods/local`);
  }

  getPublishedFood(foodId: number): Observable<FoodResponse> {
    return this.http.get<FoodResponse>(`${this.apiUrl}/foods/local/${foodId}`);
  }
}
