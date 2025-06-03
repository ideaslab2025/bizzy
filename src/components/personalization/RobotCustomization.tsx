
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Palette, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePersonalization } from '@/contexts/PersonalizationContext';

interface RobotCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RobotCustomization: React.FC<RobotCustomizationProps> = ({ isOpen, onClose }) => {
  const { personalization, updatePersonalization } = usePersonalization();
  const [tempName, setTempName] = useState(personalization.robotName);
  const [tempTheme, setTempTheme] = useState(personalization.colorTheme);

  const colorThemes = [
    { value: 'blue', name: 'Ocean Blue', colors: 'from-blue-500 to-blue-600' },
    { value: 'green', name: 'Forest Green', colors: 'from-green-500 to-green-600' },
    { value: 'purple', name: 'Royal Purple', colors: 'from-purple-500 to-purple-600' },
    { value: 'orange', name: 'Sunset Orange', colors: 'from-orange-500 to-orange-600' }
  ];

  const handleSave = () => {
    updatePersonalization({
      robotName: tempName.slice(0, 15), // Max 15 characters
      colorTheme: tempTheme
    });
    onClose();
  };

  const handleCancel = () => {
    setTempName(personalization.robotName);
    setTempTheme(personalization.colorTheme);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Customize Your Companion</h2>
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Robot Name */}
          <div className="space-y-2">
            <Label htmlFor="robotName" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Companion Name
            </Label>
            <Input
              id="robotName"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Enter a name..."
              maxLength={15}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              {tempName.length}/15 characters
            </p>
          </div>

          {/* Color Theme */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color Theme
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {colorThemes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => setTempTheme(theme.value as any)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    tempTheme === theme.value
                      ? 'border-gray-900 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-8 rounded bg-gradient-to-r ${theme.colors} mb-2`} />
                  <p className="text-sm font-medium text-gray-900">{theme.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                colorThemes.find(t => t.value === tempTheme)?.colors
              } mx-auto mb-2 flex items-center justify-center`}>
                <div className="w-6 h-6 bg-white rounded-full" />
              </div>
              <p className="font-medium text-gray-900">
                Hi! I'm {tempName || 'Bizzy'}!
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
