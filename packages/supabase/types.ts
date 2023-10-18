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
      installConfigs: {
        Row: {
          configsPath: string | null
          created_at: string
          id: number
          modId: number
          modsPath: string | null
          name: string
          resModsPath: string | null
        }
        Insert: {
          configsPath?: string | null
          created_at?: string
          id?: number
          modId: number
          modsPath?: string | null
          name: string
          resModsPath?: string | null
        }
        Update: {
          configsPath?: string | null
          created_at?: string
          id?: number
          modId?: number
          modsPath?: string | null
          name?: string
          resModsPath?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "installConfigs_modId_fkey"
            columns: ["modId"]
            referencedRelation: "mods"
            referencedColumns: ["id"]
          }
        ]
      }
      mods: {
        Row: {
          categories: Database["public"]["Enums"]["ModCategory"][] | null
          created_at: string
          id: number
          name: string
        }
        Insert: {
          categories?: Database["public"]["Enums"]["ModCategory"][] | null
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          categories?: Database["public"]["Enums"]["ModCategory"][] | null
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          profileispublic: boolean
          wgmodids: number[] | null
        }
        Insert: {
          id?: string
          profileispublic?: boolean
          wgmodids?: number[] | null
        }
        Update: {
          id?: string
          profileispublic?: boolean
          wgmodids?: number[] | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      streamers: {
        Row: {
          avatarUrl: string | null
          bannerColor: string | null
          bannerUrl: string | null
          id: number
          profileId: string | null
          twitchUsername: string
        }
        Insert: {
          avatarUrl?: string | null
          bannerColor?: string | null
          bannerUrl?: string | null
          id?: number
          profileId?: string | null
          twitchUsername: string
        }
        Update: {
          avatarUrl?: string | null
          bannerColor?: string | null
          bannerUrl?: string | null
          id?: number
          profileId?: string | null
          twitchUsername?: string
        }
        Relationships: [
          {
            foreignKeyName: "streamers_profileId_fkey"
            columns: ["profileId"]
            referencedRelation: "profiles"
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
      ModCategory: "Tools" | "Reticle" | "Mark of Excellence"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
