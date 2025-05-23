
import React from 'react';

interface PricingHeaderProps {
  title: string;
  description: string;
}

export const PricingHeader = ({ title, description }: PricingHeaderProps) => {
  return (
    <div className="max-w-3xl mx-auto text-center mb-12">
      <h1 className="text-3xl font-bold mb-4 text-[#3b82f6]">{title}</h1>
      <p className="text-lg text-blue-100">{description}</p>
    </div>
  );
};
