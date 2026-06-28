export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          display_name: string | null;
          goal: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          display_name?: string | null;
          goal?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          display_name?: string | null;
          goal?: string | null;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          completed_at: string;
          program_id: string | null;
          week: number | null;
          day: number | null;
          exercise_type: string;
          hold_duration: number;
          rest_duration: number;
          reps: number;
          sets: number;
          sets_completed: number;
          total_squeeze_seconds: number;
          rating: string | null;
          synced_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          completed_at: string;
          program_id?: string | null;
          week?: number | null;
          day?: number | null;
          exercise_type: string;
          hold_duration: number;
          rest_duration: number;
          reps: number;
          sets: number;
          sets_completed: number;
          total_squeeze_seconds: number;
          rating?: string | null;
          synced_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['sessions']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
