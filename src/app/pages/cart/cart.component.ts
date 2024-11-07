import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cart, Cart2, CartItem, CartItem2 } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
// import { loadStripe } from '@stripe/stripe-js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart = { items: [] };
  cart2: Cart2 = { items: [] };
  displayedColumns: string[] = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ];
  dataSource: CartItem[] = [];
  dataSource2: CartItem2[] = [];
  cartSubscription: Subscription | undefined;

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    // this.cartSubscription = this.cartService.cart.subscribe((_cart: Cart) => {
    //   this.cart = _cart;
    //   this.dataSource = _cart.items;
    // });
    this.cartService.cart2.subscribe((_cart: Cart2) => {
      this.cart2 = _cart;
      this.dataSource2 = _cart.items;
    });
  }

  getTotal(items: CartItem2[]): number {
    return this.cartService.getTotal(items);
  }

  onAddQuantity(item: CartItem2): void {
    this.cartService.addToCart(item).subscribe(() => {});
  }

  onRemoveFromCart(item: CartItem2): void {
    this.cartService.removeFromCart(item);
  }

  onRemoveQuantity(item: CartItem2): void {
    this.cartService.removeQuantity(item).subscribe(() => {});
  }

  onClearCart(): void {
    this.cartService.clearCart().subscribe(() => {});
  }

  onCheckout(): void {
    // this.http
    //   .post('http://localhost:4242/checkout', {
    //     items: this.cart.items,
    //   })
    //   .subscribe(async (res: any) => {
    //     let stripe = await loadStripe('your token');
    //     stripe?.redirectToCheckout({
    //       sessionId: res.id,
    //     });
    //   });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
