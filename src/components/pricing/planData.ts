
import { PlanData } from "./PlanCard";

export const pricingPlans: PlanData[] = [
  {
    id: "bronze",
    title: "Bronze",
    price: "£100",
    color: "from-amber-700/80 to-amber-900/60",
    textColor: "text-white",
    borderColor: "border-amber-600",
    shadowClass: "shadow-amber-600/50",
    buttonClass: "bg-amber-700 hover:bg-amber-800 border border-amber-600",
    features: [
      "Basic company setup guidance",
      "Essential document templates",
      "Standard support",
      "Basic AI assistant access"
    ]
  },
  {
    id: "silver",
    title: "Silver",
    price: "£200",
    color: "from-slate-300/80 to-slate-500/60",
    textColor: "text-white", 
    borderColor: "border-slate-400",
    shadowClass: "shadow-slate-400/50",
    buttonClass: "bg-slate-600 hover:bg-slate-700 border border-slate-500",
    features: [
      "Everything in Bronze",
      "Extended document library",
      "Tax & compliance guidance",
      "Full AI assistant access"
    ]
  },
  {
    id: "gold",
    title: "Gold",
    price: "£300",
    color: "from-amber-400/80 to-amber-600/60",
    textColor: "text-white",
    borderColor: "border-amber-500",
    shadowClass: "shadow-amber-500/50",
    buttonClass: "bg-blue-900/50 hover:bg-[#1d4ed8]/60 border border-blue-700",
    features: [
      "Everything in Silver",
      "Complete document engine",
      "Advanced sector-specific guidance",
      "Priority support"
    ],
    recommended: true
  },
  {
    id: "platinum",
    title: "Platinum",
    price: "£500",
    color: "from-slate-50 via-slate-200 to-slate-300",
    textColor: "text-gray-800",
    borderColor: "border-slate-400",
    shadowClass: "shadow-slate-300/80",
    buttonClass: "bg-gray-800 hover:bg-gray-700 text-white",
    features: [
      "Everything in Gold",
      "Full access to all resources",
      "Video consultations with experts",
      "Custom document customization"
    ]
  }
];
