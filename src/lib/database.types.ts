
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
      create_new_profile: {
        Args: {
          user_id: string
          user_name: string
          user_email: string
        }
        Returns: void
      }
      get_profile_by_id: {
        Args: {
          user_id: string
        }
        Returns: {
          id: string
          name: string
          email: string
          partner_id: string | null
          created_at: string
        }[]
      }
      get_profile_by_partner_id: {
        Args: {
          partner_id: string
        }
        Returns: {
          id: string
          name: string
          email: string
          partner_id: string | null
          created_at: string
        }[]
      }
      get_profile_for_user: {
        Args: {
          user_id: string
        }
        Returns: {
          id: string
          name: string
          email: string
          partner_id: string | null
          created_at: string
        }[]
      }
      get_tasks_for_user: {
        Args: {
          user_id: string
        }
        Returns: {
          id: string
          title: string
          type: string
          rating: number
          user_id: string
          timestamp: string
          status: string
          comment: string | null
          created_at: string
        }[]
      }
      get_profile_by_email: {
        Args: {
          email_param: string
        }
        Returns: {
          id: string
          name: string
          email: string
          partner_id: string | null
          created_at: string
        }[]
      }
      update_user_partner: {
        Args: {
          user_id_param: string
          partner_id_param: string | null
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
