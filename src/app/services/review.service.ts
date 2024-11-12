import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewModel, ReviewResponse } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private httpClient: HttpClient) {}

  public getAllReviews = (): Observable<ReviewResponse[]> => {
    return this.httpClient.get<ReviewResponse[]>(
      `http://localhost:3000/api/review`
    );
  };

  public reviewOrder = (body: ReviewModel): Observable<string> => {
    return this.httpClient.post<string>(
      `http://localhost:3000/api/review`,
      body
    );
  };
}
