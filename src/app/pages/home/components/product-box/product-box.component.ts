import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { AuthService } from 'src/app/services/auth.service';
import { EditProductModalComponent } from '../edit-product-modal/edit-product-modal.component';

@Component({
  selector: '[app-product-box]',
  templateUrl: './product-box.component.html',
})
export class ProductBoxComponent {
  @Input() fullWidthMode = false;
  @Input() product: Product | undefined;
  @Output() addToCart = new EventEmitter();

  public get isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  public get hasPermissionToEditFood() {
    return !this.authService.getIsCustomer && this.authService.isLoggedIn;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
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
}
