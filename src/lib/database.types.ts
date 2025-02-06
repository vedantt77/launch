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
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      startups: {
        Row: {
          id: string
          name: string
          description: string
          logo_url: string
          website: string
          launch_date: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          logo_url: string
          website: string
          launch_date: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          logo_url?: string
          website?: string
          launch_date?: string
          user_id?: string
          created_at?: string
        }
      }
      upvotes: {
        Row: {
          id: string
          startup_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          startup_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          startup_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_startup_upvotes: {
        Args: {
          startup_id: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}