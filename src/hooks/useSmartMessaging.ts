
import { usePersonalization } from '@/contexts/PersonalizationContext';

interface MessageOptions {
  progressLevel: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  sessionDuration: number;
  completedSections: number;
  isStuck?: boolean;
}

export const useSmartMessaging = () => {
  const { personalization, isFirstVisit, isReturningUser } = usePersonalization();

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const getWelcomeMessage = (): string => {
    const { robotName } = personalization;
    const timeOfDay = getTimeOfDay();
    
    const timeGreetings = {
      morning: "Good morning!",
      afternoon: "Good afternoon!",
      evening: "Good evening!"
    };

    if (isFirstVisit) {
      return `${timeGreetings[timeOfDay]} I'm ${robotName}, your business setup companion! Let's build something amazing together.`;
    }

    if (isReturningUser) {
      return `${timeGreetings[timeOfDay]} Welcome back! Ready to continue your business journey?`;
    }

    return `${timeGreetings[timeOfDay]} Great to see you again! Let's pick up where we left off.`;
  };

  const getEncouragingMessage = (options: MessageOptions): string => {
    const { robotName } = personalization;
    const { progressLevel, completedSections, isStuck } = options;

    const lowProgressMessages = [
      `Every business starts with the first step, and you're taking it! I believe in you!`,
      `${robotName} here! Building a business is brave - you're already ahead of most people just by starting.`,
      `Progress isn't always fast, but it's always valuable. You're doing great!`,
      `Each task you complete brings your business dream closer to reality!`
    ];

    const goodProgressMessages = [
      `You're making excellent progress! Your dedication is really showing!`,
      `Look at you go! ${completedSections} sections down - you're building something special!`,
      `I'm impressed by your consistency! Keep up this amazing momentum!`,
      `Your business is really taking shape! This is exciting to watch!`
    ];

    const stuckMessages = [
      `Taking your time is smart. Every detail matters for your business success.`,
      `Feeling stuck is normal - it means you're thinking carefully about important decisions.`,
      `Remember, ${robotName} is here to help! Sometimes a small step forward is all you need.`,
      `Quality over speed! Your thoughtful approach will pay off.`
    ];

    const nearCompletionMessages = [
      `You're so close to finishing! Your business setup is almost complete!`,
      `Just a few more steps! You can practically see the finish line from here!`,
      `Nearly there! Your future business is going to thank you for this thoroughness!`
    ];

    let messagePool: string[];

    if (progressLevel >= 80) {
      messagePool = nearCompletionMessages;
    } else if (isStuck) {
      messagePool = stuckMessages;
    } else if (progressLevel >= 40) {
      messagePool = goodProgressMessages;
    } else {
      messagePool = lowProgressMessages;
    }

    return messagePool[Math.floor(Math.random() * messagePool.length)];
  };

  const getContextualMessage = (sectionName: string, action: 'starting' | 'completed'): string => {
    const { robotName } = personalization;

    const contextualMessages = {
      'Company Foundations': {
        starting: `Let's tackle those company foundations! ${robotName} will guide you through each step.`,
        completed: `Foundation complete! Your business has solid ground to build on! 🏗️`
      },
      'Tax Registration': {
        starting: `Tax registration time! I know it sounds complex, but we'll break it down together.`,
        completed: `Tax registration done! You're officially in the system! 📋`
      },
      'Legal Compliance': {
        starting: `Legal compliance is crucial for protection. Let's make sure you're covered!`,
        completed: `Legal compliance complete! Your business is properly protected! ⚖️`
      },
      'HR & Employment': {
        starting: `HR setup time! Building the framework for your future team.`,
        completed: `HR setup complete! Ready to build an amazing team! 👥`
      },
      'Financial Management': {
        starting: `Financial management is key to success. Let's get your money matters sorted!`,
        completed: `Financial systems in place! Your business finances are organized! 💰`
      },
      'Ongoing Compliance': {
        starting: `Staying compliant keeps your business running smoothly. Let's set it up!`,
        completed: `Compliance systems ready! Your business will stay on track! ✅`
      }
    };

    return contextualMessages[sectionName as keyof typeof contextualMessages]?.[action] || 
           `Great work on the ${sectionName} section!`;
  };

  const getSessionMessage = (sessionDuration: number): string | null => {
    const { preferences } = personalization;
    
    if (preferences.messageFrequency === 'occasional') return null;

    if (sessionDuration >= 45) {
      return "You've been working hard for a while! Consider taking a break - I'll be here when you're ready.";
    } else if (sessionDuration >= 20) {
      return "Great focus! You're making real progress on your business setup.";
    }

    return null;
  };

  return {
    getWelcomeMessage,
    getEncouragingMessage,
    getContextualMessage,
    getSessionMessage
  };
};
