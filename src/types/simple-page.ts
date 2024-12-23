import { PaymentLink } from "./product";

export interface SimplePage {
  id: string;
  name: string;
  description: string;
  amount: number;
  image_url: string | null;
  payment_link_id: string | null;
  created_at: string;
  updated_at: string;
  payment_links?: PaymentLink;
}