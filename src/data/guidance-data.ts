
import { EnhancedGuidanceSection } from "@/types/guidance";

export const guidanceSections: EnhancedGuidanceSection[] = [
  {
    id: 1,
    title: "Launch Essentials",
    description: "Get your business started with the basics",
    order_number: 1,
    icon: "rocket",
    estimated_time_minutes: 120,
    priority_order: 1,
    deadline_days: 7,
    color_theme: "blue",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Financial Setup",
    description: "Set up your business finances",
    order_number: 2,
    icon: "dollar-sign",
    estimated_time_minutes: 90,
    priority_order: 2,
    deadline_days: 14,
    color_theme: "green",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Legal & Compliance",
    description: "Ensure your business is legally compliant",
    order_number: 3,
    icon: "shield",
    estimated_time_minutes: 150,
    priority_order: 3,
    deadline_days: 21,
    color_theme: "red",
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "Employment & HR",
    description: "Set up HR processes and employee management",
    order_number: 4,
    icon: "users",
    estimated_time_minutes: 100,
    priority_order: 4,
    deadline_days: 30,
    color_theme: "orange",
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    title: "Ongoing Operations",
    description: "Establish day-to-day business operations",
    order_number: 5,
    icon: "settings",
    estimated_time_minutes: 80,
    priority_order: 5,
    deadline_days: 45,
    color_theme: "purple",
    created_at: new Date().toISOString()
  }
];
