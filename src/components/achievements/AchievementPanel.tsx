
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, Trophy, Star, Zap } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { cn } from '@/lib/utils';

interface AchievementPanelProps {
  userId: string;
  compact?: boolean;
}

export const AchievementPanel: React.FC<AchievementPanelProps> = ({
  userId,
  compact = false
}) => {
  const { 
    achievements, 
    availableAchievements, 
    totalPoints,
    isLoading,
    newAchievements,
    clearNewAchievements 
  } = useAchievements(userId);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Award className="w-4 h-4" />;
      case 'rare': return <Star className="w-4 h-4" />;
      case 'epic': return <Zap className="w-4 h-4" />;
      case 'legendary': return <Trophy className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-20 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="font-semibold text-yellow-800">
                  {totalPoints} Points
                </div>
                <div className="text-sm text-yellow-600">
                  {achievements.length} achievements unlocked
                </div>
              </div>
            </div>
            {achievements.length > 0 && (
              <div className="flex -space-x-1">
                {achievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="w-8 h-8 rounded-full bg-white border-2 border-yellow-300 flex items-center justify-center text-sm"
                    title={achievement.title}
                  >
                    {achievement.icon}
                  </div>
                ))}
                {achievements.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center text-xs font-medium text-yellow-700">
                    +{achievements.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* New Achievement Notifications */}
      <AnimatePresence>
        {newAchievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-4 right-4 z-50"
          >
            <Card className="border-yellow-300 bg-gradient-to-r from-yellow-100 to-orange-100 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <div className="font-bold text-yellow-800">
                      Achievement Unlocked!
                    </div>
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-yellow-600">
                      +{achievement.points} points
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearNewAchievements}
                    className="ml-auto"
                  >
                    ×
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Achievements Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Achievements
            <Badge variant="secondary" className="ml-auto">
              {achievements.length}/{availableAchievements.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600">
                {Math.round((achievements.length / availableAchievements.length) * 100)}%
              </span>
            </div>
            <Progress 
              value={(achievements.length / availableAchievements.length) * 100} 
              className="h-2"
            />
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{totalPoints}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableAchievements.map((achievement) => {
          const isUnlocked = achievements.some(a => a.id === achievement.id);
          const unlockedAchievement = achievements.find(a => a.id === achievement.id);

          return (
            <Card
              key={achievement.id}
              className={cn(
                "transition-all duration-200",
                isUnlocked 
                  ? "border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-md" 
                  : "border-gray-200 bg-gray-50 opacity-60"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "text-2xl w-12 h-12 rounded-full border-2 flex items-center justify-center",
                    isUnlocked ? "bg-white border-yellow-300" : "bg-gray-200 border-gray-300"
                  )}>
                    {isUnlocked ? achievement.icon : '🔒'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "font-medium",
                        isUnlocked ? "text-gray-900" : "text-gray-500"
                      )}>
                        {achievement.title}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getRarityColor(achievement.rarity))}
                      >
                        {getRarityIcon(achievement.rarity)}
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className={cn(
                      "text-sm mb-2",
                      isUnlocked ? "text-gray-600" : "text-gray-400"
                    )}>
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-sm font-medium",
                        isUnlocked ? "text-yellow-600" : "text-gray-400"
                      )}>
                        {achievement.points} points
                      </span>
                      {isUnlocked && unlockedAchievement && (
                        <span className="text-xs text-gray-500">
                          {new Date(unlockedAchievement.achievedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
