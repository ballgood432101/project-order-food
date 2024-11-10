import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckoutCart } from '../models/checkout.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private httpClient: HttpClient) {}

  public checkoutCart = (body: CheckoutCart): Observable<any> => {
    return this.httpClient.post<CheckoutCart>(
      `http://localhost:3000/api/checkout/`,
      body
    );
  };
  public getQrCode = (): Observable<any> => {
    return this.httpClient.get<{ qrcode: string }>(
      `http://localhost:3000/api/checkout/`
    );
  };
  public getQrCode2 = (body: { total_amount: number }): Observable<any> => {
    return this.httpClient.post<{ qrcode: string }>(
      `http://localhost:3000/api/checkout/qrcode`,
      body
    );
  };
}
