import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { FavouriteModel } from '../models/favourite.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  public favourites: BehaviorSubject<Product[]> = new BehaviorSubject<
    Product[]
  >([]);

  constructor(private httpClient: HttpClient) {}

  public getFavourite = (): Observable<Product[]> => {
    return this.httpClient
      .get<Product[]>(`http://localhost:3000/api/favorite`)
      .pipe(
        tap((res) => {
          this.favourites.next(res);
        })
      );
  };

  public addFavourite = (body: { food_id: number }): Observable<Product[]> => {
    return this.httpClient
      .post<Product[]>(`http://localhost:3000/api/favorite/`, body)
      .pipe(
        tap((res) => {
          this.favourites.next(res);
        })
      );
  };

  public removeFavourite = (favourite_id: number): Observable<Product[]> => {
    return this.httpClient
      .delete<Product[]>(`http://localhost:3000/api/favorite/${favourite_id}`)
      .pipe(
        tap((res) => {
          this.favourites.next(res);
        })
      );
  };
}
