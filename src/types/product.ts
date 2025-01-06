export interface PaymentLink {
  id: string;
  moneroo_token: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  long_description: string | null;
  amount: number;
  image_url: string | null;
  payment_link_id: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  payment_links?: PaymentLink;
}