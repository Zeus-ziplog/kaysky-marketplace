export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      mpesa_transactions: {
        Row: {
          amount: number
          checkout_request_id: string | null
          created_at: string
          id: string
          merchant_request_id: string | null
          mpesa_receipt: string | null
          order_id: string | null
          phone: string
          raw_payload: Json | null
          result_code: number | null
          result_desc: string | null
          status: Database["public"]["Enums"]["mpesa_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          checkout_request_id?: string | null
          created_at?: string
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt?: string | null
          order_id?: string | null
          phone: string
          raw_payload?: Json | null
          result_code?: number | null
          result_desc?: string | null
          status?: Database["public"]["Enums"]["mpesa_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          checkout_request_id?: string | null
          created_at?: string
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt?: string | null
          order_id?: string | null
          phone?: string
          raw_payload?: Json | null
          result_code?: number | null
          result_desc?: string | null
          status?: Database["public"]["Enums"]["mpesa_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mpesa_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          link: string | null
          message: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          link?: string | null
          message: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          link?: string | null
          message?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          delivery_address: string | null
          id: string
          mpesa_checkout_id: string | null
          mpesa_receipt: string | null
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          phone: string | null
          product_id: string | null
          product_name: string
          quantity: number
          status: Database["public"]["Enums"]["order_status"]
          total: number
          unit_price: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          delivery_address?: string | null
          id?: string
          mpesa_checkout_id?: string | null
          mpesa_receipt?: string | null
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          phone?: string | null
          product_id?: string | null
          product_name: string
          quantity?: number
          status?: Database["public"]["Enums"]["order_status"]
          total: number
          unit_price: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          delivery_address?: string | null
          id?: string
          mpesa_checkout_id?: string | null
          mpesa_receipt?: string | null
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          phone?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          unit_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          gallery: Json | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price: number
          slug: string
          stock: number
          tagline: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          gallery?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price: number
          slug: string
          stock?: number
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          gallery?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price?: number
          slug?: string
          stock?: number
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "customer"
      mpesa_status: "pending" | "success" | "failed" | "canceled"
      order_status: "pending" | "paid" | "failed" | "canceled"
      payment_method: "mpesa" | "card" | "cash"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "customer"],
      mpesa_status: ["pending", "success", "failed", "canceled"],
      order_status: ["pending", "paid", "failed", "canceled"],
      payment_method: ["mpesa", "card", "cash"],
    },
  },
} as const
