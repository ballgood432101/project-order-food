import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Cart, Cart2, CartItem, CartItem2 } from '../models/cart.model';
import { map, Observable, tap } from 'rxjs';
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
      tap((res) => {
        const converted = { items: res };
        this.cart2.next(converted);
      })
    );
  };

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];

    const itemInCart = items.find((_item) => _item.id === item.id);
    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }

    this.cart.next({ items });
    this._snackBar.open('1 item added to cart.', 'Ok', { duration: 3000 });
  }

  removeFromCart(item: CartItem, updateCart = true): CartItem[] {
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );

    if (updateCart) {
      this.cart.next({ items: filteredItems });
      this._snackBar.open('1 item removed from cart.', 'Ok', {
        duration: 3000,
      });
    }

    return filteredItems;
  }

  removeQuantity(item: CartItem): void {
    let itemForRemoval!: CartItem;

    let filteredItems = this.cart.value.items.map((_item) => {
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

    this.cart.next({ items: filteredItems });
    this._snackBar.open('1 item removed from cart.', 'Ok', {
      duration: 3000,
    });
  }

  clearCart(): void {
    this.cart.next({ items: [] });
    this._snackBar.open('Cart is cleared.', 'Ok', {
      duration: 3000,
    });
  }

  getTotal(items: CartItem2[]): number {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }
}
