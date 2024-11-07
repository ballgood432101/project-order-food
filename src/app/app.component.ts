import { Component, OnInit } from '@angular/core';
import { Cart, Cart2, CartItem } from './models/cart.model';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  cart: Cart = { items: [] };
  cart2: Cart2 = { items: [] };

  public get isLoginOrRegisterPage() {
    return this.authService.isLoginOrRegisterPage;
  }

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cartService.cart2.subscribe((_cart) => {
      this.cart2 = _cart;
    });
  }
}
