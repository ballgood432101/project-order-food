import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PromotionModel {
  promotion_id?: number;
  discount: number;
  promotion_code: string;
}

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  constructor(private httpClient: HttpClient) {}

  public getAllPromotions = (): Observable<any> => {
    return this.httpClient.get<any>(`http://localhost:3000/api/promotion/`);
  };

  public addPromotion = (body: PromotionModel): Observable<any> => {
    return this.httpClient.post<any>(
      `http://localhost:3000/api/promotion/`,
      body
    );
  };

  public updatePromotion = (body: PromotionModel): Observable<any> => {
    return this.httpClient.put<any>(
      `http://localhost:3000/api/promotion/`,
      body
    );
  };
  public deletePromotion = (promotion_id: number): Observable<any> => {
    return this.httpClient.delete<any>(
      `http://localhost:3000/api/promotion/${promotion_id}`
    );
  };

  public validatePromotion = (body: {
    promotion_code: string;
  }): Observable<any> => {
    return this.httpClient.post<any>(
      `http://localhost:3000/api/promotion/validate`,
      body
    );
  };
}
