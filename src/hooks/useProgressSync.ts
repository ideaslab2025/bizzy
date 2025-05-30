
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ProgressSyncOptions {
  onProgressUpdate?: (sectionId: number, progress: number) => void;
}

export const useProgressSync = ({ onProgressUpdate }: ProgressSyncOptions = {}) => {
  const { user } = useAuth();

  const syncProgress = useCallback(async (sectionId: number, stepId: number, completed: boolean) => {
    if (!user) return;

    try {
      // Update Supabase
      const { error } = await supabase
        .from('user_guidance_progress')
        .upsert({
          user_id: user.id,
          section_id: sectionId,
          step_id: stepId,
          completed,
          last_visited_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error syncing progress to Supabase:', error);
        return;
      }

      // Fetch updated section progress
      const { data: sectionSteps } = await supabase
        .from('guidance_steps')
        .select('id')
        .eq('section_id', sectionId);

      const { data: completedSteps } = await supabase
        .from('user_guidance_progress')
        .select('step_id')
        .eq('user_id', user.id)
        .eq('section_id', sectionId)
        .eq('completed', true);

      if (sectionSteps && completedSteps) {
        const progressPercentage = (completedSteps.length / sectionSteps.length) * 100;
        
        // Update localStorage
        localStorage.setItem(`bizzy_section_${sectionId}_progress`, progressPercentage.toString());
        
        if (progressPercentage >= 100) {
          localStorage.setItem(`bizzy_section_${sectionId}_complete`, 'true');
        }

        // Notify callback
        onProgressUpdate?.(sectionId, progressPercentage);
      }

    } catch (error) {
      console.error('Error in syncProgress:', error);
    }
  }, [user, onProgressUpdate]);

  const markSectionComplete = useCallback((sectionId: number) => {
    localStorage.setItem(`bizzy_section_${sectionId}_complete`, 'true');
    localStorage.setItem(`bizzy_section_${sectionId}_progress`, '100');
    onProgressUpdate?.(sectionId, 100);
  }, [onProgressUpdate]);

  return {
    syncProgress,
    markSectionComplete
  };
};
