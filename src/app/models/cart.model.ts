export interface Cart {
  items: Array<CartItem>;
}

export interface CartItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  id: number;
}

export interface Cart2 {
  items: Array<CartItem2>;
}

export interface CartItem2 {
  quantity: number;
  price: number;
  status: string;
  food_name: string;
  food_id: number;
  user_id: number;
  id: number;
}
