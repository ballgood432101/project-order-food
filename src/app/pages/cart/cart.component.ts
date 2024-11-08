import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cart, Cart2, CartItem, CartItem2 } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { Subscription, switchMap } from 'rxjs';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CheckoutCart } from 'src/app/models/checkout.model';

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
  subscription: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.cartService
        .getCart()
        .pipe(switchMap(() => this.cartService.cart2))
        .subscribe((_cart: Cart2) => {
          this.cart2 = _cart;
          this.dataSource2 = _cart.items;
        })
    );
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
    const body: CheckoutCart = {
      deliveryType: 'delivery',
      paymentType: 'credit_card',
      items: this.cart2.items,
    };
    this.subscription.add(
      this.checkoutService.checkoutCart(body).subscribe((res) => {
        this.cartService.getCart().subscribe(() => {});
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
