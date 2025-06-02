
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedGuidanceSection, EnhancedGuidanceStep } from '@/types/guidance';

export const useLiveGuidanceContent = () => {
  const [sections, setSections] = useState<EnhancedGuidanceSection[]>([]);
  const [steps, setSteps] = useState<EnhancedGuidanceStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGuidanceContent = async () => {
    try {
      setLoading(true);
      
      // Fetch guidance sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('guidance_sections')
        .select('*')
        .order('priority_order', { ascending: true })
        .limit(4); // Limit for demo display

      if (sectionsError) throw sectionsError;

      // Fetch guidance steps for demo sections
      const { data: stepsData, error: stepsError } = await supabase
        .from('guidance_steps')
        .select('*')
        .in('section_id', sectionsData?.map(s => s.id) || [])
        .order('order_number', { ascending: true })
        .limit(12); // Limit total steps for demo

      if (stepsError) throw stepsError;

      setSections(sectionsData || []);
      setSteps(stepsData || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching guidance content:', err);
      setError('Failed to load guidance content');
    } finally {
      setLoading(false);
    }
  };

  const getDemoGuidanceData = () => {
    if (!sections.length || !steps.length) return null;

    const currentSection = sections[0];
    const sectionSteps = steps.filter(step => step.section_id === currentSection.id).slice(0, 3);

    return {
      currentStep: sectionSteps[0]?.title || 'Getting Started',
      progress: Math.floor(Math.random() * 40) + 30, // Demo progress
      totalSteps: currentSection.estimated_time_minutes ? Math.ceil(currentSection.estimated_time_minutes / 15) : 8,
      nextDeadline: getNextDeadline(currentSection.deadline_days),
      sectionTitle: currentSection.title,
      steps: sectionSteps.map(step => ({
        title: step.title,
        completed: Math.random() > 0.6,
        difficulty: step.difficulty_level
      }))
    };
  };

  const getNextDeadline = (deadlineDays?: number) => {
    if (!deadlineDays) return '2025-02-15';
    
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + deadlineDays);
    return deadline.toISOString().split('T')[0];
  };

  useEffect(() => {
    fetchGuidanceContent();
  }, []);

  return {
    sections,
    steps,
    loading,
    error,
    demoData: getDemoGuidanceData(),
    refreshContent: fetchGuidanceContent
  };
};
