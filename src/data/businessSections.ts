
import { 
  Rocket, Banknote, Users, Scale, RefreshCw, 
  Shield, Umbrella, TrendingUp, Monitor, Briefcase 
} from 'lucide-react';

export interface BusinessSection {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  estimatedTime: string;
  deadline?: string;
  subcategories: string[];
  order_number: number;
}

export const businessSections: BusinessSection[] = [
  {
    id: 1,
    title: "Launch Essentials",
    description: "Get your company officially registered and set up with all government requirements.",
    icon: Rocket,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    estimatedTime: "2-3 hours",
    deadline: "Week 1",
    subcategories: ["Business structure", "Company registration", "Legal requirements"],
    order_number: 1
  },
  {
    id: 2,
    title: "Financial Setup",
    description: "Open business accounts, register for taxes, and establish your financial foundation.",
    icon: Banknote,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    estimatedTime: "1-2 hours",
    deadline: "Week 2",
    subcategories: ["Business bank account", "Payment processing", "Financial planning"],
    order_number: 2
  },
  {
    id: 3,
    title: "Employment & HR",
    description: "Register as an employer, set up payroll, and create essential HR policies.",
    icon: Users,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    estimatedTime: "1 hour",
    deadline: "Week 2",
    subcategories: ["Employment law", "Payroll setup", "HR policies"],
    order_number: 3
  },
  {
    id: 4,
    title: "Legal & Compliance",
    description: "Ensure legal compliance with contracts, terms of service, and regulatory requirements.",
    icon: Scale,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    estimatedTime: "2 hours",
    deadline: "Week 3",
    subcategories: ["Legal documents", "Compliance", "Contracts"],
    order_number: 4
  },
  {
    id: 5,
    title: "Ongoing Operations",
    description: "Establish systems for smooth daily operations and long-term business management.",
    icon: RefreshCw,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    estimatedTime: "1-2 hours",
    deadline: "As needed",
    subcategories: ["Operational procedures", "Systems setup", "Process management"],
    order_number: 5
  },
  {
    id: 6,
    title: "Data Protection & GDPR",
    description: "Register with ICO, create privacy policies, and ensure GDPR compliance for your business data handling.",
    icon: Shield,
    iconColor: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    estimatedTime: "2-3 hours",
    deadline: "Week 4",
    subcategories: ["ICO registration", "Privacy policies", "Data handling procedures"],
    order_number: 6
  },
  {
    id: 7,
    title: "Insurance & Risk Management",
    description: "Set up essential business insurance including employers' liability, public liability, and professional indemnity.",
    icon: Umbrella,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    estimatedTime: "1-2 hours",
    deadline: "Week 4",
    subcategories: ["Employers' liability", "Public liability", "Professional indemnity"],
    order_number: 7
  },
  {
    id: 8,
    title: "Business Growth & Scaling",
    description: "Plan for expansion, hiring strategies, and prepare your business for investment and scaling opportunities.",
    icon: TrendingUp,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    estimatedTime: "3-4 hours",
    deadline: "Month 2-3",
    subcategories: ["Hiring plans", "Business expansion", "Investment readiness"],
    order_number: 8
  },
  {
    id: 9,
    title: "Technology & Systems",
    description: "Implement essential software, digital tools, and cybersecurity measures for efficient operations.",
    icon: Monitor,
    iconColor: "text-sky-600",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    estimatedTime: "2-3 hours",
    deadline: "Month 2",
    subcategories: ["Software setup", "Digital tools", "Cybersecurity measures"],
    order_number: 9
  },
  {
    id: 10,
    title: "Sector-Specific Requirements",
    description: "Complete industry-specific registrations, licenses, and compliance requirements for your business sector.",
    icon: Briefcase,
    iconColor: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    estimatedTime: "Variable",
    deadline: "As required",
    subcategories: ["Industry licenses", "Professional registrations", "Special compliance"],
    order_number: 10
  }
];
