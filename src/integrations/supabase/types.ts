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
      documents: {
        Row: {
          category: string
          created_at: string | null
          customizable_fields: Json | null
          description: string | null
          file_type: string | null
          id: string
          is_required: boolean | null
          keywords: string[] | null
          subcategory: string | null
          template_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          customizable_fields?: Json | null
          description?: string | null
          file_type?: string | null
          id?: string
          is_required?: boolean | null
          keywords?: string[] | null
          subcategory?: string | null
          template_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          customizable_fields?: Json | null
          description?: string | null
          file_type?: string | null
          id?: string
          is_required?: boolean | null
          keywords?: string[] | null
          subcategory?: string | null
          template_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      guidance_sections: {
        Row: {
          color_theme: string | null
          created_at: string
          deadline_days: number | null
          description: string | null
          emoji: string | null
          estimated_time_minutes: number | null
          icon: string | null
          id: number
          order_number: number
          priority_order: number | null
          title: string
        }
        Insert: {
          color_theme?: string | null
          created_at?: string
          deadline_days?: number | null
          description?: string | null
          emoji?: string | null
          estimated_time_minutes?: number | null
          icon?: string | null
          id?: number
          order_number: number
          priority_order?: number | null
          title: string
        }
        Update: {
          color_theme?: string | null
          created_at?: string
          deadline_days?: number | null
          description?: string | null
          emoji?: string | null
          estimated_time_minutes?: number | null
          icon?: string | null
          id?: number
          order_number?: number
          priority_order?: number | null
          title?: string
        }
        Relationships: []
      }
      guidance_step_documents: {
        Row: {
          context: string | null
          created_at: string | null
          display_order: number | null
          document_id: string | null
          guidance_step_id: number | null
          id: string
          is_primary: boolean | null
        }
        Insert: {
          context?: string | null
          created_at?: string | null
          display_order?: number | null
          document_id?: string | null
          guidance_step_id?: number | null
          id?: string
          is_primary?: boolean | null
        }
        Update: {
          context?: string | null
          created_at?: string | null
          display_order?: number | null
          document_id?: string | null
          guidance_step_id?: number | null
          id?: string
          is_primary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "guidance_step_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guidance_step_documents_guidance_step_id_fkey"
            columns: ["guidance_step_id"]
            isOneToOne: false
            referencedRelation: "guidance_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      guidance_steps: {
        Row: {
          content: string | null
          created_at: string
          deadline_info: string | null
          difficulty_level: string | null
          estimated_time_minutes: number | null
          external_links: Json | null
          id: number
          order_number: number
          prerequisites: string[] | null
          quick_win: boolean | null
          rich_content: Json | null
          section_id: number | null
          step_type: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          deadline_info?: string | null
          difficulty_level?: string | null
          estimated_time_minutes?: number | null
          external_links?: Json | null
          id?: number
          order_number: number
          prerequisites?: string[] | null
          quick_win?: boolean | null
          rich_content?: Json | null
          section_id?: number | null
          step_type?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          deadline_info?: string | null
          difficulty_level?: string | null
          estimated_time_minutes?: number | null
          external_links?: Json | null
          id?: number
          order_number?: number
          prerequisites?: string[] | null
          quick_win?: boolean | null
          rich_content?: Json | null
          section_id?: number | null
          step_type?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guidance_steps_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "guidance_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          plan_type: string
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          plan_type: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          plan_type?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_type: string | null
          company_name: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          purchase_date: string | null
          purchased_plan: string | null
          updated_at: string
        }
        Insert: {
          business_type?: string | null
          company_name?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          purchase_date?: string | null
          purchased_plan?: string | null
          updated_at?: string
        }
        Update: {
          business_type?: string | null
          company_name?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          purchase_date?: string | null
          purchased_plan?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      step_time_tracking: {
        Row: {
          completed_at: string | null
          id: string
          step_id: number | null
          time_spent_seconds: number
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          step_id?: number | null
          time_spent_seconds: number
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          step_id?: number | null
          time_spent_seconds?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "step_time_tracking_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "guidance_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      step_tips: {
        Row: {
          content: string
          display_order: number | null
          id: string
          step_id: number | null
          tip_type: string
        }
        Insert: {
          content: string
          display_order?: number | null
          id?: string
          step_id?: number | null
          tip_type: string
        }
        Update: {
          content?: string
          display_order?: number | null
          id?: string
          step_id?: number | null
          tip_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "step_tips_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "guidance_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achieved_at: string | null
          achievement_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          achieved_at?: string | null
          achievement_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          achieved_at?: string | null
          achievement_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_document_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          customized: boolean | null
          document_id: string | null
          downloaded: boolean | null
          id: string
          user_id: string
          viewed: boolean | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          customized?: boolean | null
          document_id?: string | null
          downloaded?: boolean | null
          id?: string
          user_id: string
          viewed?: boolean | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          customized?: boolean | null
          document_id?: string | null
          downloaded?: boolean | null
          id?: string
          user_id?: string
          viewed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_document_progress_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      user_documents: {
        Row: {
          created_at: string | null
          customized_data: Json | null
          document_id: string | null
          file_url: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customized_data?: Json | null
          document_id?: string | null
          file_url?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          customized_data?: Json | null
          document_id?: string | null
          file_url?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      user_guidance_progress: {
        Row: {
          completed: boolean | null
          created_at: string
          id: string
          last_visited_at: string
          section_completed: boolean | null
          section_id: number | null
          step_id: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          id?: string
          last_visited_at?: string
          section_completed?: boolean | null
          section_id?: number | null
          step_id?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          id?: string
          last_visited_at?: string
          section_completed?: boolean | null
          section_id?: number | null
          step_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_guidance_progress_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "guidance_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_guidance_progress_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "guidance_steps"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_smart_recommendations: {
        Args: {
          p_user_id: string
          p_company_age_days: number
          p_completed_steps: number[]
          p_current_category: string
        }
        Returns: {
          step_id: number
          section_id: number
          title: string
          estimated_time_minutes: number
          difficulty_level: string
          deadline_days: number
          quick_win: boolean
          prerequisites_met: boolean
          category: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
