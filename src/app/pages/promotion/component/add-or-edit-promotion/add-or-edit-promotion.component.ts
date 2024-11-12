import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  PromotionModel,
  PromotionService,
} from 'src/app/services/promotion.service';

@Component({
  selector: 'app-add-or-edit-promotion',
  templateUrl: './add-or-edit-promotion.component.html',
  styleUrls: ['./add-or-edit-promotion.component.scss'],
})
export class AddOrEditPromotionComponent implements OnInit {
  public form: FormGroup;
  public addOrEditButtonTitle: string = 'Add';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PromotionModel,
    private dialogRef: MatDialogRef<AddOrEditPromotionComponent>,
    private promotionSerice: PromotionService
  ) {
    if (this.data) {
      this.addOrEditButtonTitle = 'Edit';
    }
    this.form = new FormGroup({
      discount: new FormControl(
        this.data ? this.data.discount : '',
        Validators.required
      ),
      promotion_code: new FormControl(
        this.data ? this.data.promotion_code : '',
        Validators.required
      ),
    });
  }

  ngOnInit(): void {}

  createOrUpdate() {
    if (this.form.valid) {
      if (this.data) {
        const body: PromotionModel = {
          promotion_id: this.data.promotion_id,
          discount: this.form.value.discount,
          promotion_code: this.form.value.promotion_code,
        };
        this.promotionSerice.updatePromotion(body).subscribe((res) => {
          this.close(true);
        });
      } else {
        const body: PromotionModel = {
          discount: this.form.value.discount,
          promotion_code: this.form.value.promotion_code,
        };
        this.promotionSerice.addPromotion(body).subscribe((res) => {
          this.close(true);
        });
      }
    }
  }

  close(isSuccess: boolean) {
    this.dialogRef.close(isSuccess);
  }
}
