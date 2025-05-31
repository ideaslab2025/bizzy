
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const Guidance = () => {
  const guidanceSteps = [
    {
      id: 1,
      title: "Business Registration",
      description: "Register your business with the appropriate authorities",
      status: "completed",
      estimatedTime: "2-3 days"
    },
    {
      id: 2,
      title: "Tax Registration",
      description: "Set up your tax accounts and understand your obligations",
      status: "in-progress",
      estimatedTime: "1-2 days"
    },
    {
      id: 3,
      title: "Banking Setup",
      description: "Open business bank accounts and set up payment processing",
      status: "pending",
      estimatedTime: "3-5 days"
    },
    {
      id: 4,
      title: "Insurance & Compliance",
      description: "Get the necessary insurance and ensure regulatory compliance",
      status: "pending",
      estimatedTime: "1-2 weeks"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Business Setup Guidance</h1>
          <p className="text-gray-600">Step-by-step guide to get your business up and running</p>
        </div>
      </div>

      <div className="grid gap-6">
        {guidanceSteps.map((step, index) => (
          <Card key={step.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                    {step.id}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                    <p className="text-gray-600 mt-1">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(step.status)}
                  {getStatusBadge(step.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Estimated time: {step.estimatedTime}</span>
                </div>
                <Button variant={step.status === 'pending' ? 'default' : 'outline'}>
                  {step.status === 'completed' ? 'Review' : 'Start'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
            
            {index < guidanceSteps.length - 1 && (
              <div className="absolute left-8 top-full w-0.5 h-6 bg-gray-200 transform -translate-x-1/2" />
            )}
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-blue-700 text-sm mb-3">
                Our business experts are here to guide you through each step of the process.
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Guidance;
