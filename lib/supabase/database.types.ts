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
      decks: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          user_id?: string
        }
      }
      flashcards: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          front: string
          back: string
          deck_id: string
          user_id: string
          interval: number | null
          repetitions: number | null
          ease_factor: number | null
          next_review_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          front: string
          back: string
          deck_id: string
          user_id: string
          interval?: number | null
          repetitions?: number | null
          ease_factor?: number | null
          next_review_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          front?: string
          back?: string
          deck_id?: string
          user_id?: string
          interval?: number | null
          repetitions?: number | null
          ease_factor?: number | null
          next_review_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
  }
}
