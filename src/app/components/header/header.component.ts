import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart, Cart2, CartItem, CartItem2 } from 'src/app/models/cart.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private _cart: Cart = { items: [] };
  private _cart2: Cart2 = { items: [] };
  public cart2: Cart2 = { items: [] };
  itemsQuantity = 0;

  public get loginLogoutTitle() {
    return this.authService.checkIsLoggedIn() ? 'Logout' : 'Login';
  }

  public get username() {
    return this.authService.getUser?.username;
  }

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartService.cart2.subscribe((res) => {
      this.cart2 = res;
      this.itemsQuantity = this.cart2.items
        .map((item) => item.quantity)
        .reduce((prev, curent) => prev + curent, 0);
    });
  }

  getCartLength(items: CartItem2[]): number {
    return this.cartService.getCartLength(items);
  }

  getTotal(items: CartItem2[]): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart().subscribe(() => {});
  }

  loginOrLogout(): void {
    if (this.authService.checkIsLoggedIn()) {
      this.authService.logout();
    } else {
      this.router.navigate(['login']);
    }
  }
}
