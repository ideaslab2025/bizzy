
import { useState, useEffect } from 'react';

export interface SectionProgress {
  completed: number;
  total: number;
  percentage: number;
  name: string;
  description: string;
  nextAction?: string;
}

export interface ProgressData {
  overallCompletion: number;
  sections: {
    foundations: SectionProgress;
    tax: SectionProgress;
    legal: SectionProgress;
    hr: SectionProgress;
    financial: SectionProgress;
    compliance: SectionProgress;
  };
  totalCompleted: number;
  totalItems: number;
  estimatedTimeRemaining: number;
}

const initialProgressData: ProgressData = {
  overallCompletion: 0,
  sections: {
    foundations: {
      completed: 3,
      total: 5,
      percentage: 60,
      name: "Company Foundations",
      description: "UTR, bank account, statutory registers",
      nextAction: "Set up statutory registers"
    },
    tax: {
      completed: 1,
      total: 4,
      percentage: 25,
      name: "Tax Registration",
      description: "Corporation Tax, VAT, PAYE",
      nextAction: "Register for Corporation Tax"
    },
    legal: {
      completed: 2,
      total: 6,
      percentage: 33,
      name: "Legal Compliance",
      description: "Insurance, data protection, licenses",
      nextAction: "Set up business insurance"
    },
    hr: {
      completed: 0,
      total: 5,
      percentage: 0,
      name: "HR & Employment",
      description: "Policies, payroll, pension setup",
      nextAction: "Create employment policies"
    },
    financial: {
      completed: 1,
      total: 4,
      percentage: 25,
      name: "Financial Management",
      description: "Accounting software, processes",
      nextAction: "Set up accounting software"
    },
    compliance: {
      completed: 0,
      total: 3,
      percentage: 0,
      name: "Ongoing Compliance",
      description: "Filing requirements, deadlines",
      nextAction: "Set up compliance calendar"
    }
  },
  totalCompleted: 7,
  totalItems: 27,
  estimatedTimeRemaining: 120 // minutes
};

export const useProgressTracking = () => {
  const [progressData, setProgressData] = useState<ProgressData>(initialProgressData);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('bizzy_progress_data');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setProgressData(parsed);
      } catch (error) {
        console.error('Error loading progress data:', error);
      }
    } else {
      // Calculate initial progress and save to localStorage
      const calculated = calculateProgress(initialProgressData);
      setProgressData(calculated);
      localStorage.setItem('bizzy_progress_data', JSON.stringify(calculated));
    }
  }, []);

  const calculateProgress = (data: ProgressData): ProgressData => {
    const sections = Object.values(data.sections);
    const totalCompleted = sections.reduce((sum, section) => sum + section.completed, 0);
    const totalItems = sections.reduce((sum, section) => sum + section.total, 0);
    const overallCompletion = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;
    
    // Calculate section percentages
    const updatedSections = { ...data.sections };
    Object.keys(updatedSections).forEach(key => {
      const section = updatedSections[key as keyof typeof updatedSections];
      section.percentage = section.total > 0 ? Math.round((section.completed / section.total) * 100) : 0;
    });

    // Estimate time remaining (15 minutes per remaining item)
    const remainingItems = totalItems - totalCompleted;
    const estimatedTimeRemaining = remainingItems * 15;

    return {
      ...data,
      sections: updatedSections,
      overallCompletion,
      totalCompleted,
      totalItems,
      estimatedTimeRemaining
    };
  };

  const updateSectionProgress = (sectionKey: keyof ProgressData['sections'], completed: number) => {
    const newData = { ...progressData };
    newData.sections[sectionKey].completed = Math.max(0, Math.min(completed, newData.sections[sectionKey].total));
    
    const calculatedData = calculateProgress(newData);
    setProgressData(calculatedData);
    localStorage.setItem('bizzy_progress_data', JSON.stringify(calculatedData));
    
    return calculatedData;
  };

  const getNextRecommendedSection = (): { key: string; section: SectionProgress } | null => {
    const sections = Object.entries(progressData.sections);
    
    // Find first incomplete section with some progress
    for (const [key, section] of sections) {
      if (section.percentage > 0 && section.percentage < 100) {
        return { key, section };
      }
    }
    
    // Find first section with no progress
    for (const [key, section] of sections) {
      if (section.percentage === 0) {
        return { key, section };
      }
    }
    
    return null;
  };

  return {
    progressData,
    updateSectionProgress,
    getNextRecommendedSection
  };
};
