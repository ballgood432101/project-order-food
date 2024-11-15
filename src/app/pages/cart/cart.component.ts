import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cart, Cart2, CartItem, CartItem2 } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { Subscription, switchMap } from 'rxjs';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CheckoutCart } from 'src/app/models/checkout.model';
import { MatDialog } from '@angular/material/dialog';
import { QrCodeModalComponent } from './component/qr-code-modal/qr-code-modal.component';
import { PromotionService } from 'src/app/services/promotion.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
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
  paymentType: string = 'qr_code';
  promotionCode: string = '';
  discount: number = 0;

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private dialog: MatDialog,
    private promotionService: PromotionService
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

  getTotalWithDiscount(items: CartItem2[]): number {
    return this.cartService.getTotal(items) - this.discount;
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
      paymentType: this.paymentType,
      discount: this.discount,
      items: this.cart2.items,
    };
    if ((this.paymentType = 'qr_code')) {
      const qrBody: { total_amount: number } = {
        total_amount: this.getTotalWithDiscount(this.cart2.items),
      };
      this.subscription.add(
        this.checkoutService.getQrCode2(qrBody).subscribe((res) => {
          this.dialog
            .open(QrCodeModalComponent, {
              data: res,
              disableClose: true,
            })
            .afterClosed()
            .subscribe((result) => {
              if (result === 'success') {
                this.checkoutCart(body);
              }
            });
        })
      );
    } else {
      this.checkoutCart(body);
    }
  }

  applyPromotion(): void {
    this.promotionService
      .validatePromotion({ promotion_code: this.promotionCode })
      .subscribe((response) => {
        if (response.valid) {
          this.discount = response.discount;
          alert('Promotion applied successfully!');
        } else {
          alert('Invalid promotion code');
          this.discount = 0;
        }
      });
  }

  private checkoutCart(body: CheckoutCart) {
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
