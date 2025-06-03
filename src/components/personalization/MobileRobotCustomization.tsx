
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, User, Settings, Eye, Type, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePersonalization } from '@/contexts/PersonalizationContext';

interface MobileRobotCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileRobotCustomization: React.FC<MobileRobotCustomizationProps> = ({ isOpen, onClose }) => {
  const { personalization, updatePersonalization, isMobile } = usePersonalization();
  const [tempName, setTempName] = useState(personalization.robotName);
  const [tempTheme, setTempTheme] = useState(personalization.colorTheme);
  const [tempPreferences, setTempPreferences] = useState(personalization.preferences);
  const [tempAccessibility, setTempAccessibility] = useState(personalization.accessibility);

  const colorThemes = [
    { value: 'blue', name: 'Ocean Blue', colors: 'from-blue-500 to-blue-600', contrast: 'bg-blue-600' },
    { value: 'green', name: 'Forest Green', colors: 'from-green-500 to-green-600', contrast: 'bg-green-600' },
    { value: 'purple', name: 'Royal Purple', colors: 'from-purple-500 to-purple-600', contrast: 'bg-purple-600' },
    { value: 'orange', name: 'Sunset Orange', colors: 'from-orange-500 to-orange-600', contrast: 'bg-orange-600' }
  ];

  const handleSave = () => {
    updatePersonalization({
      robotName: tempName.slice(0, 15),
      colorTheme: tempTheme,
      preferences: tempPreferences,
      accessibility: tempAccessibility
    });
    onClose();
  };

  const handleCancel = () => {
    setTempName(personalization.robotName);
    setTempTheme(personalization.colorTheme);
    setTempPreferences(personalization.preferences);
    setTempAccessibility(personalization.accessibility);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50"
        onClick={handleCancel}
      >
        <motion.div
          initial={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
          animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
          exit={isMobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
          className={`bg-white rounded-t-xl sm:rounded-xl p-4 sm:p-6 w-full sm:max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto ${
            isMobile ? 'rounded-b-none' : ''
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Customize Your Companion
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCancel}
              className="min-h-[44px] min-w-[44px]"
              aria-label="Close customization"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="appearance" className="text-xs sm:text-sm">
                <Palette className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Style
              </TabsTrigger>
              <TabsTrigger value="behavior" className="text-xs sm:text-sm">
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Behavior
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="text-xs sm:text-sm">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Access
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-6">
              {/* Robot Name */}
              <div className="space-y-3">
                <Label htmlFor="robotName" className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-4 h-4" />
                  Companion Name
                </Label>
                <Input
                  id="robotName"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter a name..."
                  maxLength={15}
                  className="w-full text-base"
                  aria-describedby="name-help"
                />
                <p id="name-help" className="text-xs text-gray-500">
                  {tempName.length}/15 characters
                </p>
              </div>

              {/* Color Theme */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Palette className="w-4 h-4" />
                  Color Theme
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {colorThemes.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => setTempTheme(theme.value as any)}
                      className={`p-3 rounded-lg border-2 transition-all min-h-[60px] ${
                        tempTheme === theme.value
                          ? 'border-gray-900 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      aria-label={`Select ${theme.name} theme`}
                    >
                      <div 
                        className={`w-full h-6 rounded mb-2 ${
                          tempAccessibility.screenReaderEnabled ? theme.contrast : `bg-gradient-to-r ${theme.colors}`
                        }`} 
                      />
                      <p className="text-xs font-medium text-gray-900">{theme.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    tempAccessibility.screenReaderEnabled 
                      ? colorThemes.find(t => t.value === tempTheme)?.contrast
                      : `bg-gradient-to-br ${colorThemes.find(t => t.value === tempTheme)?.colors}`
                  }`}>
                    <div className="w-6 h-6 bg-white rounded-full" />
                  </div>
                  <p className="font-medium text-gray-900 text-sm">
                    Hi! I'm {tempName || 'Bizzy'}!
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-6">
              {/* Animation Settings */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Animation Preferences</Label>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Reduced Motion</p>
                    <p className="text-xs text-gray-500">Minimize animations</p>
                  </div>
                  <Switch
                    checked={tempPreferences.reducedMotion}
                    onCheckedChange={(checked) => 
                      setTempPreferences(prev => ({ 
                        ...prev, 
                        reducedMotion: checked,
                        animationSpeed: checked ? 'reduced' : 'normal',
                        celebrationIntensity: checked ? 'minimal' : 'full'
                      }))
                    }
                    aria-label="Toggle reduced motion"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Celebration Effects</p>
                    <p className="text-xs text-gray-500">Full or minimal celebrations</p>
                  </div>
                  <Switch
                    checked={tempPreferences.celebrationIntensity === 'full'}
                    onCheckedChange={(checked) => 
                      setTempPreferences(prev => ({ 
                        ...prev, 
                        celebrationIntensity: checked ? 'full' : 'minimal'
                      }))
                    }
                    disabled={tempPreferences.reducedMotion}
                    aria-label="Toggle celebration intensity"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Message Frequency</p>
                    <p className="text-xs text-gray-500">How often I'll encourage you</p>
                  </div>
                  <Switch
                    checked={tempPreferences.messageFrequency === 'frequent'}
                    onCheckedChange={(checked) => 
                      setTempPreferences(prev => ({ 
                        ...prev, 
                        messageFrequency: checked ? 'frequent' : 'occasional'
                      }))
                    }
                    aria-label="Toggle message frequency"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {tempPreferences.soundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Sound Effects</p>
                      <p className="text-xs text-gray-500">Achievement sounds</p>
                    </div>
                  </div>
                  <Switch
                    checked={tempPreferences.soundEnabled}
                    onCheckedChange={(checked) => 
                      setTempPreferences(prev => ({ ...prev, soundEnabled: checked }))
                    }
                    aria-label="Toggle sound effects"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="accessibility" className="space-y-6">
              <div className="space-y-4">
                <Label className="text-sm font-medium">Accessibility Options</Label>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">High Contrast</p>
                    <p className="text-xs text-gray-500">Increase color contrast</p>
                  </div>
                  <Switch
                    checked={tempPreferences.highContrast}
                    onCheckedChange={(checked) => 
                      setTempPreferences(prev => ({ ...prev, highContrast: checked }))
                    }
                    aria-label="Toggle high contrast mode"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Large Text</p>
                    <p className="text-xs text-gray-500">Increase text size</p>
                  </div>
                  <Switch
                    checked={tempPreferences.textSize === 'large'}
                    onCheckedChange={(checked) => 
                      setTempPreferences(prev => ({ 
                        ...prev, 
                        textSize: checked ? 'large' : 'normal'
                      }))
                    }
                    aria-label="Toggle large text"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Large Touch Targets</p>
                    <p className="text-xs text-gray-500">Bigger buttons for easier tapping</p>
                  </div>
                  <Switch
                    checked={tempAccessibility.touchTargetSize === 'large'}
                    onCheckedChange={(checked) => 
                      setTempAccessibility(prev => ({ 
                        ...prev, 
                        touchTargetSize: checked ? 'large' : 'normal'
                      }))
                    }
                    aria-label="Toggle large touch targets"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Screen Reader Mode</p>
                    <p className="text-xs text-gray-500">Optimized for screen readers</p>
                  </div>
                  <Switch
                    checked={tempAccessibility.screenReaderEnabled}
                    onCheckedChange={(checked) => 
                      setTempAccessibility(prev => ({ ...prev, screenReaderEnabled: checked }))
                    }
                    aria-label="Toggle screen reader optimization"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleCancel} 
              className="flex-1 min-h-[44px]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1 min-h-[44px]"
            >
              Save Changes
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
