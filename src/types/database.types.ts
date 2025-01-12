export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
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
          document_url: string | null
          document_number: string | null
          momo_provider: string | null
          momo_number: string | null
          auto_transfer: boolean | null
          created_at: string | null
          updated_at: string | null
          company_logo_url: string | null
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
          document_url?: string | null
          document_number?: string | null
          momo_provider?: string | null
          momo_number?: string | null
          auto_transfer?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          company_logo_url?: string | null
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
          document_url?: string | null
          document_number?: string | null
          momo_provider?: string | null
          momo_number?: string | null
          auto_transfer?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          company_logo_url?: string | null
        }
      }
      wallets: {
        Row: {
          id: string
          user_id: string | null
          available: number | null
          pending: number | null
          validated: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          available?: number | null
          pending?: number | null
          validated?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          available?: number | null
          pending?: number | null
          validated?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_stats: {
        Row: {
          id: string
          user_id: string | null
          sales_total: number | null
          daily_sales: number | null
          monthly_sales: number | null
          total_transactions: number | null
          daily_transactions: number | null
          monthly_transactions: number | null
          previous_month_sales: number | null
          previous_month_transactions: number | null
          sales_growth: number | null
          total_products: number | null
          visible_products: number | null
          balance: number | null
          available_balance: number | null
          pending_requests: number | null
          validated_requests: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          sales_total?: number | null
          daily_sales?: number | null
          monthly_sales?: number | null
          total_transactions?: number | null
          daily_transactions?: number | null
          monthly_transactions?: number | null
          previous_month_sales?: number | null
          previous_month_transactions?: number | null
          sales_growth?: number | null
          total_products?: number | null
          visible_products?: number | null
          balance?: number | null
          available_balance?: number | null
          pending_requests?: number | null
          validated_requests?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          sales_total?: number | null
          daily_sales?: number | null
          monthly_sales?: number | null
          total_transactions?: number | null
          daily_transactions?: number | null
          monthly_transactions?: number | null
          previous_month_sales?: number | null
          previous_month_transactions?: number | null
          sales_growth?: number | null
          total_products?: number | null
          visible_products?: number | null
          balance?: number | null
          available_balance?: number | null
          pending_requests?: number | null
          validated_requests?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
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