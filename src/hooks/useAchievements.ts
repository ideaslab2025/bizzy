
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  criteria: any;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserAchievementWithDetails extends Achievement {
  achievedAt: string;
  isNew?: boolean;
}

export const useAchievements = (userId: string | undefined) => {
  const [achievements, setAchievements] = useState<UserAchievementWithDetails[]>([]);
  const [availableAchievements, setAvailableAchievements] = useState<Achievement[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  // Predefined achievements
  const predefinedAchievements: Achievement[] = [
    {
      id: 'first_step',
      type: 'milestone',
      title: 'Getting Started',
      description: 'Complete your first step',
      icon: '🎯',
      criteria: { stepsCompleted: 1 },
      points: 10,
      rarity: 'common'
    },
    {
      id: 'first_section',
      type: 'milestone',
      title: 'Section Master',
      description: 'Complete your first section',
      icon: '📚',
      criteria: { sectionsCompleted: 1 },
      points: 50,
      rarity: 'common'
    },
    {
      id: 'speed_demon',
      type: 'performance',
      title: 'Speed Demon',
      description: 'Complete 5 steps in one day',
      icon: '⚡',
      criteria: { stepsInOneDay: 5 },
      points: 75,
      rarity: 'rare'
    },
    {
      id: 'consistency_king',
      type: 'streak',
      title: 'Consistency King',
      description: 'Maintain a 7-day streak',
      icon: '👑',
      criteria: { streakDays: 7 },
      points: 100,
      rarity: 'epic'
    },
    {
      id: 'completionist',
      type: 'milestone',
      title: 'Completionist',
      description: 'Complete all sections',
      icon: '🏆',
      criteria: { completionRate: 100 },
      points: 500,
      rarity: 'legendary'
    },
    {
      id: 'quick_wins',
      type: 'category',
      title: 'Quick Win Champion',
      description: 'Complete 10 quick win tasks',
      icon: '💨',
      criteria: { quickWinsCompleted: 10 },
      points: 80,
      rarity: 'rare'
    },
    {
      id: 'time_saver',
      type: 'performance',
      title: 'Time Saver',
      description: 'Complete steps faster than average',
      icon: '⏰',
      criteria: { averageTimeBelowTarget: true },
      points: 60,
      rarity: 'rare'
    }
  ];

  useEffect(() => {
    if (!userId) return;
    fetchAchievements();
    setAvailableAchievements(predefinedAchievements);
  }, [userId]);

  const fetchAchievements = async () => {
    if (!userId) return;
    
    setIsLoading(true);

    try {
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_type, achieved_at')
        .eq('user_id', userId);

      if (userAchievements) {
        const achievementsWithDetails = userAchievements.map(ua => {
          const achievement = predefinedAchievements.find(a => a.type === ua.achievement_type);
          return {
            ...achievement!,
            achievedAt: ua.achieved_at
          };
        }).filter(Boolean);

        setAchievements(achievementsWithDetails);
        setTotalPoints(achievementsWithDetails.reduce((sum, a) => sum + a.points, 0));
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAndUnlockAchievements = async (progressData: {
    stepsCompleted: number;
    sectionsCompleted: number;
    streakDays: number;
    completionRate: number;
    quickWinsCompleted: number;
    stepsCompletedToday: number;
    averageTimePerStep: number;
  }) => {
    if (!userId) return;

    const unlockedAchievements: Achievement[] = [];

    for (const achievement of predefinedAchievements) {
      // Check if already unlocked
      const alreadyUnlocked = achievements.some(a => a.id === achievement.id);
      if (alreadyUnlocked) continue;

      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_step':
          shouldUnlock = progressData.stepsCompleted >= 1;
          break;
        case 'first_section':
          shouldUnlock = progressData.sectionsCompleted >= 1;
          break;
        case 'speed_demon':
          shouldUnlock = progressData.stepsCompletedToday >= 5;
          break;
        case 'consistency_king':
          shouldUnlock = progressData.streakDays >= 7;
          break;
        case 'completionist':
          shouldUnlock = progressData.completionRate >= 100;
          break;
        case 'quick_wins':
          shouldUnlock = progressData.quickWinsCompleted >= 10;
          break;
        case 'time_saver':
          shouldUnlock = progressData.averageTimePerStep < 900; // Less than 15 minutes
          break;
      }

      if (shouldUnlock) {
        // Save to database
        await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_type: achievement.type,
            achieved_at: new Date().toISOString()
          });

        unlockedAchievements.push(achievement);
      }
    }

    if (unlockedAchievements.length > 0) {
      setNewAchievements(unlockedAchievements);
      fetchAchievements(); // Refresh achievements
    }

    return unlockedAchievements;
  };

  const clearNewAchievements = () => {
    setNewAchievements([]);
  };

  return {
    achievements,
    availableAchievements,
    totalPoints,
    isLoading,
    newAchievements,
    checkAndUnlockAchievements,
    clearNewAchievements
  };
};
