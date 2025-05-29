
import { EnhancedGuidanceSection } from '@/types/guidance';

export const guidanceSections: EnhancedGuidanceSection[] = [
  {
    id: 1,
    title: "Launch Essentials",
    description: "Core requirements to get your business started",
    order_number: 1,
    icon: "rocket",
    emoji: "🚀",
    estimated_time_minutes: 120,
    priority_order: 1,
    deadline_days: 30,
    color_theme: "blue",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Financial Setup",
    description: "Set up banking, accounting, and financial systems",
    order_number: 2,
    icon: "dollar-sign",
    emoji: "💰",
    estimated_time_minutes: 90,
    priority_order: 2,
    deadline_days: 45,
    color_theme: "green",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Employment & HR",
    description: "Hiring processes and employee management",
    order_number: 3,
    icon: "users",
    emoji: "👥",
    estimated_time_minutes: 75,
    priority_order: 3,
    deadline_days: 60,
    color_theme: "orange",
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "Legal & Compliance",
    description: "Ensure your business meets all legal requirements",
    order_number: 4,
    icon: "shield",
    emoji: "⚖️",
    estimated_time_minutes: 100,
    priority_order: 4,
    deadline_days: 90,
    color_theme: "red",
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    title: "Ongoing Operations",
    description: "Day-to-day business operations and processes",
    order_number: 5,
    icon: "settings",
    emoji: "⚙️",
    estimated_time_minutes: 60,
    priority_order: 5,
    deadline_days: 120,
    color_theme: "purple",
    created_at: new Date().toISOString()
  }
];
