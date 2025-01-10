import { Database as DatabaseGenerated } from './types.generated'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database extends DatabaseGenerated {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          phone_number: string | null
          company_name: string | null
          company_description: string | null
          whatsapp_number: string | null
          company_email: string | null
          country: string | null
          city: string | null
          business_sector: string | null
          document_number: string | null
          company_logo_url: string | null
          document_url: string | null
          momo_provider: string | null
          momo_number: string | null
          auto_transfer: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          phone_number?: string | null
          company_name?: string | null
          company_description?: string | null
          whatsapp_number?: string | null
          company_email?: string | null
          country?: string | null
          city?: string | null
          business_sector?: string | null
          document_number?: string | null
          company_logo_url?: string | null
          document_url?: string | null
          momo_provider?: string | null
          momo_number?: string | null
          auto_transfer?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          phone_number?: string | null
          company_name?: string | null
          company_description?: string | null
          whatsapp_number?: string | null
          company_email?: string | null
          country?: string | null
          city?: string | null
          business_sector?: string | null
          document_number?: string | null
          company_logo_url?: string | null
          document_url?: string | null
          momo_provider?: string | null
          momo_number?: string | null
          auto_transfer?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      admin_users: {
        Row: {
          id: string
          created_at: string
        }
        Insert: {
          id: string
          created_at?: string
        }
        Update: {
          id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      payment_links: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          moneroo_token: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          moneroo_token?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          moneroo_token?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          customer_email: string | null
          customer_first_name: string | null
          customer_last_name: string | null
          customer_phone: string | null
          description: string | null
          id: string
          method: string | null
          moneroo_payout_id: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_phone?: string | null
          description?: string | null
          id?: string
          method?: string | null
          moneroo_payout_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_phone?: string | null
          description?: string | null
          id?: string
          method?: string | null
          moneroo_payout_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          long_description: string | null
          name: string
          payment_link_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          long_description?: string | null
          name: string
          payment_link_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          long_description?: string | null
          name?: string
          payment_link_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_payment_link_id_fkey"
            columns: ["payment_link_id"]
            isOneToOne: false
            referencedRelation: "payment_links"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          auto_transfer: boolean | null
          business_sector: string | null
          city: string | null
          company_description: string | null
          company_email: string | null
          company_logo_url: string | null
          company_name: string | null
          country: string | null
          created_at: string
          document_number: string | null
          document_url: string | null
          first_name: string | null
          id: string
          last_name: string | null
          momo_number: string | null
          momo_provider: string | null
          phone_number: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          auto_transfer?: boolean | null
          business_sector?: string | null
          city?: string | null
          company_description?: string | null
          company_email?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          document_number?: string | null
          document_url?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          momo_number?: string | null
          momo_provider?: string | null
          phone_number?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          auto_transfer?: boolean | null
          business_sector?: string | null
          city?: string | null
          company_description?: string | null
          company_email?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          document_number?: string | null
          document_url?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          momo_number?: string | null
          momo_provider?: string | null
          phone_number?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          product_fee_percentage: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          product_fee_percentage?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          product_fee_percentage?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      simple_pages: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          payment_link_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          payment_link_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          payment_link_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simple_pages_payment_link_id_fkey"
            columns: ["payment_link_id"]
            isOneToOne: false
            referencedRelation: "payment_links"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          customer_contact: string | null
          customer_name: string | null
          id: string
          moneroo_reference: string | null
          payment_link_id: string | null
          processed: boolean | null
          product_id: string | null
          status: string | null
          type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          customer_contact?: string | null
          customer_name?: string | null
          id?: string
          moneroo_reference?: string | null
          payment_link_id?: string | null
          processed?: boolean | null
          product_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          customer_contact?: string | null
          customer_name?: string | null
          id?: string
          moneroo_reference?: string | null
          payment_link_id?: string | null
          processed?: boolean | null
          product_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_payment_link_id_fkey"
            columns: ["payment_link_id"]
            isOneToOne: false
            referencedRelation: "payment_links"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          available_balance: number | null
          balance: number | null
          created_at: string
          daily_sales: number | null
          daily_transactions: number | null
          monthly_sales: number | null
          monthly_transactions: number | null
          pending_requests: number | null
          previous_month_sales: number | null
          previous_month_transactions: number | null
          sales_growth: number | null
          sales_total: number | null
          total_products: number | null
          total_transactions: number | null
          updated_at: string
          user_id: string
          validated_requests: number | null
          visible_products: number | null
        }
        Insert: {
          available_balance?: number | null
          balance?: number | null
          created_at?: string
          daily_sales?: number | null
          daily_transactions?: number | null
          monthly_sales?: number | null
          monthly_transactions?: number | null
          pending_requests?: number | null
          previous_month_sales?: number | null
          previous_month_transactions?: number | null
          sales_growth?: number | null
          sales_total?: number | null
          total_products?: number | null
          total_transactions?: number | null
          updated_at?: string
          user_id: string
          validated_requests?: number | null
          visible_products?: number | null
        }
        Update: {
          available_balance?: number | null
          balance?: number | null
          created_at?: string
          daily_sales?: number | null
          daily_transactions?: number | null
          monthly_sales?: number | null
          monthly_transactions?: number | null
          pending_requests?: number | null
          previous_month_sales?: number | null
          previous_month_transactions?: number | null
          sales_growth?: number | null
          sales_total?: number | null
          total_products?: number | null
          total_transactions?: number | null
          updated_at?: string
          user_id?: string
          validated_requests?: number | null
          visible_products?: number | null
        }
        Relationships: []
      }
      wallets: {
        Row: {
          available: number | null
          created_at: string
          pending: number | null
          updated_at: string
          user_id: string
          validated: number | null
        }
        Insert: {
          available?: number | null
          created_at?: string
          pending?: number | null
          updated_at?: string
          user_id: string
          validated?: number | null
        }
        Update: {
          available?: number | null
          created_at?: string
          pending?: number | null
          updated_at?: string
          user_id?: string
          validated?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never;
