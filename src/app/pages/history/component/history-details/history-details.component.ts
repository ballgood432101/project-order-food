import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HistoryOrder } from 'src/app/models/history.model';
import { AuthService } from 'src/app/services/auth.service';
import {
  OrderService,
  UpdateOrderStatusModel,
} from 'src/app/services/order.service';

@Component({
  selector: 'app-history-details',
  templateUrl: './history-details.component.html',
  styleUrls: ['./history-details.component.scss'],
})
export class HistoryDetailsComponent implements OnInit {
  public get isCustomer(): boolean {
    return this.authService.getIsCustomer;
  }

  public get isAllowCancelOrder(): boolean {
    return !this.isCustomer || this.data.status === 'pending';
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: HistoryOrder,
    private dialogRef: MatDialogRef<HistoryDetailsComponent>,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }

  getStatusClass(status: string): string {
    return `status-${status.replace('_', '-').toLowerCase()}`;
  }

  onProgressOrder() {
    const body: UpdateOrderStatusModel = {
      order_id: this.data.order_id,
      status: 'in_progress',
    };
    this.orderService.updateOrderStatus(body).subscribe((res) => {
      this.dialogRef.close('success');
    });
  }

  onCompleteOrder() {
    const body: UpdateOrderStatusModel = {
      order_id: this.data.order_id,
      status: 'completed',
    };
    this.orderService.updateOrderStatus(body).subscribe((res) => {
      this.dialogRef.close('success');
    });
  }

  onCancelOrder() {
    const body: UpdateOrderStatusModel = {
      order_id: this.data.order_id,
      status: 'canceled',
    };
    this.orderService.updateOrderStatus(body).subscribe((res) => {
      this.dialogRef.close('success');
    });
  }
}
