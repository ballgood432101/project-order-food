import { Cart2, CartItem2 } from './cart.model';

export interface CheckoutCart {
  deliveryType: string;
  paymentType: string;
  discount?: number;
  items: CartItem2[];
}

export interface CheckoutItem {
  food_id: number;
  quantity: number;
  price: number;
}
