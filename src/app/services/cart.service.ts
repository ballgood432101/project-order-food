import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Cart, Cart2, CartItem, CartItem2 } from '../models/cart.model';
import { finalize, map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: [] });
  cart2 = new BehaviorSubject<Cart2>({ items: [] });

  constructor(private _snackBar: MatSnackBar, private httpClient: HttpClient) {}

  getCart = (): Observable<any> => {
    return this.httpClient.get<any>(`http://localhost:3000/api/cart`).pipe(
      tap(
        (res) => {
          const converted = { items: res };
          this.cart2.next(converted);
        },
        map((res) => res)
      )
    );
  };

  addToCart(item: CartItem2): Observable<any> {
    return this.httpClient
      .post<any>(`http://localhost:3000/api/cart`, item)
      .pipe(
        tap((res) => {
          this.cart2.next({ items: res });
          this._snackBar.open('1 item added to cart.', 'Ok', {
            duration: 3000,
          });
        })
      );
  }

  removeFromCart(item: CartItem2, updateCart = true): CartItem2[] {
    const filteredItems = this.cart2.value.items.filter(
      (_item) => _item.id !== item.id
    );

    if (updateCart) {
      this.cart2.next({ items: filteredItems });
      this._snackBar.open('1 item removed from cart.', 'Ok', {
        duration: 3000,
      });
    }

    return filteredItems;
  }

  removeQuantity(item: CartItem2): Observable<any> {
    return this.httpClient
      .delete<any>(`http://localhost:3000/api/cart/${item.id}`, { body: item })
      .pipe(
        tap((res) => {
          let itemForRemoval!: any;

          let filteredItems = this.cart2.value.items.map((_item) => {
            if (_item.id === item.id) {
              _item.quantity--;
              if (_item.quantity === 0) {
                itemForRemoval = _item;
              }
            }

            return _item;
          });

          if (itemForRemoval) {
            filteredItems = this.removeFromCart(itemForRemoval, false);
          }

          this.cart2.next({ items: filteredItems });
          this._snackBar.open('1 item removed from cart.', 'Ok', {
            duration: 3000,
          });
        })
      );
  }

  clearCart(): Observable<any> {
    return this.httpClient.delete(`http://localhost:3000/api/cart`).pipe(
      tap((_) => {
        this.cart2.next({ items: [] });
        this._snackBar.open('Cart is cleared.', 'Ok', {
          duration: 3000,
        });
      })
    );
  }

  getTotal(items: CartItem2[]): number {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  getCartLength(items: CartItem2[]): number {
    return items
      .map((item) => item.quantity)
      .reduce((prev, curent) => prev + curent, 0);
  }
}
