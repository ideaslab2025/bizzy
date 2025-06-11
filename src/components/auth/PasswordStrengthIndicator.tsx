
import React from 'react';
import { Check, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const basicRequirements: PasswordRequirement[] = [
    {
      label: 'At least 8 characters',
      test: (pwd) => pwd.length >= 8,
      met: password.length >= 8
    },
    {
      label: 'At least one uppercase letter',
      test: (pwd) => /[A-Z]/.test(pwd),
      met: /[A-Z]/.test(password)
    },
    {
      label: 'At least one lowercase letter',
      test: (pwd) => /[a-z]/.test(pwd),
      met: /[a-z]/.test(password)
    },
    {
      label: 'At least one number',
      test: (pwd) => /\d/.test(pwd),
      met: /\d/.test(password)
    },
    {
      label: 'At least one special character',
      test: (pwd) => /[^A-Za-z0-9]/.test(pwd),
      met: /[^A-Za-z0-9]/.test(password)
    }
  ];

  const advancedRequirements: PasswordRequirement[] = [
    {
      label: 'At least 12 characters',
      test: (pwd) => pwd.length >= 12,
      met: password.length >= 12
    },
    {
      label: 'Multiple special characters',
      test: (pwd) => (pwd.match(/[^A-Za-z0-9]/g) || []).length >= 2,
      met: (password.match(/[^A-Za-z0-9]/g) || []).length >= 2
    },
    {
      label: 'Mix of numbers and symbols',
      test: (pwd) => /\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd),
      met: /\d/.test(password) && /[^A-Za-z0-9]/.test(password)
    }
  ];

  // Simple check for common patterns - basic implementation
  const hasCommonPatterns = (pwd: string): boolean => {
    const commonPatterns = [
      /123/,
      /abc/i,
      /password/i,
      /qwerty/i,
      /admin/i,
      /(.)\1{2,}/, // repeated characters
    ];
    return commonPatterns.some(pattern => pattern.test(pwd));
  };

  const noCommonPatternsRequirement: PasswordRequirement = {
    label: 'No common patterns',
    test: (pwd) => !hasCommonPatterns(pwd),
    met: !hasCommonPatterns(password)
  };

  const allRequirements = [...basicRequirements, ...advancedRequirements, noCommonPatternsRequirement];

  const calculateStrength = (): { strength: number; level: string; color: string; textColor: string } => {
    const basicMet = basicRequirements.filter(req => req.met).length;
    const advancedMet = advancedRequirements.filter(req => req.met).length;
    const noPatterns = noCommonPatternsRequirement.met;

    // Calculate percentage based on all requirements
    const totalRequirements = allRequirements.length;
    const metRequirements = allRequirements.filter(req => req.met).length;
    const strengthPercentage = (metRequirements / totalRequirements) * 100;

    // Determine strength level based on requirements met
    if (basicMet < 3) {
      return { 
        strength: Math.min(strengthPercentage, 25), 
        level: 'Weak', 
        color: 'bg-red-500',
        textColor: 'text-red-600'
      };
    } else if (basicMet < 5) {
      return { 
        strength: Math.min(strengthPercentage, 45), 
        level: 'Medium', 
        color: 'bg-orange-500',
        textColor: 'text-orange-600'
      };
    } else if (basicMet === 5 && advancedMet < 2) {
      return { 
        strength: Math.min(strengthPercentage, 65), 
        level: 'Good', 
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600'
      };
    } else if (basicMet === 5 && advancedMet >= 2 && !noPatterns) {
      return { 
        strength: Math.min(strengthPercentage, 85), 
        level: 'Strong', 
        color: 'bg-green-500',
        textColor: 'text-green-600'
      };
    } else {
      return { 
        strength: strengthPercentage, 
        level: 'Very Strong', 
        color: 'bg-green-700',
        textColor: 'text-green-700'
      };
    }
  };

  const { strength, level, color, textColor } = calculateStrength();

  if (!password) {
    return null;
  }

  return (
    <div className="mt-3 space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Password Strength</span>
          <span className={`text-sm font-medium transition-colors duration-500 ease-in-out ${textColor}`}>
            {level}
          </span>
        </div>
        
        <div className="relative">
          <Progress value={strength} className="h-2" />
          <div 
            className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-500 ease-in-out ${color}`}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-gray-700">Requirements:</span>
        <div className="space-y-1">
          {allRequirements.map((requirement, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 text-sm transition-all duration-400 ease-in-out ${
                requirement.met ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <div className={`flex items-center justify-center w-4 h-4 rounded-full transition-all duration-400 ease-in-out ${
                requirement.met 
                  ? 'bg-green-500 text-white scale-100' 
                  : 'bg-gray-200 text-gray-400 scale-95'
              }`}>
                {requirement.met ? (
                  <Check className="w-2.5 h-2.5 transition-all duration-300 ease-in-out" />
                ) : (
                  <X className="w-2.5 h-2.5 transition-all duration-300 ease-in-out" />
                )}
              </div>
              <span className={`transition-all duration-400 ease-in-out ${
                requirement.met ? 'font-medium' : 'font-normal'
              }`}>
                {requirement.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
