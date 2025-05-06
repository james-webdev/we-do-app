
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
      tasks: {
        Row: {
          id: string
          title: string
          type: string
          rating: number
          user_id: string
          timestamp: string
          status: string
          comment?: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          type: string
          rating: number
          user_id: string
          timestamp: string
          status: string
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: string
          rating?: number
          user_id?: string
          timestamp?: string
          status?: string
          comment?: string | null
          created_at?: string
        }
      }
      brownie_points: {
        Row: {
          id: string
          from_user_id: string
          to_user_id: string
          type: string
          message: string
          redeemed: boolean
          created_at: string
          points: number
        }
        Insert: {
          id?: string
          from_user_id: string
          to_user_id: string
          type: string
          message: string
          redeemed: boolean
          created_at?: string
          points: number
        }
        Update: {
          id?: string
          from_user_id?: string
          to_user_id?: string
          type?: string
          message?: string
          redeemed?: boolean
          created_at?: string
          points?: number
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          partner_id: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          partner_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          partner_id?: string | null
          created_at?: string
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
  }
}
