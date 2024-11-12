import { CartItem2 } from './cart.model';

export interface HistoryOrder {
  order_id: number;
  user_id: number;
  username: string;
  status: string;
  delivery_type: string;
  payment_type: string;
  discount: string;
  total_amount: string;
  order_created_at: string;
  order_updated_at: string;
  items: CartItem2[];
  is_reviewed: boolean;
}
