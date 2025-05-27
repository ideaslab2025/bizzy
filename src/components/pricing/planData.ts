
import { PlanData } from "./PlanCard";

export const pricingPlans: PlanData[] = [
  {
    id: "bronze",
    title: "Bronze",
    price: "£100",
    gradient: "from-amber-700/80 to-amber-900/60",
    textColor: "text-white",
    borderColor: "#d97706",
    shadowColor: "217, 119, 6",
    buttonBg: "#d97706",
    buttonHoverBg: "#b45309",
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
    gradient: "from-slate-300/80 to-slate-500/60",
    textColor: "text-white",
    borderColor: "#94a3b8",
    shadowColor: "148, 163, 184",
    buttonBg: "#64748b",
    buttonHoverBg: "#475569",
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
    gradient: "from-amber-400/80 to-amber-600/60",
    textColor: "text-white",
    borderColor: "#f59e0b",
    shadowColor: "245, 158, 11",
    buttonBg: "#f59e0b",
    buttonHoverBg: "#d97706",
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
    gradient: "from-slate-50 via-slate-200 to-slate-300",
    textColor: "text-gray-800",
    borderColor: "#94a3b8",
    shadowColor: "71, 85, 105",
    buttonBg: "#1f2937",
    buttonHoverBg: "#111827",
    features: [
      "Everything in Gold",
      "Full access to all resources",
      "Video consultations with experts",
      "Custom document customization"
    ]
  }
];
