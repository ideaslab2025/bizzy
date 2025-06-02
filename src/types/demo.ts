
export interface DemoContent {
  id: string;
  title: string;
  description: string;
  type: 'guidance' | 'documents' | 'ai-chat' | 'dashboard';
  content: any;
  previewImage?: string;
  isLive?: boolean;
}

export interface DemoTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: DemoContent;
}

export interface DemoState {
  activeTab: string;
  direction: number;
  isTransitioning: boolean;
  userProgress: Record<string, number>;
}

export interface DemoInteraction {
  type: 'click' | 'hover' | 'scroll' | 'gesture';
  target: string;
  data?: any;
}
