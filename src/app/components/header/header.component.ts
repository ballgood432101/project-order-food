import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart, Cart2, CartItem, CartItem2 } from 'src/app/models/cart.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  private _cart: Cart = { items: [] };
  private _cart2: Cart2 = { items: [] };
  itemsQuantity = 0;
  // loginLogoutTitle = "Login"

  public get loginLogoutTitle() {
    return this.authService.checkIsLoggedIn() ? 'Logout' : 'Login';
  }

  public get username() {
    return this.authService.getUser?.username;
  }

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;

    this.itemsQuantity = cart.items
      .map((item) => item.quantity)
      .reduce((prev, curent) => prev + curent, 0);
  }

  @Input()
  get cart2(): Cart2 {
    return this._cart2;
  }

  set cart2(cart: Cart2) {
    this._cart2 = cart;

    this.itemsQuantity = cart.items
      .map((item) => item.quantity)
      .reduce((prev, curent) => prev + curent, 0);
  }

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe((res) => {
      console.log(res);
    });
  }

  getTotal(items: CartItem2[]): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  loginOrLogout(): void {
    if (this.authService.checkIsLoggedIn()) {
      this.authService.logout();
    } else {
      this.router.navigate(['login']);
    }
  }
}
