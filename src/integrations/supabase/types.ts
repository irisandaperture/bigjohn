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
      backtest_results: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: number
          profit_percentage: number | null
          start_date: string | null
          total_trades: number | null
          trading_pair_id: number | null
          win_rate: number | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: number
          profit_percentage?: number | null
          start_date?: string | null
          total_trades?: number | null
          trading_pair_id?: number | null
          win_rate?: number | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: number
          profit_percentage?: number | null
          start_date?: string | null
          total_trades?: number | null
          trading_pair_id?: number | null
          win_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "backtest_results_trading_pair_id_fkey"
            columns: ["trading_pair_id"]
            isOneToOne: false
            referencedRelation: "trading_pairs"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_logs: {
        Row: {
          action: string
          id: number
          message: string | null
          price: number | null
          quantity: number | null
          status: string | null
          timestamp: string | null
          trading_pair_id: number | null
        }
        Insert: {
          action: string
          id?: number
          message?: string | null
          price?: number | null
          quantity?: number | null
          status?: string | null
          timestamp?: string | null
          trading_pair_id?: number | null
        }
        Update: {
          action?: string
          id?: number
          message?: string | null
          price?: number | null
          quantity?: number | null
          status?: string | null
          timestamp?: string | null
          trading_pair_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trading_logs_trading_pair_id_fkey"
            columns: ["trading_pair_id"]
            isOneToOne: false
            referencedRelation: "trading_pairs"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_pairs: {
        Row: {
          created_at: string | null
          id: number
          last_updated: string | null
          symbol: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          last_updated?: string | null
          symbol: string
        }
        Update: {
          created_at?: string | null
          id?: number
          last_updated?: string | null
          symbol?: string
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
