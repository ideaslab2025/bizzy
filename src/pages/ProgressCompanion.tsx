
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProgressCompanion = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 shadow-sm">
        <div className="h-full px-4 md:px-6 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBackClick}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-3 transition-all duration-200 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              Your Business Setup Companion
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Progress Companion Coming Soon!
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your AI-powered business setup companion will help guide you through every step of your entrepreneurial journey with personalized insights and recommendations.
            </p>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-blue-800 text-lg">
                  <Bot className="w-5 h-5" />
                  Smart Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700">
                  Get personalized recommendations based on your business type and progress.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-green-800 text-lg">
                  <Bot className="w-5 h-5" />
                  Progress Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700">
                  Monitor your setup progress and receive milestone celebrations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-purple-800 text-lg">
                  <Bot className="w-5 h-5" />
                  24/7 Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-700">
                  Get instant answers to your business questions anytime.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Button 
              onClick={handleBackClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-base transition-all duration-200 min-h-[48px]"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressCompanion;
