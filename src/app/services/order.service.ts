import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HistoryOrder } from '../models/history.model';

interface DefaultResponse {
  success: string;
  message: string;
}

export interface UpdateOrderStatusModel {
  order_id: number;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private httpClient: HttpClient) {}

  getAllHistoryOrder = (): Observable<HistoryOrder[]> => {
    return this.httpClient.get<HistoryOrder[]>(
      `http://localhost:3000/api/order`
    );
  };

  updateOrderStatus = (
    data: UpdateOrderStatusModel
  ): Observable<DefaultResponse> => {
    return this.httpClient.put<DefaultResponse>(
      `http://localhost:3000/api/order`,
      data
    );
  };
}
