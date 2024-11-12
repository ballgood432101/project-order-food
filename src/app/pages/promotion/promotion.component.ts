import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import {
  PromotionModel,
  PromotionService,
} from 'src/app/services/promotion.service';
import { AddOrEditPromotionComponent } from './component/add-or-edit-promotion/add-or-edit-promotion.component';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss'],
})
export class PromotionComponent implements OnInit {
  promotions: PromotionModel[] = [];
  displayedColumns: string[] = ['promotion_code', 'discount'];

  public get isCustomer() {
    return this.authService.getIsCustomer;
  }

  constructor(
    private promotionService: PromotionService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.isCustomer) {
      this.displayedColumns.unshift('promotion_id');
      this.displayedColumns.push('actions');
    }
    this.getPromotions();
  }

  // Fetch promotions from the server
  getPromotions(): void {
    this.promotionService.getAllPromotions().subscribe(
      (response: PromotionModel[]) => {
        this.promotions = response;
      },
      (error) => {
        console.error('Error fetching promotions:', error);
      }
    );
  }

  // Handle deleting a promotion
  deletePromotion(promotion_id: number): void {
    this.promotionService.deletePromotion(promotion_id).subscribe(() => {
      alert('Promotion deleted successfully!');
      this.getPromotions();
    });
  }

  openPromotionModal() {
    this.dialog
      .open(AddOrEditPromotionComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getPromotions();
        }
      });
  }

  editPromotion(promotion: PromotionModel): void {
    // Placeholder for editing logic
    this.dialog
      .open(AddOrEditPromotionComponent, { data: promotion })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getPromotions();
        }
      });
  }
}
