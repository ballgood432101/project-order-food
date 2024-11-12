export interface ReviewModel {
  order_id: number;
  ratings: Rating[];
  other_comments: string;
}

export interface Rating {
  label: string;
  rating: number;
}

export interface ReviewResponse {
  user_id: number;
  order_id: number;
  created_at: string;
  quality: number;
  delivery: number;
  valuable: number;
  service: number;
  other_comments: string;
}
