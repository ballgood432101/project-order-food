import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class FoodService {
  private foods: Product[] = [];

  public get getFoodsFromService() {
    return this.foods;
  }
  constructor(private httpClient: HttpClient) {}

  public getFoods = (): Observable<Array<Product>> => {
    return this.httpClient
      .get<Array<Product>>(`http://localhost:3000/api/food`)
      .pipe(
        tap((res) => {
          this.foods = res;
        })
      );
  };

  public createFood = (food: Product): Observable<string> => {
    return this.httpClient.post<string>(`http://localhost:3000/api/food`, food);
  };

  public updateFood = (food: Product): Observable<string> => {
    return this.httpClient.put<string>(
      `http://localhost:3000/api/food/${food.food_id}`,
      food
    );
  };

  public deleteFood = (food_id: string): Observable<string> => {
    return this.httpClient.delete<string>(
      `http://localhost:3000/api/food/${food_id}`
    );
  };
}
