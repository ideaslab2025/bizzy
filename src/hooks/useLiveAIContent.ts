
import { useState, useEffect } from 'react';

export const useLiveAIContent = () => {
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Real business scenarios based on actual Bizzy use cases
  const businessScenarios = [
    {
      question: "How do I register for PAYE with HMRC?",
      response: "I'll guide you through PAYE registration. First, you'll need your company UTR number and details of your first employee. You can register online through HMRC's Business Tax Account. The process typically takes 5-7 working days."
    },
    {
      question: "What business insurance do I need as a limited company?",
      response: "For a UK limited company, you'll typically need: 1) Public Liability Insurance (£1-6M coverage), 2) Professional Indemnity Insurance if providing services, 3) Employers' Liability Insurance if you have employees. I can help you find suitable providers."
    },
    {
      question: "When is my Corporation Tax return due?",
      response: "Your Corporation Tax return is due 12 months after your accounting period ends. For example, if your accounting period ended on 31st March 2024, your return is due by 31st March 2025. However, you must pay any tax owed within 9 months."
    },
    {
      question: "How do I change my registered office address?",
      response: "To change your registered office address: 1) File form AD01 with Companies House, 2) Update your business address with HMRC, 3) Notify your bank and any business creditors. I can generate the AD01 form for you with your company details pre-filled."
    }
  ];

  const generateAIResponse = async (question: string) => {
    setLoading(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const scenario = businessScenarios.find(s => 
      s.question.toLowerCase().includes(question.toLowerCase().split(' ')[0])
    ) || businessScenarios[0];
    
    setResponses(prev => [...prev, scenario.response]);
    setLoading(false);
    
    return scenario.response;
  };

  const getDemoAIData = () => {
    return {
      sampleQuestions: businessScenarios.map(s => s.question),
      responseTime: '< 2 seconds',
      accuracy: '95%',
      recentQuestions: businessScenarios.slice(0, 3).map(s => s.question),
      conversationStarters: [
        "Help me set up PAYE",
        "What documents do I need?",
        "Check my compliance status"
      ]
    };
  };

  return {
    responses,
    loading,
    demoData: getDemoAIData(),
    generateResponse: generateAIResponse,
    businessScenarios
  };
};
