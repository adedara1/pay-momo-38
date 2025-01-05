export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          quantity: number
          session_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          session_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_links: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          moneroo_token: string | null
          payment_type: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          moneroo_token?: string | null
          payment_type: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          moneroo_token?: string | null
          payment_type?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          customer_email: string
          customer_first_name: string
          customer_last_name: string
          customer_phone: string | null
          description: string | null
          id: string
          metadata: Json | null
          method: string
          moneroo_payout_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          customer_email: string
          customer_first_name: string
          customer_last_name: string
          customer_phone?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          method: string
          moneroo_payout_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          customer_email?: string
          customer_first_name?: string
          customer_last_name?: string
          customer_phone?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          method?: string
          moneroo_payout_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          payment_link_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          payment_link_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          payment_link_id?: string | null
          updated_at?: string | null
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
          created_at: string | null
          document_number: string | null
          document_url: string | null
          first_name: string
          id: string
          last_name: string
          momo_number: string | null
          momo_provider: string | null
          phone_number: string | null
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
          created_at?: string | null
          document_number?: string | null
          document_url?: string | null
          first_name: string
          id: string
          last_name: string
          momo_number?: string | null
          momo_provider?: string | null
          phone_number?: string | null
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
          created_at?: string | null
          document_number?: string | null
          document_url?: string | null
          first_name?: string
          id?: string
          last_name?: string
          momo_number?: string | null
          momo_provider?: string | null
          phone_number?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string | null
          id: string
          product_fee_percentage: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_fee_percentage?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_fee_percentage?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      simple_pages: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          payment_link_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          payment_link_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          payment_link_id?: string | null
          updated_at?: string | null
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
          created_at: string | null
          customer_contact: string | null
          customer_name: string | null
          id: string
          moneroo_reference: string | null
          processed: boolean | null
          product_id: string | null
          status: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_contact?: string | null
          customer_name?: string | null
          id?: string
          moneroo_reference?: string | null
          processed?: boolean | null
          product_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_contact?: string | null
          customer_name?: string | null
          id?: string
          moneroo_reference?: string | null
          processed?: boolean | null
          product_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          available_balance: number | null
          balance: number | null
          created_at: string | null
          daily_sales: number | null
          daily_transactions: number | null
          id: string
          monthly_sales: number | null
          monthly_transactions: number | null
          pending_requests: number | null
          previous_month_sales: number | null
          previous_month_transactions: number | null
          sales_growth: number | null
          sales_total: number | null
          total_products: number | null
          total_transactions: number | null
          updated_at: string | null
          user_id: string | null
          validated_requests: number | null
          visible_products: number | null
        }
        Insert: {
          available_balance?: number | null
          balance?: number | null
          created_at?: string | null
          daily_sales?: number | null
          daily_transactions?: number | null
          id?: string
          monthly_sales?: number | null
          monthly_transactions?: number | null
          pending_requests?: number | null
          previous_month_sales?: number | null
          previous_month_transactions?: number | null
          sales_growth?: number | null
          sales_total?: number | null
          total_products?: number | null
          total_transactions?: number | null
          updated_at?: string | null
          user_id?: string | null
          validated_requests?: number | null
          visible_products?: number | null
        }
        Update: {
          available_balance?: number | null
          balance?: number | null
          created_at?: string | null
          daily_sales?: number | null
          daily_transactions?: number | null
          id?: string
          monthly_sales?: number | null
          monthly_transactions?: number | null
          pending_requests?: number | null
          previous_month_sales?: number | null
          previous_month_transactions?: number | null
          sales_growth?: number | null
          sales_total?: number | null
          total_products?: number | null
          total_transactions?: number | null
          updated_at?: string | null
          user_id?: string | null
          validated_requests?: number | null
          visible_products?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          available: number | null
          created_at: string | null
          id: string
          pending: number | null
          updated_at: string | null
          user_id: string
          validated: number | null
        }
        Insert: {
          available?: number | null
          created_at?: string | null
          id?: string
          pending?: number | null
          updated_at?: string | null
          user_id: string
          validated?: number | null
        }
        Update: {
          available?: number | null
          created_at?: string | null
          id?: string
          pending?: number | null
          updated_at?: string | null
          user_id?: string
          validated?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
