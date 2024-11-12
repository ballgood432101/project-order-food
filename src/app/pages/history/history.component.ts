import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HistoryOrder } from 'src/app/models/history.model';
import { OrderService } from 'src/app/services/order.service';
import { HistoryDetailsComponent } from './component/history-details/history-details.component';
import { ReviewOrderModalComponent } from './component/review-order-modal/review-order-modal.component';
import { AuthService } from 'src/app/services/auth.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  displayedColumns: string[] = [
    'order_id',
    'username',
    'total_amount',
    'status',
    'action',
  ];
  dataSource: HistoryOrder[] = [];

  constructor(
    private historyService: OrderService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getHistoryOrder();
  }

  getStatusClass(status: string): string {
    return `status-${status.replace('_', '-').toLowerCase()}`;
  }

  getHistoryOrder() {
    this.historyService.getAllHistoryOrder().subscribe((res) => {
      this.dataSource = res;
    });
  }

  isAbleToReview(data: HistoryOrder): boolean {
    return (
      !data.is_reviewed &&
      data.status === 'completed' &&
      this.authService.getIsCustomer
    );
  }

  onOpenDetails(data: HistoryOrder) {
    this.dialog
      .open(HistoryDetailsComponent, { data })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'success') {
          this.getHistoryOrder();
        }
      });
  }

  onOpenReviewModal(data: HistoryOrder) {
    this.dialog
      .open(ReviewOrderModalComponent, { data })
      .afterClosed()
      .subscribe((result) => {
        this.getHistoryOrder();
      });
  }
}
