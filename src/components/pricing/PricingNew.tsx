
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useNavigate } from 'react-router-dom';

// Plan data with all styling information
const pricingPlans = [
  {
    id: "bronze",
    title: "Bronze",
    price: "£100",
    gradient: "linear-gradient(to bottom, rgba(217, 119, 6, 0.8), rgba(180, 83, 9, 0.6))",
    textColor: "#ffffff",
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
    gradient: "linear-gradient(to bottom, rgba(203, 213, 225, 0.8), rgba(100, 116, 139, 0.6))",
    textColor: "#ffffff",
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
    gradient: "linear-gradient(to bottom, rgba(251, 191, 36, 0.8), rgba(217, 119, 6, 0.6))",
    textColor: "#ffffff",
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
    gradient: "linear-gradient(to bottom, #f8fafc, #e2e8f0, #cbd5e1)",
    textColor: "#1f2937",
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

interface PlanCardProps {
  plan: typeof pricingPlans[0];
  isSelected: boolean;
  onSelect: (planId: string) => void;
  onPurchase: (planId: string) => void;
  isProcessing: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onSelect, onPurchase, isProcessing }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Card styles
  const cardStyle: React.CSSProperties = {
    position: 'relative' as const,
    border: `2px solid ${isSelected ? '#1d4ed8' : plan.borderColor}`,
    borderRadius: '12px',
    padding: '0',
    background: plan.gradient,
    boxShadow: isSelected 
      ? `0 0 0 2px #1d4ed8, 0 25px 50px -12px rgba(29, 78, 216, 0.5)`
      : isHovered 
        ? `0 25px 50px -12px rgba(${plan.shadowColor}, 0.5)`
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transform: `translateY(${isSelected ? '-16px' : isHovered ? '-8px' : '0'}) scale(${isSelected || isHovered ? '1.03' : '1'})`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 24px',
    backgroundColor: isSelected ? '#1d4ed8' : plan.buttonBg,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: isProcessing ? 'not-allowed' : 'pointer',
    transform: isHovered && !isProcessing ? 'translateY(-2px) scale(1.05)' : 'scale(1)',
    boxShadow: isHovered && !isProcessing ? '0 10px 20px -5px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease-out',
    opacity: isProcessing ? 0.7 : 1
  };

  const headerStyle: React.CSSProperties = {
    padding: plan.recommended ? '40px 24px 24px' : '24px',
    textAlign: 'center' as const
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: plan.id === "platinum" ? "#1f2937" : plan.recommended ? "#3b82f6" : plan.textColor,
    marginBottom: '8px'
  };

  const priceStyle: React.CSSProperties = {
    fontSize: '40px',
    fontWeight: 'bold',
    color: plan.id === "platinum" ? "#1f2937" : plan.textColor,
    marginBottom: '4px'
  };

  const descriptionStyle: React.CSSProperties = {
    color: plan.id === "platinum" ? "#4b5563" : plan.textColor,
    opacity: 0.9,
    fontSize: '14px'
  };

  const contentStyle: React.CSSProperties = {
    padding: '0 24px 24px',
    flex: 1
  };

  const featureListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  };

  const featureItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    marginBottom: '12px',
    color: plan.id === "platinum" ? "#4b5563" : plan.textColor,
    fontSize: '14px'
  };

  const checkIconColor = plan.id === "platinum" ? "#1f2937" : "#60a5fa";

  const badgeStyle: React.CSSProperties = {
    position: 'absolute' as const,
    top: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#1d4ed8',
    color: 'white',
    padding: '6px 28px',
    borderRadius: '9999px',
    fontSize: '15px',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    zIndex: 20
  };

  const footerStyle: React.CSSProperties = {
    padding: '24px',
    marginTop: 'auto'
  };

  return (
    <div 
      style={{ position: 'relative', height: '100%' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(plan.id)}
    >
      <div style={cardStyle}>
        {plan.recommended && (
          <div style={badgeStyle}>
            Recommended
          </div>
        )}
        
        <div style={headerStyle}>
          <h3 style={titleStyle}>{plan.title}</h3>
          <div style={priceStyle}>{plan.price}</div>
          <p style={descriptionStyle}>One-time payment</p>
        </div>
        
        <div style={contentStyle}>
          <ul style={featureListStyle}>
            {plan.features.map((feature, i) => (
              <li key={i} style={featureItemStyle}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={checkIconColor}
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  style={{ flexShrink: 0, marginTop: '2px' }}
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div style={footerStyle}>
          <button 
            style={buttonStyle}
            disabled={isProcessing}
            onMouseOver={(e) => {
              if (!isSelected && !isProcessing) {
                e.currentTarget.style.backgroundColor = plan.buttonHoverBg;
              }
            }}
            onMouseOut={(e) => {
              if (!isSelected && !isProcessing) {
                e.currentTarget.style.backgroundColor = isSelected ? '#1d4ed8' : plan.buttonBg;
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isProcessing) {
                if (isSelected) {
                  onPurchase(plan.id);
                } else {
                  onSelect(plan.id);
                }
              }
            }}
          >
            {isProcessing ? "Processing..." : isSelected ? "Purchase Now" : "Select Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Pricing Component
export default function PricingNew() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  const handlePurchasePlan = async (planId: string) => {
    if (!user) {
      toast.error("Please log in to purchase a plan");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { planId },
      });

      if (error) throw error;

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to create payment session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#0a192f',
    padding: '64px 16px'
  };

  const innerContainerStyle: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto'
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center' as const,
    marginBottom: '48px'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '40px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '16px'
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '18px',
    color: '#e5e7eb',
    maxWidth: '768px',
    margin: '0 auto'
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const authPromptStyle: React.CSSProperties = {
    marginTop: '48px',
    textAlign: 'center' as const,
    padding: '24px',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(59, 130, 246, 0.3)'
  };

  const authButtonStyle: React.CSSProperties = {
    padding: '12px 24px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '16px'
  };
  
  return (
    <div style={containerStyle}>
      <div style={innerContainerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Choose Your Plan</h1>
          <p style={descriptionStyle}>
            Select the package that best suits your business needs. All plans include a one-time payment with no recurring fees.
          </p>
        </div>
        
        <div style={gridStyle}>
          {pricingPlans.map((plan) => (
            <PlanCard 
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={handleSelectPlan}
              onPurchase={handlePurchasePlan}
              isProcessing={isLoading}
            />
          ))}
        </div>
        
        {!user && (
          <div style={authPromptStyle}>
            <p style={{ color: '#e5e7eb', fontSize: '18px', margin: 0 }}>
              Please log in to purchase a plan
            </p>
            <button 
              style={authButtonStyle}
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
