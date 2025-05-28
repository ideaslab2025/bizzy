
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { EnhancedGuidanceStep } from '@/types/guidance';

interface SmartRecommendation extends EnhancedGuidanceStep {
  section_title: string;
  category: string;
  prerequisites_met: boolean;
  urgency_score: number;
  deadline_days: number | null;
}

interface RecommendationCategories {
  urgent: SmartRecommendation[];
  quickWins: SmartRecommendation[];
  nextLogical: SmartRecommendation[];
  sameCategory: SmartRecommendation[];
}

export const useSmartRecommendations = (
  userId: string | undefined,
  completedStepIds: number[] = [],
  currentSectionCategory: string = '',
  companyAge: number = 0
) => {
  const [recommendations, setRecommendations] = useState<RecommendationCategories>({
    urgent: [],
    quickWins: [],
    nextLogical: [],
    sameCategory: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    
    fetchRecommendations();
  }, [userId, completedStepIds.length, currentSectionCategory, companyAge]);

  const fetchRecommendations = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Get smart recommendations using the database function
      const { data: rawRecommendations, error: dbError } = await supabase
        .rpc('get_smart_recommendations', {
          p_user_id: userId,
          p_company_age_days: companyAge,
          p_completed_steps: completedStepIds,
          p_current_category: currentSectionCategory
        });

      if (dbError) throw dbError;

      // Get section titles for context
      const { data: sectionsData } = await supabase
        .from('guidance_sections')
        .select('id, title, color_theme');

      const sectionsMap = new Map(
        sectionsData?.map(section => [section.id, section]) || []
      );

      // Enhance recommendations with additional context
      const enhancedRecommendations: SmartRecommendation[] = (rawRecommendations || []).map(rec => {
        const section = sectionsMap.get(rec.section_id);
        
        // Calculate urgency score based on multiple factors
        let urgencyScore = 0;
        if (rec.deadline_days && rec.deadline_days <= 7) urgencyScore += 50;
        if (rec.quick_win) urgencyScore += 30;
        if (rec.prerequisites_met) urgencyScore += 20;
        if (rec.difficulty_level === 'easy') urgencyScore += 15;
        if (rec.category === currentSectionCategory) urgencyScore += 10;

        return {
          id: rec.step_id,
          section_id: rec.section_id,
          title: rec.title,
          section_title: section?.title || 'Unknown Section',
          category: section?.color_theme || rec.category,
          urgency_score: urgencyScore,
          deadline_days: rec.deadline_days,
          prerequisites_met: rec.prerequisites_met,
          // Type assertions for proper typing
          difficulty_level: rec.difficulty_level as 'easy' | 'medium' | 'complex' | null,
          step_type: 'action' as 'action' | 'information' | 'decision' | 'external' | null,
          estimated_time_minutes: rec.estimated_time_minutes || 15,
          external_links: [],
          rich_content: null,
          prerequisites: null,
          deadline_info: null,
          quick_win: rec.quick_win || false,
          created_at: new Date().toISOString(),
          content: '',
          video_url: null,
          order_number: 1
        };
      });

      // Categorize recommendations
      const categorized: RecommendationCategories = {
        urgent: enhancedRecommendations.filter(r => 
          r.deadline_days !== null && r.deadline_days <= 7
        ).slice(0, 3),
        
        quickWins: enhancedRecommendations.filter(r => 
          r.quick_win && 
          r.difficulty_level === 'easy' && 
          (r.estimated_time_minutes || 0) <= 15
        ).slice(0, 5),
        
        nextLogical: enhancedRecommendations.filter(r => 
          r.prerequisites_met
        ).slice(0, 4),
        
        sameCategory: enhancedRecommendations.filter(r => 
          r.category === currentSectionCategory
        ).slice(0, 3)
      };

      setRecommendations(categorized);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
      console.error('Error fetching smart recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTopRecommendations = (limit: number = 3): SmartRecommendation[] => {
    const allRecommendations = [
      ...recommendations.urgent,
      ...recommendations.quickWins,
      ...recommendations.nextLogical,
      ...recommendations.sameCategory
    ];

    // Remove duplicates and sort by urgency score
    const uniqueRecommendations = Array.from(
      new Map(allRecommendations.map(rec => [rec.id, rec])).values()
    ).sort((a, b) => b.urgency_score - a.urgency_score);

    return uniqueRecommendations.slice(0, limit);
  };

  return {
    recommendations,
    isLoading,
    error,
    getTopRecommendations,
    refetch: fetchRecommendations
  };
};
