
import type { Json } from "@/integrations/supabase/types";

export interface EnhancedGuidanceSection {
  id: number;
  title: string;
  description: string;
  order_number: number;
  icon: string;
  emoji?: string;
  estimated_time_minutes?: number;
  priority_order?: number;
  deadline_days?: number;
  color_theme?: string;
  created_at: string;
}

export interface EnhancedGuidanceStep {
  id: number;
  section_id: number;
  title: string;
  content: string;
  video_url?: string;
  external_links: Json;
  order_number: number;
  estimated_time_minutes?: number;
  difficulty_level?: 'easy' | 'medium' | 'complex' | null;
  step_type?: 'action' | 'information' | 'decision' | 'external' | null;
  rich_content?: Json;
  prerequisites?: string[] | null;
  deadline_info?: string;
  quick_win?: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achieved_at: string;
}

export interface StepTimeTracking {
  id: string;
  user_id: string;
  step_id: number;
  time_spent_seconds: number;
  completed_at: string;
}

export interface StepTip {
  id: string;
  step_id: number;
  tip_type: string;
  content: string;
  display_order: number;
}

export interface RichContentBlock {
  type: 'text' | 'checklist' | 'alert' | 'tip' | 'documents' | 'action_button';
  content?: string;
  title?: string;
  variant?: string;
  items?: Array<{
    id: string;
    label: string;
    helpText?: string;
    completed?: boolean;
  }>;
  documents?: string[];
  label?: string;
  action?: {
    type: string;
    url: string;
  };
}
