
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
  const requirements: PasswordRequirement[] = [
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

  const calculateStrength = (): { strength: number; level: string; color: string } => {
    const metRequirements = requirements.filter(req => req.met).length;
    const strengthPercentage = (metRequirements / requirements.length) * 100;

    if (strengthPercentage < 40) {
      return { strength: strengthPercentage, level: 'Weak', color: 'bg-red-500' };
    } else if (strengthPercentage < 80) {
      return { strength: strengthPercentage, level: 'Medium', color: 'bg-amber-500' };
    } else {
      return { strength: strengthPercentage, level: 'Strong', color: 'bg-green-500' };
    }
  };

  const { strength, level, color } = calculateStrength();

  if (!password) {
    return null;
  }

  return (
    <div className="mt-3 space-y-3">
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Password Strength</span>
          <span className={`text-sm font-medium transition-colors duration-200 ${
            level === 'Weak' ? 'text-red-600' :
            level === 'Medium' ? 'text-amber-600' :
            'text-green-600'
          }`}>
            {level}
          </span>
        </div>
        
        <div className="relative">
          <Progress value={strength} className="h-2" />
          <div 
            className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-300 ease-out ${color}`}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-gray-700">Requirements:</span>
        <div className="space-y-1">
          {requirements.map((requirement, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                requirement.met ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <div className={`flex items-center justify-center w-4 h-4 rounded-full transition-all duration-200 ${
                requirement.met 
                  ? 'bg-green-500 text-white scale-100' 
                  : 'bg-gray-200 text-gray-400 scale-95'
              }`}>
                {requirement.met ? (
                  <Check className="w-2.5 h-2.5" />
                ) : (
                  <X className="w-2.5 h-2.5" />
                )}
              </div>
              <span className={`transition-all duration-200 ${
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
