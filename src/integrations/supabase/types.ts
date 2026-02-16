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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_icon: string | null
          description: string | null
          earned_at: string
          id: string
          name: string
          user_id: string
          xp_points: number | null
        }
        Insert: {
          badge_icon?: string | null
          description?: string | null
          earned_at?: string
          id?: string
          name: string
          user_id: string
          xp_points?: number | null
        }
        Update: {
          badge_icon?: string | null
          description?: string | null
          earned_at?: string
          id?: string
          name?: string
          user_id?: string
          xp_points?: number | null
        }
        Relationships: []
      }
      admin_activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          content: string
          created_at: string
          id: string
          is_published: boolean | null
          priority: string | null
          title: string
          type: string | null
          views_count: number | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_published?: boolean | null
          priority?: string | null
          title: string
          type?: string | null
          views_count?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean | null
          priority?: string | null
          title?: string
          type?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      assignment_submissions: {
        Row: {
          assignment_id: string
          feedback: string | null
          file_url: string | null
          github_url: string | null
          grade: string | null
          graded_at: string | null
          id: string
          live_demo_url: string | null
          notes: string | null
          score: number | null
          status: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          assignment_id: string
          feedback?: string | null
          file_url?: string | null
          github_url?: string | null
          grade?: string | null
          graded_at?: string | null
          id?: string
          live_demo_url?: string | null
          notes?: string | null
          score?: number | null
          status?: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          assignment_id?: string
          feedback?: string | null
          file_url?: string | null
          github_url?: string | null
          grade?: string | null
          graded_at?: string | null
          id?: string
          live_demo_url?: string | null
          notes?: string | null
          score?: number | null
          status?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          max_points: number | null
          module_id: string | null
          pass_mark: number | null
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          max_points?: number | null
          module_id?: string | null
          pass_mark?: number | null
          status?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          max_points?: number | null
          module_id?: string | null
          pass_mark?: number | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          file_url: string | null
          id: string
          issued_at: string
          name: string
          type: string | null
          user_id: string
        }
        Insert: {
          file_url?: string | null
          id?: string
          issued_at?: string
          name: string
          type?: string | null
          user_id: string
        }
        Update: {
          file_url?: string | null
          id?: string
          issued_at?: string
          name?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          category: string | null
          comments_count: number | null
          content: string
          created_at: string
          id: string
          is_pinned: boolean | null
          is_solved: boolean | null
          likes_count: number | null
          title: string | null
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          is_solved?: boolean | null
          likes_count?: number | null
          title?: string | null
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean | null
          is_solved?: boolean | null
          likes_count?: number | null
          title?: string | null
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          event_id: string
          id: string
          registered_at: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          banner_url: string | null
          created_at: string
          description: string | null
          event_date: string
          id: string
          max_attendees: number | null
          meeting_url: string | null
          platform: string | null
          title: string
          type: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          max_attendees?: number | null
          meeting_url?: string | null
          platform?: string | null
          title: string
          type?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          max_attendees?: number | null
          meeting_url?: string | null
          platform?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: string | null
          created_at: string
          duration_seconds: number | null
          id: string
          is_free: boolean | null
          module_id: string
          order_index: number
          status: string
          title: string
          type: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          is_free?: boolean | null
          module_id: string
          order_index?: number
          status?: string
          title: string
          type?: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          is_free?: boolean | null
          module_id?: string
          order_index?: number
          status?: string
          title?: string
          type?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          order_index: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          order_index?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          order_index?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_best_answer: boolean | null
          parent_id: string | null
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_best_answer?: boolean | null
          parent_id?: string | null
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_best_answer?: boolean | null
          parent_id?: string | null
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          phone: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      qa_answers: {
        Row: {
          content: string
          created_at: string
          helpful_count: number | null
          id: string
          is_best_answer: boolean | null
          question_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_best_answer?: boolean | null
          question_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_best_answer?: boolean | null
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qa_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "qa_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      qa_questions: {
        Row: {
          content: string
          created_at: string
          id: string
          is_bookmarked: boolean | null
          status: string | null
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_bookmarked?: boolean | null
          status?: string | null
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_bookmarked?: boolean | null
          status?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string
          helpful_count: number | null
          id: string
          is_published: boolean | null
          rating: number
          title: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_published?: boolean | null
          rating: number
          title?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          is_published?: boolean | null
          rating?: number
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tools_gifts: {
        Row: {
          access_type: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          status: string | null
          url: string | null
          value_bdt: number | null
        }
        Insert: {
          access_type?: string | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          status?: string | null
          url?: string | null
          value_bdt?: number | null
        }
        Update: {
          access_type?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          status?: string | null
          url?: string | null
          value_bdt?: number | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_bdt: number
          created_at: string
          gateway_id: string | null
          id: string
          payment_method: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount_bdt: number
          created_at?: string
          gateway_id?: string | null
          id?: string
          payment_method?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount_bdt?: number
          created_at?: string
          gateway_id?: string | null
          id?: string
          payment_method?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          id: string
          last_position_seconds: number | null
          lesson_id: string
          progress_percent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          last_position_seconds?: number | null
          lesson_id: string
          progress_percent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          id?: string
          last_position_seconds?: number | null
          lesson_id?: string
          progress_percent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
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
      app_role: "student" | "admin" | "super_admin"
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
      app_role: ["student", "admin", "super_admin"],
    },
  },
} as const
