import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserProgress {
  section_id: number;
  step_id: number;
  completed: boolean;
  section_completed: boolean;
}

interface SectionProgress {
  sectionId: number;
  totalSteps: number;
  completedSteps: number;
  progress: number;
  isCompleted: boolean;
}

export const useGuidanceProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [sectionProgress, setSectionProgress] = useState<Record<number, SectionProgress>>({});
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch all sections and steps
      const { data: sections } = await supabase
        .from('guidance_sections')
        .select('*')
        .order('order_number');

      const { data: allSteps } = await supabase
        .from('guidance_steps')
        .select('*')
        .order('section_id, order_number');

      // Fetch user progress
      const { data: userProgress } = await supabase
        .from('user_guidance_progress')
        .select('section_id, step_id, completed, section_completed, last_visited_at')
        .eq('user_id', user.id)
        .order('last_visited_at', { ascending: false });

      if (userProgress && sections && allSteps) {
        // Remove duplicates and keep latest progress
        const uniqueProgress = userProgress.reduce((acc, item) => {
          const key = `${item.section_id}-${item.step_id}`;
          if (!acc[key]) {
            acc[key] = item;
          }
          return acc;
        }, {} as Record<string, typeof userProgress[0]>);
        
        const progressArray = Object.values(uniqueProgress);
        setProgress(progressArray);
        
        // Update completed sections
        const completedSectionIds = progressArray
          .filter(item => item.section_completed)
          .map(item => item.section_id);
        setCompletedSections(new Set(completedSectionIds));
        
        // Update completed steps
        const completedStepIds = progressArray
          .filter(item => item.completed === true)
          .map(item => item.step_id);
        setCompletedSteps(new Set(completedStepIds));

        // Calculate section progress
        const sectionProgressMap: Record<number, SectionProgress> = {};
        sections.forEach(section => {
          const sectionSteps = allSteps.filter(step => step.section_id === section.id);
          const sectionCompletedSteps = sectionSteps.filter(step => 
            completedStepIds.includes(step.id)
          );
          
          sectionProgressMap[section.id] = {
            sectionId: section.id,
            totalSteps: sectionSteps.length,
            completedSteps: sectionCompletedSteps.length,
            progress: sectionSteps.length > 0 ? (sectionCompletedSteps.length / sectionSteps.length) * 100 : 0,
            isCompleted: completedSectionIds.includes(section.id)
          };
        });
        
        setSectionProgress(sectionProgressMap);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSectionCompleted = async (sectionId: number) => {
    if (!user) return;
    
    const isNowCompleted = !completedSections.has(sectionId);
    
    try {
      // Get all steps for this section
      const { data: sectionSteps, error } = await supabase
        .from('guidance_steps')
        .select('id')
        .eq('section_id', sectionId);
      
      if (error || !sectionSteps) return;
      
      // Update progress for all steps in section
      for (const step of sectionSteps) {
        const { data: existingProgress } = await supabase
          .from('user_guidance_progress')
          .select('id')
          .eq('user_id', user.id)
          .eq('section_id', sectionId)
          .eq('step_id', step.id)
          .single();

        if (existingProgress) {
          await supabase
            .from('user_guidance_progress')
            .update({
              completed: isNowCompleted,
              section_completed: isNowCompleted,
              last_visited_at: new Date().toISOString()
            })
            .eq('id', existingProgress.id);
        } else {
          await supabase
            .from('user_guidance_progress')
            .insert({
              user_id: user.id,
              section_id: sectionId,
              step_id: step.id,
              completed: isNowCompleted,
              section_completed: isNowCompleted,
              last_visited_at: new Date().toISOString()
            });
        }
      }
      
      // Update local state
      setCompletedSections(prev => {
        const next = new Set(prev);
        if (isNowCompleted) {
          next.add(sectionId);
        } else {
          next.delete(sectionId);
        }
        return next;
      });
      
      setCompletedSteps(prev => {
        const next = new Set(prev);
        if (isNowCompleted) {
          sectionSteps.forEach(step => next.add(step.id));
        } else {
          sectionSteps.forEach(step => next.delete(step.id));
        }
        return next;
      });

      // Update section progress
      setSectionProgress(prev => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          completedSteps: isNowCompleted ? prev[sectionId]?.totalSteps || 0 : 0,
          progress: isNowCompleted ? 100 : 0,
          isCompleted: isNowCompleted
        }
      }));
      
    } catch (error) {
      console.error('Error toggling section completion:', error);
    }
  };

  const getOverallProgress = () => {
    const totalSteps = Object.values(sectionProgress).reduce((sum, section) => sum + section.totalSteps, 0);
    const completedStepsTotal = Object.values(sectionProgress).reduce((sum, section) => sum + section.completedSteps, 0);
    return totalSteps > 0 ? (completedStepsTotal / totalSteps) * 100 : 0;
  };

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  return {
    progress,
    completedSections,
    completedSteps,
    sectionProgress,
    loading,
    toggleSectionCompleted,
    getOverallProgress,
    refetch: fetchProgress
  };
};
