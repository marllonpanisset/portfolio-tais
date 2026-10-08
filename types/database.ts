export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MediaKind = "image" | "video";
export type MediaSource = "upload" | "youtube";

/**
 * Role de um usuário em um site da plataforma.
 * Espelha o enum public.membership_role criado em
 * supabase/migrations/20261005120000_create_identity_foundation.sql
 */
export type MembershipRole = "owner" | "editor" | "viewer";

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          year: number | null;
          is_published: boolean;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          year?: number | null;
          is_published?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          year?: number | null;
          is_published?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_categories: {
        Row: {
          project_id: string;
          category_id: string;
        };
        Insert: {
          project_id: string;
          category_id: string;
        };
        Update: {
          project_id?: string;
          category_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_categories_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      portfolio_projects: {
        Row: {
          id: string;
          project_id: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "portfolio_projects_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      media: {
        Row: {
          id: string;
          project_id: string;
          kind: MediaKind;
          source: MediaSource;
          external_url: string | null;
          storage_path: string | null;
          thumbnail_path: string | null;
          alt: string | null;
          caption: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          kind: MediaKind;
          source: MediaSource;
          external_url?: string | null;
          storage_path?: string | null;
          thumbnail_path?: string | null;
          alt?: string | null;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          kind?: MediaKind;
          source?: MediaSource;
          external_url?: string | null;
          storage_path?: string | null;
          thumbnail_path?: string | null;
          alt?: string | null;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "media_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      pages: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: Json;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: Json;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: Json;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          user_id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      sites: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      memberships: {
        Row: {
          id: string;
          user_id: string;
          site_id: string;
          role: MembershipRole;
          invited_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          site_id: string;
          role?: MembershipRole;
          invited_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          site_id?: string;
          role?: MembershipRole;
          invited_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "memberships_invited_by_fkey";
            columns: ["invited_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "memberships_site_id_fkey";
            columns: ["site_id"];
            isOneToOne: false;
            referencedRelation: "sites";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "memberships_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_site_owner: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      membership_role: MembershipRole;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
export type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];

export type ProjectCategoryRow = Database["public"]["Tables"]["project_categories"]["Row"];
export type ProjectCategoryInsert = Database["public"]["Tables"]["project_categories"]["Insert"];

export type MediaRow = Database["public"]["Tables"]["media"]["Row"];
export type MediaInsert = Database["public"]["Tables"]["media"]["Insert"];
export type MediaUpdate = Database["public"]["Tables"]["media"]["Update"];

export type PortfolioProjectRow = Database["public"]["Tables"]["portfolio_projects"]["Row"];

export type SiteSettingRow = Database["public"]["Tables"]["site_settings"]["Row"];

export type PageRow = Database["public"]["Tables"]["pages"]["Row"];
export type PageInsert = Database["public"]["Tables"]["pages"]["Insert"];
export type PageUpdate = Database["public"]["Tables"]["pages"]["Update"];

// ---------------------------------------------------------------------------
// Identity Foundation (profiles, sites, memberships)
// ---------------------------------------------------------------------------

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type SiteRow = Database["public"]["Tables"]["sites"]["Row"];
export type SiteInsert = Database["public"]["Tables"]["sites"]["Insert"];
export type SiteUpdate = Database["public"]["Tables"]["sites"]["Update"];

export type MembershipRow = Database["public"]["Tables"]["memberships"]["Row"];
export type MembershipInsert = Database["public"]["Tables"]["memberships"]["Insert"];
export type MembershipUpdate = Database["public"]["Tables"]["memberships"]["Update"];
