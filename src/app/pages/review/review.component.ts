import { Component, OnInit } from '@angular/core';
import { ReviewResponse } from 'src/app/models/review.model';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  reviews: ReviewResponse[] = [];
  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.reviewService.getAllReviews().subscribe((res) => {
      this.reviews = res;
    });
  }
}
