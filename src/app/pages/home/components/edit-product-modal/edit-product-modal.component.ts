import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from 'src/app/models/product.model';
import { FoodService } from 'src/app/services/food.service';

@Component({
  selector: 'app-edit-product-modal',
  templateUrl: './edit-product-modal.component.html',
  styleUrls: ['./edit-product-modal.component.scss'],
})
export class EditProductModalComponent implements OnInit {
  public product: Product | undefined;
  public form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private foodService: FoodService,
    private diablogRef: MatDialogRef<EditProductModalComponent>
  ) {
    this.form = new FormGroup({
      food_id: new FormControl(this.data.food_id, Validators.required),
      food_name: new FormControl(this.data.food_name, Validators.required),
      food_type: new FormControl(this.data.food_type, Validators.required),
      price: new FormControl(this.data.price, Validators.required),
      image: new FormControl(this.data.image, Validators.required),
    });
  }

  ngOnInit(): void {}

  update() {
    if (this.form.valid) {
      this.foodService.updateFood(this.form.value).subscribe((res) => {
        console.log(res);
        this.diablogRef.close();
      });
    }
  }

  close() {
    this.diablogRef.close();
  }
}
