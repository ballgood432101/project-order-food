import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { AuthService } from 'src/app/services/auth.service';
import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';
import { FavouriteService } from 'src/app/services/favourite.service';

@Component({
  selector: '[app-product-box]',
  templateUrl: './product-box.component.html',
  styleUrls: ['./product-box.component.scss'],
})
export class ProductBoxComponent {
  @Input() fullWidthMode = false;
  @Input() product: Product | undefined;
  @Output() addToCart = new EventEmitter();
  isFavorite: boolean = false;

  public get isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  public get hasPermissionToEditFood() {
    return !this.authService.getIsCustomer && this.authService.isLoggedIn;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private favouriteService: FavouriteService
  ) {}

  onAddToCart(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['login']);
      return;
    }
    this.addToCart.emit(this.product);
  }

  onEdit(): void {
    this.dialog.open(EditProductModalComponent, {
      data: this.product,
    });
  }

  onFavourite(foodId: number, favoureiteId?: number): void {
    if (favoureiteId) {
      this.favouriteService.removeFavourite(favoureiteId).subscribe(() => {});
    } else {
      this.favouriteService
        .addFavourite({ food_id: foodId })
        .subscribe(() => {});
    }
  }
}
