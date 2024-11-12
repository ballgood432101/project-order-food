import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HistoryOrder } from 'src/app/models/history.model';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-review-order-modal',
  templateUrl: './review-order-modal.component.html',
  styleUrls: ['./review-order-modal.component.scss'],
})
export class ReviewOrderModalComponent implements OnInit {
  @Input() ratingCategories = [
    { label: 'Quality', rating: 0 },
    { label: 'Service', rating: 0 },
    { label: 'Delivery', rating: 0 },
    { label: 'Valueable', rating: 0 },
  ];

  reviewText: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: HistoryOrder,
    private dialogRef: MatDialogRef<ReviewOrderModalComponent>,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {}

  setRating(categoryIndex: number, rating: number) {
    this.ratingCategories[categoryIndex].rating = rating;
  }

  onClose(completed: boolean) {
    // Logic to close the modal
    this.dialogRef.close(completed);
  }

  submitReview() {
    const reviewData = {
      order_id: this.data.order_id,
      ratings: this.ratingCategories,
      other_comments: this.reviewText,
    };
    this.reviewService.reviewOrder(reviewData).subscribe(() => {
      this.onClose(true);
    });
  }
}
