export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  payment_link_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SimplePage {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  payment_link_id: string;
  created_at: string;
  updated_at: string;
}